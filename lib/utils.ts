import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createUrl(url: string, params?: Record<string, string>) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000";

  const urlObj = new URL(url, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
  }

  return urlObj.toString();
}
