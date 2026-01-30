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

  // Автоматически добавляем параметры авторизации для стороннего API
  url.searchParams.append("tgauth", AUTH_CONFIG.EXTERNAL_TGAUTH)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value))
    })
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": AUTH_CONFIG.getInitData(),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
  return response.json()
}