<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import type { Shop } from '~/types/shop'

const props = withDefaults(
    defineProps<{
        textButton: string
        shop?: Shop
    }>(),
    {
        shop: undefined,
    },
)

const { getStars } = useStarRating()

function getPrimaryImage(shop?: Shop): string | null {
    if (!shop?.images || shop.images.length === 0) return null
    const primary = shop.images.find((img) => img.isPrimary)
    return primary?.url ?? shop.images[0]?.url ?? null
}
</script>

<template>
    <Sheet>
        <SheetTrigger as-child>
            <Button size="sm">
                {{ textButton }}
            </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <div class="relative w-full overflow-hidden rounded-lg" style="aspect-ratio: 16 / 9">
                    <img
                        v-if="getPrimaryImage(shop)"
                        :src="getPrimaryImage(shop)!"
                        :alt="shop?.name ?? 'Shop image'"
                        class="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                        v-else
                        class="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-400"
                    >
                        <svg class="size-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                        </svg>
                    </div>
                </div>
                <SheetTitle>{{ shop?.name ?? 'Shop Name' }}</SheetTitle>
                <SheetDescription>{{ shop?.description ?? '' }}</SheetDescription>
                
                <!-- Info Tambahan -->
                <div v-if="shop?.address?.street || shop?.address?.city" class="text-xs text-neutral-500">
                    <p>{{ [shop?.address?.street, shop?.address?.city].filter(Boolean).join(', ') }}</p>
                </div>

                <!-- Star -->
                <div class="flex items-center gap-0.5">
                    <template v-for="(star, i) in getStars(shop?.rating?.average ?? 0)" :key="i">
                        <!-- Full star -->
                        <svg v-if="star === 'full'" class="size-4 text-amber-400" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                        <!-- Half star -->
                        <svg v-else-if="star === 'half'" class="size-4 text-amber-400" viewBox="0 0 24 24"
                            fill="currentColor">
                            <defs>
                                <linearGradient :id="`sheet-half-${i}`">
                                    <stop offset="50%" stop-color="currentColor" />
                                    <stop offset="50%" stop-color="#d1d5db" />
                                </linearGradient>
                            </defs>
                            <path :fill="`url(#sheet-half-${i})`"
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                        <!-- Empty star -->
                        <svg v-else class="size-4 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                    </template>
                    <span class="text-sm pl-0.5 font-semibold text-neutral-700">
                        {{ (shop?.rating?.average ?? 0).toFixed(1) }}
                    </span>
                    <span class="text-xs text-neutral-400">({{ shop?.rating?.totalReviews ?? 0 }})</span>
                </div>
            </SheetHeader>
            <SheetFooter>
                <ComponentLocationPicker :search="false" :coordinates="shop?.coordinates"/>
                <NuxtLink :to="'/shop-detail/' + shop?.slug">
                    <Button class="w-full" type="button">
                        Detail
                    </Button>
                </NuxtLink>
                <SheetClose as-child>
                    <Button variant="outline">
                        Close
                    </Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>
