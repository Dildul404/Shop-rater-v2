<script setup lang="ts">
import type { ShopCoordinates } from '~/types/shop/shop-coordinates'

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
</script>

<template>
    <div class="space-y-3">
        <!-- Pencarian -->
        <div v-if="search" class="relative">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari alamat..."
                class="w-full rounded border p-2"
            />

            <p v-if="mapLoading || loading" class="mt-1 text-sm text-gray-500">Mencari...</p>

            <div
                v-if="suggestions.length"
                class="absolute z-10 mt-1 w-full overflow-hidden rounded border bg-white shadow"
            >
                <button
                    v-for="s in suggestions"
                    :key="s.properties.place_id"
                    type="button"
                    class="block w-full p-3 text-left hover:bg-gray-100"
                    @click="selectPlace(s)"
                >
                    {{ s.properties.formatted }}
                </button>
            </div>
        </div>

        <!-- Peta -->
        <div ref="mapEl" class="relative z-0 aspect-video w-full rounded-lg"></div>

        <!-- Hasil -->
        <input
            v-if="search"
            v-model="address"
            type="text"
            placeholder="Alamat"
            class="w-full rounded border p-2"
        />

        <div v-if="search" class="grid grid-cols-2 gap-3">
            <input
                v-model.number="latitude"
                type="number"
                step="any"
                placeholder="Latitude"
                class="rounded border bg-gray-50 p-2"
            />
            <input
                v-model.number="longitude"
                type="number"
                step="any"
                placeholder="Longitude"
                class="rounded border bg-gray-50 p-2"
            />
        </div>
    </div>
</template>
