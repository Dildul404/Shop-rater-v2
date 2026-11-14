<script setup lang="ts">
import type { Shop } from '~/composables/get-shops'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title: string
    shops?: Shop[]
    loading?: boolean
  }>(),
  {
    shops: () => [],
    loading: false,
  },
)

const { getStars } = useStarRating()

// Ambil URL gambar utama, fallback ke gambar pertama
function getPrimaryImage(shop: Shop): string | null {
  if (!shop.images || shop.images.length === 0) return null
  const primary = shop.images.find((img) => img.isPrimary)
  return primary?.url ?? shop.images[0].url
}
</script>

<template>
  <section class="py-10">
    <h2 class="mb-6 text-xl font-bold text-neutral-900">{{ title }}</h2>

    <!-- Skeleton loading -->
    <div v-if="loading" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      <div
        v-for="n in 8"
        :key="n"
        class="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
      >
        <div class="w-full animate-pulse bg-neutral-200" style="aspect-ratio: 6 / 4" />
        <div class="flex flex-col gap-2 p-2 pt-2.5">
          <div class="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div class="h-3 w-full animate-pulse rounded bg-neutral-100" />
          <div class="h-3 w-5/6 animate-pulse rounded bg-neutral-100" />
          <div class="mt-2 h-7 w-full animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </div>

    <!-- Data kosong -->
    <div v-else-if="!shops || shops.length === 0" class="py-20 text-center text-neutral-400">
      Belum ada toko tersedia.
    </div>

    <!-- Grid shops -->
    <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      <div
        v-for="shop in shops"
        :key="shop.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
      >
        <!-- Gambar dengan rasio 6:4 -->
        <div class="relative w-full overflow-hidden" style="aspect-ratio: 6 / 4">
          <img
            v-if="getPrimaryImage(shop)"
            :src="getPrimaryImage(shop)!"
            :alt="shop.name"
            class="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          />
          <!-- Placeholder warna jika belum ada gambar -->
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-400"
          >
            <svg class="size-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          <!-- Badge kategori -->
          <span
            v-if="shop.category?.name"
            class="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
          >
            {{ shop.category.name }}
          </span>
        </div>

        <!-- Konten bawah -->
        <div class="flex flex-1 flex-col gap-2 p-2 pt-2.5">
          <!-- Judul -->
          <h3 class="line-clamp-1 font-semibold text-neutral-900 transition group-hover:text-neutral-600">
            {{ shop.name }}
          </h3>

          <!-- Deskripsi -->
          <p class="line-clamp-2 text-sm leading-relaxed text-neutral-500">
            {{ shop.description }}
          </p>

          <!-- Lokasi ringkas -->
          <p v-if="shop.address?.city" class="flex items-center gap-1 text-xs text-neutral-400">
            <MapPin class="size-3 shrink-0" />
            {{ shop.address.city }}
          </p>

          <!-- Rating bintang -->
          <div class="mt-auto flex items-center justify-between gap-1.5 pt-1">
            <div class="flex items-center gap-0.5">
              <template v-for="(star, i) in getStars(shop.rating?.average ?? 0)" :key="i">
                <!-- Full star -->
                <svg v-if="star === 'full'" class="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
                <!-- Half star -->
                <svg v-else-if="star === 'half'" class="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <defs>
                    <linearGradient :id="`half-${shop.id}-${i}`">
                      <stop offset="50%" stop-color="currentColor" />
                      <stop offset="50%" stop-color="#d1d5db" />
                    </linearGradient>
                  </defs>
                  <path
                    :fill="`url(#half-${shop.id}-${i})`"
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
                  />
                </svg>
                <!-- Empty star -->
                <svg v-else class="size-4 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
              </template>
              <span class="pl-0.5 text-sm font-semibold text-neutral-700">
                {{ (shop.rating?.average ?? 0).toFixed(1) }}
              </span>
              <span class="text-xs text-neutral-400">({{ shop.rating?.totalReviews ?? 0 }})</span>
            </div>

            <!-- Tombol aksi -->
            <div class="flex gap-2">
              <ComponentSheet textButton="Overview" :shop="shop" />
              <Button size="sm" variant="outline">
                <MapPin data-icon="inline-end" /> Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
