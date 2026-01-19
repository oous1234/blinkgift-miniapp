// src/infrastructure/apiClient.ts
import Settings from "./settings"
import { getAuthParams } from "./auth"

const API_URL = Settings.apiUrl()

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  params: Record<string, string> = {} // Дополнительные параметры (limit, offset)
): Promise<T> {
  const { tgauth, initData } = getAuthParams()

  // Собираем все query-параметры в одну кучу
  const queryParams = new URLSearchParams({
    ...params,
    tgauth: tgauth, // Автоматически подмешиваем наш хардкод во все GET/POST запросы
  })

  const url = `${API_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}${queryParams.toString()}`

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: initData,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)

  return response.json()
}
