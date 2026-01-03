import Settings from "@infrastructure/settings"
import { GiftItem, ApiGiftItem } from "../../src/types/inventory"

export default class InventoryService {

  // та самая константа, которую ты просил
  private static readonly HARDCODED_TGAUTH = JSON.stringify({
    "id": 1342062477,
    "first_name": "ceawse",
    "username": "ceawse",
    "photo_url": "https://t.me/i/userpic/320/NM1RHMIvtVDrvMyuZXE-VkglHoqyqOBKg6vze94rxHM.jpg",
    "auth_date": 1767447329,
    "hash": "bcd97d9231374c73a0592db4428df53a14c1c1257ab26c0dc58251482f4eb8e0"
  });

  // ID пользователя из твоей константы, чтобы Poso вернул данные именно для этого юзера
  private static readonly HARDCODED_USER_ID = "08972bac-5100-5807-854e-f5018d41b7f3";

  // Этот метод НЕ ТРОГАЕМ, как ты и сказал
  private static getAuthToken(): string {
    return window.Telegram.WebApp.initData
  }

  static async getItems(): Promise<GiftItem[]> {
    try {
      // Формируем query parameters для URL
      const queryParams = new URLSearchParams({
        current_owner_id: this.HARDCODED_USER_ID,
        tgauth: this.HARDCODED_TGAUTH
      })

      // Добавляем параметры к URL
      const url = `${Settings.apiUrl()}/inventory?${queryParams.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Обязательно передаем initData для валидации на бекенде (Spring Security)
          Authorization: this.getAuthToken(),
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`)
      }

      const data = await response.json()

      // Твой бекенд возвращает { items: [...] }
      // Нам нужно их смаппить, потому что UI ждет camelCase (floorPrice), а бек шлет snake_case (model_floor)
      const rawItems: ApiGiftItem[] = data.items || []

      return rawItems.map(this.mapDtoToModel)

    } catch (error) {
      console.error("InventoryService Error:", error)
      throw error
    }
  }

  // Маппер, чтобы не переделывать весь UI компонент GiftCard
  private static mapDtoToModel(dto: ApiGiftItem): GiftItem {
    // Безопасно достаем цену
    const price = dto.gift_value?.model_floor?.average?.ton || 0
    const address = dto.slug + "-" + dto.num
    const imageUrl = `https://nft.fragment.com/gift/${address}.webp`
    const brownGradient = "radial-gradient(circle, rgb(177, 144, 126) 0%, rgb(124, 99, 86) 100%)"

    return {
      id: dto.id,
      giftId: dto.gift_id,
      name: dto.title,
      collection: dto.model_name,
      image: imageUrl,
      floorPrice: Number(price.toFixed(2)),
      currency: "TON",
      quantity: 1,
      rarity: dto.num < 1000 ? "Legendary" : dto.num < 5000 ? "Rare" : "Common",

      // --- ВАЖНЫЕ ИЗМЕНЕНИЯ ---
      num: dto.num, // <--- Берём реальный номер (например, 8442)
      background: brownGradient, // <--- Сохраняем фон
    }
  }
}