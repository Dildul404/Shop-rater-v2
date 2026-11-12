export interface ShopOperatingHours {
  day: DayOfWeek
  open: string | null
  close: string | null
  isClosed: boolean
}

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'