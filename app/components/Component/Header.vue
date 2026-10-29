<script setup lang="ts">
const bannerImage =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600'
</script>

<template>
  <section class="mx-auto w-full max-w-full">
    <div class="w-full rounded-[0.35rem] bg-white p-4 shadow-lg">
      <!-- Hero -->
      <div class="mt-4 flex flex-col justify-between gap-4 lg:flex-row">
        <div>
          <h1 class="text-4xl font-black uppercase leading-none lg:text-6xl">
            Your Future,
            <br />
            Our Mission
          </h1>

          <p class="mt-2 text-base text-gray-500">
            Exceeding Standards In Elite Construction
          </p>
        </div>

        <div class="flex items-start lg:items-center">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            Learn More
          </button>
        </div>
      </div>

      <!-- Banner -->
      <div class="relative mt-4 overflow-hidden rounded-[0.25rem]">
        <img
          :src="bannerImage"
          alt="Elite construction"
          class="h-[360px] w-full object-cover"
        />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/30"></div>

        <!-- Bottom Card -->
        <div class="absolute bottom-4 left-4 right-16">
          <div
            class="rounded-[0.25rem] border border-white/20 bg-white/10 p-3 backdrop-blur-md"
          >
            <span
              class="mb-2 inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold text-white"
            >
              NEWS
            </span>

            <h3 class="text-2xl font-bold text-white">
              Leaders in elite construction
            </h3>

            <p class="mt-1 text-sm text-gray-200">
              Our services include construction, interior design,
              architecture, renovation, and property management.
            </p>
          </div>
        </div>

        <!-- Arrow -->
        <button
          type="button"
          aria-label="Lihat detail"
          class="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm"
        >
          ↗
        </button>
      </div>

      <!-- Statistic -->
      <div class="mt-3 grid gap-2 lg:grid-cols-3">
        <div class="rounded-[0.25rem] bg-neutral-100">
          <div class="p-4">
            <div class="flex items-end justify-between">
              <div>
                <h2 class="text-4xl font-black">34</h2>
                <p class="text-xs uppercase text-gray-400">Total Units</p>
              </div>

              <button
                type="button"
                aria-label="Lihat detail"
                class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm text-white transition hover:bg-neutral-700"
              >
                ↗
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-[0.25rem] bg-neutral-100">
          <div class="p-4">
            <div class="flex justify-between">
              <div>
                <h2 class="text-4xl font-black">49K</h2>
                <p class="text-xs uppercase text-gray-400">M² To Built</p>
              </div>

              <span
                class="inline-flex h-6 items-center rounded-full border border-neutral-900 px-2.5 text-xs font-semibold text-neutral-900"
              >
                RELIABLE
              </span>
            </div>
          </div>
        </div>

        <div class="rounded-[0.25rem] bg-neutral-900 text-white">
          <div class="p-4">
            <h2 class="text-4xl font-black">256M</h2>
            <p class="text-xs uppercase text-gray-300">Portfolio Value ($)</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>