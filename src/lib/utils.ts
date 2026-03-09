/**
 * Returns the most recent Friday (or today if today is Friday).
 */
export function getCurrentOrLastFriday(): Date {
  const today = new Date()
  const day = today.getDay() // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  // days since last Friday
  const daysAgo = day >= 5 ? day - 5 : day + 2
  const friday = new Date(today)
  friday.setDate(today.getDate() - daysAgo)
  friday.setHours(0, 0, 0, 0)
  return friday
}

/**
 * Format a date to DD/MM/YYYY
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Format date to ISO date string YYYY-MM-DD for DB comparison
 */
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}
