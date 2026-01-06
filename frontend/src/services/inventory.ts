import Settings from "@infrastructure/settings"
import { GiftItem, ApiGiftItem, InventoryServiceResponse } from "../../src/types/inventory"

export default class InventoryService {
  private static readonly HARDCODED_TGAUTH = JSON.stringify({
    id: 8241853306,
    first_name: "ЛинкПро",
    username: "linkproadmin",
    auth_date: 1767463372,
    hash: "f26034faff41934d58242f155c1771d42caf6c753df28d3d61cead61708c6208",
  })

  private static getAuthToken(): string {
    return window.Telegram.WebApp.initData
  }

  private static getTelegramUserId(): string {
    const tgId = window.Telegram.WebApp.initDataUnsafe?.user?.id
    return tgId ? tgId.toString() : ""
  }

  // Добавили аргумент customOwnerId
  static async getItems(
    limit: number = 10,
    offset: number = 0,
    customOwnerId?: string
  ): Promise<InventoryServiceResponse> {
    try {
      // Если передан customOwnerId, используем его, иначе берем текущего юзера
      const targetId = customOwnerId || this.getTelegramUserId()

      const queryParams = new URLSearchParams({
        current_owner_id: targetId,
        tgauth: this.HARDCODED_TGAUTH,
        limit: limit.toString(),
        offset: offset.toString(),
      })

      const url = `${Settings.apiUrl()}/inventory?${queryParams.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthToken(),
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`)
      }

      const data = await response.json()
      const rawItems: ApiGiftItem[] = data.items || []

      return {
        items: rawItems.map(this.mapDtoToModel),
        total: data.total || 0,
        limit: data.limit || limit,
        offset: data.offset || offset,
      }
    } catch (error) {
      console.error("InventoryService Error:", error)
      throw error
    }
  }

  private static mapDtoToModel(dto: ApiGiftItem): GiftItem {
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
      num: dto.num,
      background: brownGradient,
    }
  }
}
