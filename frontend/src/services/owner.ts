import Settings from "@infrastructure/settings"
import { OwnerSearchResponse, PortfolioHistoryResponse, OwnerProfile } from "../types/owner"

export default class OwnerService {
  private static readonly HARDCODED_TGAUTH = JSON.stringify({
    id: 8241853306,
    first_name: "ЛинкПро",
    username: "linkproadmin",
    auth_date: 1767463372,
    hash: "f26034faff41934d58242f155c1771d42caf6c753df28d3d61cead61708c6208",
  })

  private static getTelegramUserId(): string {
    const tgId = window.Telegram.WebApp.initDataUnsafe?.user?.id
    return tgId ? tgId.toString() : "1342062477"
  }

  private static getAuthToken(): string {
    return window.Telegram.WebApp.initData
  }

  // Добавили аргумент customOwnerId
  static async getOwnerInfo(
    range: string = "30d",
    customOwnerId?: string
  ): Promise<PortfolioHistoryResponse> {
    try {
      const targetId = customOwnerId || this.getTelegramUserId()

      const queryParams = new URLSearchParams({
        ownerUuid: targetId,
        range: range,
        tgauth: this.HARDCODED_TGAUTH,
      })

      const url = `${Settings.apiUrl()}/owner?${queryParams.toString()}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthToken(),
        },
      })

      if (!response.ok) throw new Error(`Error: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error("OwnerService Error:", error)
      throw error
    }
  }

  // Метод для получения информации о профиле по ID (нужен для шапки чужого профиля)
  // Мы можем использовать тот же эндпоинт, что и поиск, или просто взять данные из getOwnerInfo если API поддерживает возвращение профиля там
  // Но пока предположим, что мы передаем инфу о юзере через состояние роутера или берем из getOwnerInfo (если бы оно возвращало профиль)
  // Для простоты сейчас будем опираться на то, что имя/аватарку мы передадим при навигации, либо загрузим отдельно.
  // В текущей архитектуре API getOwnerInfo возвращает только историю.

  static async searchOwners(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<OwnerSearchResponse> {
    try {
      const queryParams = new URLSearchParams({
        search_query: query,
        limit: limit.toString(),
        offset: offset.toString(),
        tgauth: this.HARDCODED_TGAUTH,
      })

      const url = `${Settings.apiUrl()}/owner/search?${queryParams.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthToken(),
        },
      })

      if (!response.ok) throw new Error(`Error searching owners: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error("Search owners error:", error)
      throw error
    }
  }
}
