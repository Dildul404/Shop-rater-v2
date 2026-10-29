<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface ShopImage {
  file_path: string
}
interface BusinessDay {
  day: string
}
interface Shop {
  shop_name?: string | null
  motto?: string | null
  owner_name?: string | null
  images?: ShopImage[]
  businessDays?: BusinessDay[]
  work_time_from?: string | null
  work_time_to?: string | null
  location?: string | null
  description?: string | null
}

const props = withDefaults(defineProps<{ shop?: Shop | null }>(), {
  shop: null,
})

const images = computed(() => props.shop?.images ?? [])
const days = computed(() => props.shop?.businessDays ?? [])

// Slider
const current = ref(0)
watch(images, () => (current.value = 0))

function prev() {
  current.value = (current.value - 1 + images.value.length) % images.value.length
}
function next() {
  current.value = (current.value + 1) % images.value.length
}

// "08:00:00" -> "08:00"
const formatTime = (t?: string | null) => (t ? t.slice(0, 5) : '')

const card = 'rounded-2xl border border-neutral-200 bg-white p-6'
</script>

<template>
  <section class="w-full">
    <div class="grid gap-6 shop-detail-grid">
      <!-- KIRI -->
      <div class="space-y-6">
        <!-- Profile -->
        <div :class="card">
          <div class="relative w-full">
            <template v-if="images.length">
              <div class="w-full overflow-hidden rounded-2xl">
                <div
                  class="flex w-full transition-transform duration-300 ease-in-out"
                  :style="{ transform: `translateX(-${current * 100}%)` }"
                >
                  <div
                    v-for="(img, i) in images"
                    :key="i"
                    class="flex w-full shrink-0 items-center justify-center"
                  >
                    <img
                      class="max-h-100 w-full object-cover"
                      :src="`/storage/${img.file_path}`"
                      :alt="shop?.shop_name ?? 'Shop image'"
                    />
                  </div>
                </div>
              </div>

              <template v-if="images.length > 1">
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  class="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-sm text-neutral-900 shadow-md transition hover:bg-neutral-100"
                  @click="prev"
                >
                  ❮
                </button>
                <button
                  type="button"
                  aria-label="Berikutnya"
                  class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-sm text-neutral-900 shadow-md transition hover:bg-neutral-100"
                  @click="next"
                >
                  ❯
                </button>
              </template>
            </template>

            <img v-else class="h-auto w-full opacity-40" src="~/assets/css/images/broke-img.svg" alt="No Image" />
          </div>

          <div class="mt-4 flex flex-col gap-3">
            <h2 v-if="shop?.shop_name" class="text-3xl font-bold text-neutral-900">
              {{ shop.shop_name }}
            </h2>
            <div v-else class="h-10 bg-neutral-100"></div>

            <div class="flex flex-col gap-2 py-2">
              <p v-if="shop?.motto" class="text-lg italic text-neutral-900/70">"{{ shop.motto }}"</p>

              <p v-if="shop?.owner_name" class="mt-2 text-base font-medium">
                Owner: <span class="font-normal">{{ shop.owner_name }}</span>
              </p>
              <template v-else-if="!shop || (!shop.motto && !shop.owner_name)">
                <div class="h-4 rounded bg-neutral-100"></div>
                <div class="h-4 rounded bg-neutral-100"></div>
                <div class="h-4 rounded bg-neutral-100"></div>
              </template>
            </div>
          </div>
        </div>

        <!-- Appointment -->
        <div :class="card">
          <!-- Business days -->
          <div class="mb-6 flex flex-wrap gap-2">
            <template v-if="days.length">
              <div
                v-for="(d, i) in days"
                :key="i"
                class="rounded-2xl bg-neutral-100 px-4 py-2 font-medium text-neutral-900"
              >
                {{ d.day }}
              </div>
            </template>
            <template v-else>
              <div v-for="n in 3" :key="n" class="h-10 w-36 rounded bg-neutral-100"></div>
            </template>
          </div>

          <!-- Work hours -->
          <div class="space-y-4">
            <div
              v-if="shop?.work_time_from && shop?.work_time_to"
              class="flex flex-col gap-1 rounded-2xl border border-neutral-100 bg-neutral-100/50 p-5"
            >
              <span class="text-lg font-bold">Operating Hours</span>
              <span class="text-neutral-900/80">
                {{ formatTime(shop.work_time_from) }} - {{ formatTime(shop.work_time_to) }}
              </span>
            </div>
            <template v-else>
              <div v-for="n in 3" :key="n" class="h-24 rounded bg-neutral-100"></div>
            </template>
          </div>
        </div>
      </div>

      <!-- KANAN -->
      <div class="space-y-6">
        <!-- Location -->
        <div :class="card">
          <div class="w-full">
            <!-- Ganti dengan peta/iframe asli bila sudah siap -->
            <img class="h-auto w-full opacity-40" src="~/assets/css/images/broke-location.svg" alt="Location Map" />
          </div>

          <div class="mt-4 flex flex-col gap-3">
            <template v-if="shop?.location">
              <h3 class="text-lg font-bold">Address</h3>
              <p class="leading-relaxed text-neutral-900/80">{{ shop.location }}</p>
            </template>
            <div v-else class="h-10 bg-neutral-100"></div>
          </div>
        </div>

        <!-- Description -->
        <div :class="card">
          <h3 class="mb-3 text-lg font-bold">Description</h3>
          <div class="space-y-3">
            <p v-if="shop?.description" class="whitespace-pre-line leading-relaxed text-neutral-900/80">
              {{ shop.description }}
            </p>
            <template v-else>
              <div v-for="n in 3" :key="n" class="h-4 rounded bg-neutral-100"></div>
            </template>
          </div>

          <div v-if="!shop?.description" class="mt-6 h-10 w-32 rounded bg-neutral-200"></div>
        </div>

        <!-- Gallery -->
        <div :class="card">
          <h3 class="mb-4 text-lg font-bold">Gallery</h3>
          <div class="space-y-3">
            <div v-for="n in 4" :key="n" class="h-16 rounded bg-neutral-100"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
