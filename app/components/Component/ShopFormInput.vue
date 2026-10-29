<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps<{
  action: string
  csrfToken?: string
}>()

const inputClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 read-only:bg-neutral-100'

const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

// Preview gambar
const fileInput = ref<HTMLInputElement | null>(null)
const previews = ref<{ name: string; url: string }[]>([])
const isDragging = ref(false)

function clearPreviews() {
  previews.value.forEach((p) => URL.revokeObjectURL(p.url))
  previews.value = []
}

function buildPreviews(files: FileList | null) {
  clearPreviews()
  if (!files) return
  previews.value = Array.from(files)
    .filter((f) => f.type.startsWith('image/'))
    .map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
}

function onFileChange(e: Event) {
  buildPreviews((e.target as HTMLInputElement).files)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files || !fileInput.value) return
  fileInput.value.files = files
  buildPreviews(files)
}

onBeforeUnmount(clearPreviews)

// Lokasi (isi dari library peta Anda, mis. Leaflet)
const mapEl = ref<HTMLDivElement | null>(null)
const search = ref('')
const address = ref('')
const lat = ref('')
const lon = ref('')
const suggestions = ref<{ label: string; lat: string; lon: string }[]>([])

function pickSuggestion(s: { label: string; lat: string; lon: string }) {
  search.value = s.label
  address.value = s.label
  lat.value = s.lat
  lon.value = s.lon
  suggestions.value = []
}
</script>

<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto w-full max-w-4xl rounded-2xl border border-neutral-200 bg-white shadow-xl">
      <div class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="flex items-center gap-3 text-3xl font-bold text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M5 4h14q.425 0 .713.288T20 5t-.288.713T19 6H5q-.425 0-.712-.288T4 5t.288-.712T5 4m0 16q-.425 0-.712-.288T4 19v-5h-.175q-.475 0-.775-.363t-.2-.837l1-5q.075-.35.35-.575T4.825 7h14.35q.35 0 .625.225t.35.575l1 5q.1.475-.2.837t-.775.363H20v5q0 .425-.288.713T19 20t-.712-.288T18 19v-5h-4v5q0 .425-.288.713T13 20zm1-2h6v-4H6zm-.95-6h13.9zm0 0h13.9l-.6-3H5.65z"
              />
            </svg>
            Upload new shop
          </h2>
          <p class="mt-2 text-neutral-900/70">Set up a new shop to be rated.</p>
        </div>

        <hr class="my-6 border-neutral-200" />

        <form class="space-y-6" :action="props.action" method="POST" enctype="multipart/form-data">
          <input v-if="props.csrfToken" type="hidden" name="_token" :value="props.csrfToken" />

          <!-- Upload -->
          <div>
            <label
              class="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white transition hover:border-neutral-900 hover:bg-neutral-100"
              :class="isDragging ? 'border-neutral-900 bg-neutral-100' : 'border-neutral-300'"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mb-4 size-10 text-neutral-900/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16V4m0 0l-4 4m4-4l4 4M4 16.5A2.5 2.5 0 006.5 19h11a2.5 2.5 0 002.5-2.5A2.5 2.5 0 0017.5 14H17a5 5 0 10-10 0h-.5A2.5 2.5 0 004 16.5z"
                />
              </svg>

              <p class="text-lg font-medium text-neutral-900">Select a file or drag and drop here</p>
              <p class="text-sm text-neutral-900/60">JPG, PNG or PDF, file size no more than 10MB</p>

              <input
                ref="fileInput"
                type="file"
                class="hidden"
                name="shop-images[]"
                multiple
                accept="image/*"
                @change="onFileChange"
              />
            </label>

            <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              <img
                v-for="p in previews"
                :key="p.url"
                :src="p.url"
                :alt="p.name"
                class="aspect-square w-full rounded-lg object-cover"
              />
            </div>
          </div>

          <!-- Row: nama -->
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label for="shop-name" class="mb-1 block text-sm font-semibold">
                Shop Name <span class="text-red-600">*</span>
              </label>
              <input id="shop-name" name="shop-name" type="text" placeholder="Enter shop name" :class="inputClass" />
            </div>

            <div>
              <label for="owner-name" class="mb-1 block text-sm font-semibold">Owner Name (Optional)</label>
              <input id="owner-name" name="owner-name" type="text" placeholder="Enter owner name" :class="inputClass" />
            </div>
          </div>

          <!-- Row: jam & hari -->
          <div class="grid grid-cols-1 gap-5 md:grid-cols-[1fr_3fr]">
            <fieldset>
              <legend class="mb-1 text-sm font-semibold">
                Work time <span class="text-red-600">*</span>
              </legend>
              <div class="space-y-2">
                <input name="time-from" type="time" aria-label="Opening time" :class="inputClass" />
                <input name="time-to" type="time" aria-label="Closing time" :class="inputClass" />
              </div>
            </fieldset>

            <fieldset>
              <legend class="mb-1 text-sm font-semibold">
                Business day <span class="text-red-600">*</span>
              </legend>
              <div class="grid grid-cols-[repeat(auto-fit,minmax(90px,1fr))] gap-5 text-center">
                <label v-for="d in days" :key="d.value" class="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    name="bussiness-days[]"
                    type="checkbox"
                    :value="d.value"
                    class="size-4 rounded border-neutral-300 accent-neutral-900"
                  />
                  {{ d.label }}
                </label>
              </div>
            </fieldset>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="mb-1 block text-sm font-semibold">
              Description <span class="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your shop"
              :class="[inputClass, 'h-32 resize-none']"
            ></textarea>
          </div>

          <!-- Motto -->
          <div>
            <label for="motto" class="mb-1 block text-sm font-semibold">
              Motto <span class="text-red-600">*</span>
            </label>
            <input id="motto" name="motto" type="text" placeholder="Enter motto" :class="inputClass" />
          </div>

          <!-- Location -->
          <fieldset class="space-y-2">
            <legend class="mb-1 text-sm font-semibold">
              Location <span class="text-red-600">*</span>
            </legend>

            <input v-model="search" name="location" type="text" placeholder="Search location..." :class="inputClass" />

            <ul v-if="suggestions.length" class="rounded-2xl bg-white shadow">
              <li v-for="s in suggestions" :key="s.label">
                <button
                  type="button"
                  class="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100"
                  @click="pickSuggestion(s)"
                >
                  {{ s.label }}
                </button>
              </li>
            </ul>

            <div ref="mapEl" class="h-80 rounded-2xl bg-neutral-200"></div>

            <input v-model="address" name="address" readonly :class="inputClass" />
            <input v-model="lat" name="latitude" readonly :class="inputClass" />
            <input v-model="lon" name="longitude" readonly :class="inputClass" />
          </fieldset>

          <hr class="my-6 border-neutral-200" />

          <!-- Action -->
          <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-lg border border-neutral-300 px-5 py-2 text-sm font-semibold transition hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>