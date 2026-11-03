<script setup lang="ts">
import type { Shop } from '~/composables/get-shops'
import { Button } from "@/components/ui/button"
import { MapPin } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    title: string
    shops?: Shop[]
  }>(),
  {
    shops: () => [],
  },
)

const { getStars } = useStarRating()
</script>

<template>
  <section class="py-10">
    <h2 class="mb-6 text-xl font-bold text-neutral-900">{{ title }}</h2>

    <!-- Grid minimal 6 card, rasio gambar 5:4 -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      <NuxtLink v-for="shop in shops" :key="shop.id" to="/shop-detail"
        class="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
        <!-- Gambar placeholder dengan rasio 5:4 -->
        <div class="relative w-full" style="aspect-ratio: 16 / 9">
          <div class="absolute inset-0 h-full w-full" :style="{ backgroundColor: shop.color }" />
        </div>

        <!-- Konten bawah -->
        <div class="flex flex-1 flex-col gap-2 p-2 pt-2.5">
          <!-- Judul -->
          <h3 class="font-semibold text-neutral-900 transition group-hover:text-neutral-600">
            {{ shop.title }}
          </h3>

          <!-- Deskripsi -->
          <p class="text-sm leading-relaxed text-neutral-500">
            {{ shop.description }}
          </p>

          <!-- Rating bintang -->
          <div class="mt-auto flex items-center gap-1.5 justify-between">
            <div class="flex items-center gap-0.5">
              <template v-for="(star, i) in getStars(shop.rating)" :key="i">
                <!-- Full star -->
                <svg v-if="star === 'full'" class="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
                <!-- Half star -->
                <svg v-else-if="star === 'half'" class="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <defs>
                    <linearGradient :id="`half-${i}`">
                      <stop offset="50%" stop-color="currentColor" />
                      <stop offset="50%" stop-color="#d1d5db" />
                    </linearGradient>
                  </defs>
                  <path :fill="`url(#half-${i})`"
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
                <!-- Empty star -->
                <svg v-else class="size-4 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
              </template>
              <span class="text-sm pl-0.5 font-semibold text-neutral-700">{{ shop.rating.toFixed(1) }}</span>
            </div>
            <!-- Tombol detail -->
            <div class="flex gap-2">
              <Button size="sm">
                Detail
              </Button>
              <Button size="sm" variant="outline">
                <MapPin data-icon="inline-end" /> Map
              </Button>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
