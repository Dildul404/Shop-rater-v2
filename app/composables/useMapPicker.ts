import type { Map as LeafletMap, Marker } from 'leaflet'

export interface GeoapifyFeature {
    properties: {
        place_id: string
        formatted: string
        lat: number
        lon: number
    }
}

interface GeoapifyResponse {
    features: GeoapifyFeature[]
}

export interface MapPickerOptions {
    center?: [number, number]
    zoom?: number
}

export const useMapPicker = (
    mapEl: Ref<HTMLElement | null>,
    options: MapPickerOptions = {},
) => {
    const config = useRuntimeConfig()
    const { center = [-6.9175, 107.6191], zoom = 15 } = options

    // State
    const latitude = ref<number>(center[0])
    const longitude = ref<number>(center[1])
    const address = ref('')
    const search = ref('')
    const suggestions = ref<GeoapifyFeature[]>([])
    const loading = ref(false)

    // Instance non-reaktif (tidak perlu masuk ke ref)
    let map: LeafletMap | null = null
    let marker: Marker | null = null
    let timer: ReturnType<typeof setTimeout> | null = null
    let controller: AbortController | null = null
    let skipNextSearch = false

    function setPosition(lat: number, lng: number) {
        latitude.value = lat
        longitude.value = lng
        marker?.setLatLng([lat, lng])
    }

    // Inisialisasi peta (hanya jalan di browser)
    onMounted(async () => {
        if (!mapEl.value) return

        const L = (await import('leaflet')).default

        const [iconRetina, icon, shadow] = await Promise.all([
            import('leaflet/dist/images/marker-icon-2x.png'),
            import('leaflet/dist/images/marker-icon.png'),
            import('leaflet/dist/images/marker-shadow.png'),
        ])

        const defaultIcon = L.icon({
            iconUrl: icon.default,
            iconRetinaUrl: iconRetina.default,
            shadowUrl: shadow.default,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        })

        map = L.map(mapEl.value).setView(center, zoom)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)

        marker = L.marker(center, { draggable: true, icon: defaultIcon }).addTo(map)

        marker.on('dragend', () => {
            const pos = marker!.getLatLng()
            setPosition(pos.lat, pos.lng)
        })

        map.on('click', (e) => {
            setPosition(e.latlng.lat, e.latlng.lng)
        })
    })

    // Autocomplete (dengan debounce)
    async function fetchSuggestions(text: string) {
        controller?.abort()
        controller = new AbortController()
        loading.value = true

        try {
            const data = await $fetch<GeoapifyResponse>(
                'https://api.geoapify.com/v1/geocode/autocomplete',
                {
                    query: {
                        text,
                        lang: 'id',
                        limit: 5,
                        apiKey: config.public.geoapifyKey,
                    },
                    signal: controller.signal,
                },
            )
            suggestions.value = data.features
        } catch (err: any) {
            if (err?.name !== 'AbortError') {
                console.error('Gagal mengambil saran alamat', err)
                suggestions.value = []
            }
        } finally {
            loading.value = false
        }
    }

    watch(search, (value) => {
        if (timer) clearTimeout(timer)

        // Lewati pencarian saat nilai diisi oleh selectPlace
        if (skipNextSearch) {
            skipNextSearch = false
            return
        }

        if (value.trim().length < 3) {
            suggestions.value = []
            return
        }

        timer = setTimeout(() => fetchSuggestions(value.trim()), 400)
    })

    // Pilih salah satu hasil
    function selectPlace(feature: GeoapifyFeature) {
        const { lat, lon, formatted } = feature.properties

        address.value = formatted

        skipNextSearch = true
        search.value = formatted

        setPosition(lat, lon)
        map?.setView([lat, lon], 17)

        suggestions.value = []
    }

    // Cleanup
    onBeforeUnmount(() => {
        if (timer) clearTimeout(timer)
        controller?.abort()
        map?.remove()
        map = null
        marker = null
    })

    return {
        latitude,
        longitude,
        address,
        search,
        suggestions,
        loading,
        selectPlace,
    }
}