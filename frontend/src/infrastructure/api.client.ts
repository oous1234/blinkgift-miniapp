import Settings from "./settings"

const API_URL = Settings.apiUrl()

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface RequestOptions {
  method?: HttpMethod
  body?: any
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
}

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, params, headers } = options

  const url = new URL(`${API_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value))
    })
  }

  // Добавляем tgauth в query, как того требует текущий бэкенд (судя по коду)
  const initData = window.Telegram?.WebApp?.initData || ""
  // Если нужно передавать в заголовках:
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": initData,
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, response.statusText, errorData)
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new Error("Network request failed")
  }
}