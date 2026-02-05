import { ApiOwner, ApiGiftShort, ApiDetailedGift } from "../types/api"
import { UserProfile, Gift, GiftStat, MarketHistoryItem } from "../types/domain"
import { ASSET_URLS } from "../constants/config"

export const mapApiOwnerToProfile = (api: ApiOwner): UserProfile => ({
  id: String(api.telegram_id),
  username: api.username || "",
  displayName: api.name || api.username || "Unknown",
  avatarUrl: api.username ? ASSET_URLS.tgAvatar(api.username) : "",
  giftsCount: api.gifts_count || 0,
  totalValue: api.portfolio_value?.average.ton || 0,
  type: api.telegram_type || "user"
})

export const mapApiGiftShortToDomain = (api: ApiGiftShort): Partial<Gift> => ({
  id: api.id,
  slug: api.slug,
  number: api.num,
  name: api.title,
  image: api.image || ASSET_URLS.fragmentGift(`${api.slug}-${api.num}`),
  isOffchain: api.is_offchain,
  floorPrice: api.gift_value?.model_floor?.average.ton || 0
})

export const mapDetailedGiftToDomain = (api: ApiDetailedGift): Gift => {
  const stats: GiftStat[] = Object.entries(api.parameters).map(([key, info]) => ({
    type: key,
    label: key === 'collection' ? "Весь тираж" : key.charAt(0).toUpperCase() + key.slice(1),
    count: info.amount,
    floor: info.floorPrice
  }))

  const history: MarketHistoryItem[] = []
  Object.entries(api.parameters).forEach(([category, info]) => {
    info.lastTrades?.forEach(trade => {
      history.push({
        id: `${trade.giftSlug}-${trade.date}`,
        price: trade.giftTonPrice,
        date: new Date(trade.date).toLocaleDateString(),
        platform: trade.marketplace,
        buyerName: trade.giftSlug.split('-')[0],
        avatarUrl: ASSET_URLS.fragmentGift(trade.giftSlug),
        category: (category === 'symbol' ? 'pattern' : category) as any
      })
    })
  })

  return {
    id: api.giftSlug,
    slug: api.giftSlug,
    number: api.giftNum,
    name: api.giftName,
    image: api.giftAvatarLink,
    floorPrice: api.floorPriceTon,
    estimatedPrice: api.estimatedPriceTon,
    isOffchain: false,
    attributes: [
      { label: "Model", value: api.model, rarity: api.modelRare },
      { label: "Backdrop", value: api.backdrop, rarity: api.backdropRare },
      { label: "Symbol", value: api.symbol, rarity: api.symbolRare }
    ],
    stats,
    history
  }
}