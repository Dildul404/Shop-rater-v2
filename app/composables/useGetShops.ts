import type { Shop } from '~/types/shop'

export type {
  Shop,
  ShopAddress,
  ShopCategory,
  ShopContact,
  ShopCoordinates,
  ShopImage,
  ShopOperatingHours,
  ShopRating,
  ShopSocialMedia,
  DayOfWeek,
} from '~/types/shop'

export const useGetShops = () => {
  const config = useRuntimeConfig()

  const { data: shops, status, error, refresh } = useFetch<Shop[]>(
    `${config.public.apiBase}/api/shops`,
    {
      default: () => [],
    },
  )

  return { shops, status, error, refresh }
}
