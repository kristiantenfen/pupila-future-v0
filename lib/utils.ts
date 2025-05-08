import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getConfigFormato as getFormatConfig } from "@/lib/config-plataformas"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export the function from config-plataformas
export const getConfigFormato = getFormatConfig
