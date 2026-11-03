<script setup lang="ts">
const shops = useGetShops()
</script>

<template>
  <ComponentHeader />
  <ComponentSkeleton title="Shops" :shops="shops" />
</template>
