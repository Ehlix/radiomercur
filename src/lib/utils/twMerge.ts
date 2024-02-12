import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { camelize, getCurrentInstance, toHandlerKey } from 'vue'

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));




// import { type ClassValue, clsx } from 'clsx'
// import { twMerge } from 'tailwind-merge'
// import { camelize, getCurrentInstance, toHandlerKey } from 'vue'

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
