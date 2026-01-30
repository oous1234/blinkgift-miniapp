import { apiRequest } from "../infrastructure/apiClient"
import {
  InventoryResponse,
  InventoryServiceResponse,
  ApiGiftItem,
  GiftItem,
  DetailedGiftResponse,
  GiftSearchRequest,
  GiftShortResponse,
  PagedResponse,
} from "../types/inventory"
import { NftExplorerDetails } from "../types/explorer"

export default class InventoryService {
  static async getItems(
      limit: number,
      offset: number,
      ownerId?: string
  ): Promise<InventoryServiceResponse> {
    const targetId =
        ownerId || window.Telegram.WebApp.initDataUnsafe?.user?.id?.toString() || "8241853306"
    const data = await apiRequest<InventoryResponse>("/inventory", "GET", null, {
      current_owner_id: targetId,
      limit: limit.toString(),
      offset: offset.toString(),
    })
    return {
      items: data.items.map(this.mapDtoToModel),
      total: data.total,
      limit: data.limit,
      offset: data.offset,
    }
  }

  // ОБНОВЛЕНО: теперь возвращает PagedResponse
  static async searchGifts(params: GiftSearchRequest): Promise<PagedResponse<GiftShortResponse>> {
    return await apiRequest<PagedResponse<GiftShortResponse>>("/api/v1/search/gifts", "POST", params)
  }

  static async getGiftDetail(slugWithNum: string): Promise<GiftItem> {
    const data = await apiRequest<DetailedGiftResponse>(`/api/v1/gifts/${slugWithNum}`, "GET")
    return {
      id: data.gift.slug,
      giftId: data.gift.id.toString(),
      name: data.gift.name,
      collection: "Telegram Gift",
      image: `https://nft.fragment.com/gift/${data.gift.slug}.webp`,
      floorPrice: data.gift.estimated_price_ton,
      currency: data.gift.currency,
      num: data.gift.id,
      rarity: "NFT",
      attributes: data.attributes,
      marketStats: data.market_stats,
      recentSales: data.recent_sales,
      estimatedPrice: data.gift.estimated_price_ton,
      ownerUsername: data.gift.owner.username,
      isOffchain: data.gift.is_offchain
    }
  }

  static async getNftBlockchainDetails(address: string): Promise<NftExplorerDetails> {
    const testAddr = "EQAlCt5luoSZ9ihvGarDP5T89hycr2AY-WXDWnUVMWPtryPx"
    return await apiRequest<NftExplorerDetails>(`/api/v1/nft-explorer/details/${testAddr}`, "GET")
  }

  private static mapDtoToModel(dto: ApiGiftItem): GiftItem {
    const address = `${dto.slug}-${dto.num}`
    return {
      id: dto.id,
      giftId: dto.gift_id,
      name: dto.title,
      collection: dto.model_name,
      image: `https://nft.fragment.com/gift/${address}.webp`,
      floorPrice: dto.gift_value?.model_floor?.average?.ton || 0,
      currency: "TON",
      num: dto.num,
      rarity: dto.num < 1000 ? "Legendary" : "Common",
      isOffchain: dto.is_offchain || false
    }
  }
}