import { Gift, UserProfile, Attribute, MarketStat } from "../types/domain";
import { ApiDetailedGift, ApiOwner, ApiInventoryItem } from "../types/apiDto";
import { ASSETS } from "../config/constants";

export const Mappers = {
  mapInventoryItem: (api: ApiInventoryItem): Partial<Gift> => {
    const giftNumber = api.num ?? api.number ?? 0;
    const slug = api.slug || "";
    const id = api.id || `${slug}-${giftNumber}`;

    return {
      id: id,
      slug: slug,
      number: giftNumber,
      name: api.title || api.name || "Unknown Gift",
      image: api.image || ASSETS.FRAGMENT_GIFT(slug),
      isOffchain: api.is_offchain ?? false,
      floorPrice: api.gift_value?.model_floor?.average?.ton ?? api.price ?? 0,
    };
  },

  mapDetailedGift: (api: ApiDetailedGift): Gift => {
    const attributes: Attribute[] = [
      { label: "Model", value: api.model, rarity: api.modelRare },
      { label: "Backdrop", value: api.backdrop, rarity: api.backdropRare },
      { label: "Symbol", value: api.symbol, rarity: api.symbolRare },
    ];

    const stats: MarketStat[] = Object.entries(api.parameters || {}).map(([key, val]) => ({
      label: key === 'collection' ? "Весь тираж" : key.charAt(0).toUpperCase() + key.slice(1),
      count: val.amount,
      floor: val.floorPrice,
    }));

    const history: any[] = [];
    Object.entries(api.parameters || {}).forEach(([category, data]) => {
      data.lastTrades?.forEach((trade) => {
        history.push({
          id: `${trade.giftSlug}-${trade.date}`,
          trait_value: trade.giftSlug.split('-')[0],
          price: trade.giftTonPrice,
          date: new Date(trade.date).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' }),
          platform: trade.marketplace,
          category: category === 'symbol' ? 'pattern' : category
        });
      });
    });

    return {
      id: api.giftSlug,
      slug: api.giftSlug,
      number: api.giftNum,
      name: api.giftName,
      image: api.giftAvatarLink,
      floorPrice: api.floorPriceTon,
      estimatedPrice: api.estimatedPriceTon,
      isOffchain: false,
      attributes,
      stats,
      history,
    };
  },

  mapOwner: (api: ApiOwner): UserProfile => ({
    id: String(api.telegram_id),
    username: api.username,
    displayName: api.name || api.username || `User ${api.telegram_id}`,
    avatarUrl: api.username ? ASSETS.AVATAR(api.username) : "",
    giftsCount: api.gifts_count || 0,
    portfolioValue: api.portfolio_value?.average.ton || 0,
  }),
};