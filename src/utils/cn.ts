import { clsx, type ClassValue } from "clsx";

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes with proper Tailwind class merging
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}