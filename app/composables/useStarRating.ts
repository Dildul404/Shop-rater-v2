export type StarType = 'full' | 'half' | 'empty'

/**
 * Menghasilkan array 5 elemen bintang berdasarkan nilai rating desimal.
 * Contoh: rating 4.3 → ['full', 'full', 'full', 'full', 'empty']
 *         rating 3.5 → ['full', 'full', 'full', 'half', 'empty']
 */
export const useStarRating = () => {
  const getStars = (rating: number): StarType[] => {
    const stars: StarType[] = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full')
      } else if (rating >= i - 0.5) {
        stars.push('half')
      } else {
        stars.push('empty')
      }
    }
    return stars
  }

  return { getStars }
}

