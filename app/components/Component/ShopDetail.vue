<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Shop } from '~/types/shop'

const props = withDefaults(
  defineProps<{
    shop?: Shop | null
    slug?: string | string[]
  }>(),
  {
    shop: null,
    slug: undefined,
  },
)

// Ambil data cache shops dari key 'shop-list' jika prop shop belum diberikan langsung
const { data: cachedShops } = useNuxtData<Shop[]>('shop-list')

// Jika tidak ada data di cache dan slug disediakan, fetch dari backend
const config = useRuntimeConfig()
const targetSlug = computed(() => {
  if (Array.isArray(props.slug)) return props.slug[0]
  return props.slug
})

const shouldFetch = computed(() => !props.shop && !cachedShops.value?.length && !!targetSlug.value)

const { data: fetchedShops } = await useFetch<Shop[]>(
  () => `${config.public.apiBase}/api/shops`,
  {
    key: 'shop-list',
    immediate: shouldFetch.value,
    default: () => [],
  },
)

// Dapatkan data shop target: dari props.shop, atau dicocokkan dengan slug dari cached/fetched data
const currentShop = computed<Shop | null>(() => {
  if (props.shop) return props.shop

  const list = cachedShops.value?.length ? cachedShops.value : fetchedShops.value
  if (!list || list.length === 0) return null

  if (targetSlug.value) {
    const found = list.find((s) => s.slug === targetSlug.value)
    if (found) return found
  }

  return list[0] ?? null
})

const images = computed(() => currentShop.value?.images ?? [])
const operatingHours = computed(() => currentShop.value?.operatingHours ?? [])

// Slider gambar
const current = ref(0)
watch(images, () => (current.value = 0))

function prev() {
  if (!images.value.length) return
  current.value = (current.value - 1 + images.value.length) % images.value.length
}
function next() {
  if (!images.value.length) return
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
        <!-- Profile & Images -->
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
                    :key="img.id || i"
                    class="flex w-full shrink-0 items-center justify-center"
                  >
                    <img
                      class="max-h-100 w-full object-cover"
                      :src="img.url"
                      :alt="img.alt || currentShop?.name || 'Shop image'"
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

            <img
              v-else
              class="h-auto w-full opacity-40"
              src="~/assets/css/images/broke-img.svg"
              alt="No Image"
            />
          </div>

          <div class="mt-4 flex flex-col gap-3">
            <div class="flex items-center justify-between gap-2">
              <h2 v-if="currentShop?.name" class="text-3xl font-bold text-neutral-900">
                {{ currentShop.name }}
              </h2>
              <div v-else class="h-10 w-48 rounded bg-neutral-100"></div>

              <span
                v-if="currentShop?.category?.name"
                class="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800"
              >
                {{ currentShop.category.name }}
              </span>
            </div>

            <div class="flex flex-col gap-2 py-2">
              <!-- Contact & Social Media Info jika ada -->
              <p v-if="currentShop?.contact?.phone" class="text-sm font-medium text-neutral-700">
                Phone: <span class="font-normal text-neutral-600">{{ currentShop.contact.phone }}</span>
              </p>

              <p v-if="currentShop?.contact?.email" class="text-sm font-medium text-neutral-700">
                Email: <span class="font-normal text-neutral-600">{{ currentShop.contact.email }}</span>
              </p>

              <template v-if="!currentShop">
                <div class="h-4 rounded bg-neutral-100"></div>
                <div class="h-4 rounded bg-neutral-100"></div>
                <div class="h-4 rounded bg-neutral-100"></div>
              </template>
            </div>
          </div>
        </div>

        <!-- Operating Hours / Business Days -->
        <div :class="card">
          <h3 class="mb-4 text-lg font-bold text-neutral-900">Operating Schedule</h3>

          <!-- Schedule list -->
          <div class="space-y-3">
            <template v-if="operatingHours.length">
              <div
                v-for="(h, i) in operatingHours"
                :key="i"
                class="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2.5 text-sm"
              >
                <span class="font-medium capitalize text-neutral-900">{{ h.day }}</span>
                <span v-if="h.isClosed" class="text-red-500 font-medium">Tutup</span>
                <span v-else class="text-neutral-600 font-normal">
                  {{ formatTime(h.open) }} - {{ formatTime(h.close) }}
                </span>
              </div>
            </template>
            <template v-else-if="!currentShop">
              <div v-for="n in 3" :key="n" class="h-10 rounded bg-neutral-100"></div>
            </template>
            <p v-else class="text-sm text-neutral-400">Jadwal operasional belum tersedia.</p>
          </div>
        </div>
      </div>

      <!-- KANAN -->
      <div class="space-y-6">
        <!-- Location -->
        <div :class="card">
          <div class="w-full">
            <template v-if="currentShop?.coordinates?.lat && currentShop?.coordinates?.lng">
              <ComponentLocationPicker
                :search="false"
                :coordinates="currentShop.coordinates"
              />
            </template>
            <img
              v-else
              class="h-auto w-full opacity-40"
              src="~/assets/css/images/broke-location.svg"
              alt="Location Map"
            />
          </div>

          <div class="mt-4 flex flex-col gap-2">
            <template v-if="currentShop?.address">
              <h3 class="text-lg font-bold">Address</h3>
              <p class="leading-relaxed text-neutral-900/80">
                {{
                  [
                    currentShop.address.street,
                    currentShop.address.district,
                    currentShop.address.city,
                    currentShop.address.province,
                    currentShop.address.postalCode,
                    currentShop.address.country,
                  ]
                    .filter(Boolean)
                    .join(', ') || 'Alamat tidak tersedia'
                }}
              </p>
            </template>
            <div v-else class="h-10 bg-neutral-100"></div>
          </div>
        </div>

        <!-- Description -->
        <div :class="card">
          <h3 class="mb-3 text-lg font-bold">Description</h3>
          <div class="space-y-3">
            <p v-if="currentShop?.description" class="whitespace-pre-line leading-relaxed text-neutral-900/80">
              {{ currentShop.description }}
            </p>
            <template v-else-if="!currentShop">
              <div v-for="n in 3" :key="n" class="h-4 rounded bg-neutral-100"></div>
            </template>
            <p v-else class="text-sm text-neutral-400">Deskripsi belum tersedia.</p>
          </div>
        </div>

        <!-- Rating Overview / Reviews -->
        <div :class="card">
          <h3 class="mb-4 text-lg font-bold">Rating & Reviews</h3>
          <div v-if="currentShop?.rating" class="flex items-center gap-3">
            <span class="text-4xl font-extrabold text-neutral-900">
              {{ currentShop.rating.average.toFixed(1) }}
            </span>
            <div class="flex flex-col text-sm text-neutral-500">
              <span class="font-medium text-neutral-800">Skor rata-rata</span>
              <span>{{ currentShop.rating.totalReviews }} ulasan total</span>
            </div>
          </div>
          <div v-else-if="!currentShop" class="h-12 rounded bg-neutral-100"></div>
        </div>
      </div>
    </div>
  </section>
</template>
