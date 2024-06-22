import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const hasEmptyValues = (data: any): boolean => {
  for (const key in data) {
      if (!data[key]) {
          return true; // Found an empty value
      }
  }
  return false; // No empty values found
};