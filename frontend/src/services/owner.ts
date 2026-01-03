import Settings from "@infrastructure/settings"
import { OwnerProfile } from "../types/owner"

export default class OwnerService {
  // Используем те же данные, что и в inventory.ts для совместимости
  private static readonly HARDCODED_TGAUTH = JSON.stringify({
    id: 8241853306,
    first_name: "ЛинкПро",
    username: "linkproadmin",
    auth_date: 1767463372,
    hash: "f26034faff41934d58242f155c1771d42caf6c753df28d3d61cead61708c6208",
  })

  // В контроллере параметры опциональны, но для теста передадим telegram_id или id
  private static readonly HARDCODED_TELEGRAM_ID = "7804544881"

  private static getAuthToken(): string {
    return window.Telegram.WebApp.initData
  }

  static async getOwnerInfo(): Promise<OwnerProfile> {
    try {
      const queryParams = new URLSearchParams({
        telegram_id: this.HARDCODED_TELEGRAM_ID,
        tgauth: this.HARDCODED_TGAUTH,
        // Можно добавить другие параметры, если нужно:
        // username: "...",
      })

      const url = `${Settings.apiUrl()}/owner?${queryParams.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthToken(),
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching owner info: ${response.statusText}`)
      }

      const data: OwnerProfile = await response.json()
      return data
    } catch (error) {
      console.error("OwnerService Error:", error)
      throw error
    }
  }
}