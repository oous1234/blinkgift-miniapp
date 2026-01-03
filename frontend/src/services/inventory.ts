import Settings from "@infrastructure/settings"
import { GiftItem } from "../../src/types/inventory"

export default class InventoryService {
  // Получаем токен авторизации так же, как в Wallet.ts
  private static getAuthToken(): string {
    return window.Telegram.WebApp.initData
  }

  static async getItems(): Promise<GiftItem[]> {
    try {
      const response = await fetch(`${Settings.apiUrl()}/inventory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Обязательно передаем initData для валидации на бекенде
          Authorization: this.getAuthToken(),
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`)
      }

      const data = await response.json()

      // Предполагаем, что бекенд возвращает массив, либо поле items
      // Адаптируй этот момент под свой реальный ответ API
      return data.items || data || []
    } catch (error) {
      console.error("InventoryService Error:", error)
      throw error
    }
  }
}
