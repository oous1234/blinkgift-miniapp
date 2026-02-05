import { API_CONFIG } from "../constants/config"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    body?: any,
    params: Record<string, any> = {}
  ): Promise<T> {
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`)

    const tgAuth = {
      id: 8241853306,
      first_name: "ЛинкПро",
      username: "linkproadmin",
      auth_date: 1767463372,
      hash: "f26034faff41934d58242f155c1771d42caf6c753df28d3d61cead61708c6208",
    }

    url.searchParams.append("tgauth", JSON.stringify(tgAuth))

    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val))
      }
    })

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (window.Telegram?.WebApp?.initData) {
      headers["Authorization"] = window.Telegram.WebApp.initData
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Api Error: ${response.statusText}`)
    }

    return response.json()
  }

  static get<T>(path: string, params?: Record<string, any>) {
    return this.request<T>(path, "GET", null, params)
  }

  static post<T>(path: string, body?: any) {
    return this.request<T>(path, "POST", body)
  }
}