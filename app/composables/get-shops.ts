export interface ShopImage {
  id: number
  url: string
  alt: string
  isPrimary: boolean
}

export interface ShopRating {
  average: number
  totalReviews: number
}

export interface ShopAddress {
  street: string
  district: string
  city: string
  province: string
  postalCode: string
  country: string
}

export interface ShopCategory {
  id: number
  name: string
  slug: string
  icon?: string
}

export interface ShopOperatingHours {
  day: string
  open: string | null
  close: string | null
  isClosed: boolean
}

export interface Shop {
  id: number
  name: string
  slug: string
  description: string
  address: ShopAddress
  category: ShopCategory
  operatingHours: ShopOperatingHours[]
  images: ShopImage[]
  rating: ShopRating
}

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
