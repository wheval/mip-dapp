import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a human-readable format
 * @param dateString - The date string to format
 * @returns Formatted date string in 'MMM d, yyyy' format, or original string if parsing fails
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch {
    return dateString
  }
} 

/**
 * Shortens a wallet address to a specified number of characters
 * @param address - The wallet address to shorten
 * @param chars - The number of characters to keep on each side of the ellipsis
 * @returns The shortened wallet address
 */
export const shortenAddress = (address: string, chars = 6): string => {
    if (!address) return ""
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
}