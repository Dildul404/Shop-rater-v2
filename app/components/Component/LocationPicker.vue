<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { MapPin, Loader2, Search, X } from 'lucide-vue-next'
import type { ShopCoordinates } from '~/types/shop/shop-coordinates'
import type { GeoapifyFeature } from '~/composables/useMapPicker'

export type { ShopCoordinates } from '~/types/shop/shop-coordinates'

const props = withDefaults(
    defineProps<{
        search?: boolean
        coordinates?: ShopCoordinates
        loading?: boolean
    }>(),
    {
        search: true,
        loading: false,
    },
)

const mapEl = ref<HTMLElement | null>(null)
const searchContainer = ref<HTMLElement | null>(null)
const isFocused = ref(false)

const initialCenter: [number, number] | undefined = props.coordinates
    ? [props.coordinates.lat, props.coordinates.lng]
    : undefined

const {
    latitude,
    longitude,
    address,
    search: searchQuery,
    suggestions,
    loading: mapLoading,
    selectPlace,
} = useMapPicker(mapEl, {
    center: initialCenter,
})

// Sinkronisasi jika prop coordinates berubah dari parent
watch(
    () => props.coordinates,
    (coords) => {
        if (coords) {
            latitude.value = coords.lat
            longitude.value = coords.lng
        }
    },
    { deep: true },
)

function onSelect(item: GeoapifyFeature) {
    selectPlace(item)
    isFocused.value = false
}

function clearSearch() {
    searchQuery.value = ''
    isFocused.value = false
}

// Tutup dropdown saat klik di luar area input pencarian
function handleClickOutside(event: MouseEvent) {
    if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
        isFocused.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="space-y-3">
        <!-- Pencarian & Autocomplete -->
        <div v-if="search" ref="searchContainer" class="relative">
            <div class="relative flex items-center">
                <Search class="absolute left-3 size-4 text-neutral-400" />
                <input
                    v-model="searchQuery"
                    type="text"
                    autocomplete="off"
                    placeholder="Cari lokasi atau alamat..."
                    class="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-9 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    @focus="isFocused = true"
                />
                <button
                    v-if="searchQuery"
                    type="button"
                    class="absolute right-3 text-neutral-400 hover:text-neutral-700"
                    @click="clearSearch"
                >
                    <X class="size-4" />
                </button>
            </div>

            <!-- Loading indicator -->
            <div
                v-if="mapLoading || loading"
                class="absolute right-3 top-2.5 flex items-center"
            >
                <Loader2 class="size-4 animate-spin text-neutral-500" />
            </div>

            <!-- List Dropdown Autocomplete -->
            <ul
                v-if="isFocused && suggestions.length"
                class="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
            >
                <li
                    v-for="s in suggestions"
                    :key="s.properties.place_id"
                >
                    <button
                        type="button"
                        class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-sm text-neutral-800 transition hover:bg-neutral-100"
                        @click="onSelect(s)"
                    >
                        <MapPin class="mt-0.5 size-4 shrink-0 text-neutral-500" />
                        <span class="line-clamp-2 leading-snug">{{ s.properties.formatted }}</span>
                    </button>
                </li>
            </ul>
        </div>

        <!-- Peta -->
        <div ref="mapEl" class="relative z-0 aspect-video w-full rounded-lg border border-neutral-200"></div>

        <!-- Hasil Alamat & Koordinat -->
        <input
            v-if="search"
            v-model="address"
            name="address"
            type="text"
            readonly
            placeholder="Alamat terpilih"
            class="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-sm text-neutral-700 outline-none"
        />

        <div v-if="search" class="grid grid-cols-2 gap-3">
            <input
                v-model.number="latitude"
                name="latitude"
                type="number"
                step="any"
                readonly
                placeholder="Latitude"
                class="rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-sm text-neutral-700 outline-none"
            />
            <input
                v-model.number="longitude"
                name="longitude"
                type="number"
                step="any"
                readonly
                placeholder="Longitude"
                class="rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-sm text-neutral-700 outline-none"
            />
        </div>
    </div>
</template>
