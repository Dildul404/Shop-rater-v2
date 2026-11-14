<script setup lang="ts">
const { shops, status } = useGetShops()
</script>

<template>
  <ComponentHeader />
  <ComponentSkeleton title="Shops" :shops="shops" :loading="status === 'pending'" />
</template>
