import type { ShopAddress } from './shop-address'
import type { ShopCoordinates } from './shop-coordinates'
import type { ShopCategory } from './shop-category'
import type { ShopOperatingHours } from './shop-operating-hours'
import type { ShopContact } from './shop-contact'
import type { ShopSocialMedia } from './shop-social-media'
import type { ShopImage } from './shop-image'
import type { ShopRating } from './shop-rating'

export interface Shop {
    id: number
    name: string
    slug: string
    description: string
    address: ShopAddress
    coordinates: ShopCoordinates
    category: ShopCategory
    operatingHours: ShopOperatingHours[]
    contact: ShopContact
    socialMedia: ShopSocialMedia
    images: ShopImage[]
    rating: ShopRating
    distance?: number
}