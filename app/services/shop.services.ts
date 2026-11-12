import type { Shop } from '~/types/shop'

type Fetcher = typeof $fetch

export const createShopService = (api: Fetcher) => ({
    getAll: () => api<Shop[]>('/api/shops'),
})