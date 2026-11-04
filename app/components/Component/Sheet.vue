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

interface Shop {
    id: number
    title: string
    description: string
    rating: number
    color: string
}

withDefaults(
    defineProps<{
        textButton: string
        shop?: Shop
    }>(),
    {
        shop: () => ({
            id: 1,
            title: 'Title',
            description: 'Description',
            rating: 4.7,
            color: '#6F4E37',
        }),
    },
)

const { getStars } = useStarRating()
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
                <div class="relative w-full" style="aspect-ratio: 16 / 9">
                    <div class="absolute inset-0 h-full w-full" :style="{ backgroundColor: shop.color }" />
                </div>
                <SheetTitle>{{ shop.title }}</SheetTitle>
                <SheetDescription>{{ shop.description }}</SheetDescription>
                <!-- Star -->
                <div class="flex items-center gap-0.5">
                    <template v-for="(star, i) in getStars(shop.rating)" :key="i">
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
                                <linearGradient :id="`half-${i}`">
                                    <stop offset="50%" stop-color="currentColor" />
                                    <stop offset="50%" stop-color="#d1d5db" />
                                </linearGradient>
                            </defs>
                            <path :fill="`url(#half-${i})`"
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                        <!-- Empty star -->
                        <svg v-else class="size-4 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                    </template>
                    <span class="text-sm pl-0.5 font-semibold text-neutral-700">{{ shop.rating.toFixed(1) }}</span>
                </div>
            </SheetHeader>
            <SheetFooter>
                <NuxtLink to="shop-detail">
                    <Button class="w-full" type="submit">
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