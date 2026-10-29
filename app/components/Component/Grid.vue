<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="py-20">
    <h2 class="mb-3 text-xl font-bold text-neutral-900">{{ title }}</h2>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
      <div
        v-for="n in 4"
        :key="n"
        class="h-32 animate-pulse rounded-lg bg-neutral-200"
      ></div>
    </div>
  </section>
</template>
