// frontend/src/infrastructure/apiClient.ts

import Settings from "./settings"
import { AUTH_CONFIG } from "./auth"

const API_URL = Settings.apiUrl()

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`)

  const initData = AUTH_CONFIG.getInitData()

  const tgAuthValue = AUTH_CONFIG.EXTERNAL_TGAUTH

  url.searchParams.append("tgauth", tgAuthValue)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value))
    })
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (initData) {
    headers["Authorization"] = initData
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: (method !== "GET" && body) ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error(`[API Error] ${response.status}:`, errorBody);

    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}