import { Gift, Attribute, MarketStat } from "../types/domain";
import { ASSETS } from "../config/constants";

const PARAM_LABELS: Record<string, string> = {
  model: "Модель",
  backdrop: "Фон",
  symbol: "Узор",
  collection: "Коллекция"
};

export const Mappers = {
  mapInventoryItem: (api: any): Partial<Gift> => {
    // В списке инвентаря slug обычно в поле 'slug' или 'id'
    const slug = api.slug || api.id || "";
    return {
      id: slug,
      slug: slug,
      number: api.serialNumber || api.num || 0,
      name: api.name || "Gift",
      image: api.image || (slug ? ASSETS.FRAGMENT_GIFT(slug) : ""),
      floorPrice: api.estimatedPrice || api.price || 0,
    };
  },

  mapDetailedGift: (api: any): Gift => {
    // Маппинг строго по твоему JSON от 12:09PM
    const stats: MarketStat[] = api.parameters
      ? Object.entries(api.parameters).map(([key, anyVal]: [string, any]) => {
          const val = anyVal || {};
          return {
            label: PARAM_LABELS[key] || key,
            count: val.amount ?? 0,
            floor: val.floorPrice ?? 0,
            avgPrice30d: val.avg30dPrice ?? 0,
            dealsCount30d: val.dealsCount30d ?? 0,
            lastTrades: val.lastTrades || [],
          };
        })
      : [];

    return {
      id: api.giftSlug,
      slug: api.giftSlug,
      number: api.giftNum,
      name: api.giftName,
      image: api.giftAvatarLink,
      floorPrice: api.floorPriceTon || 0,
      estimatedPrice: api.estimatedPriceTon || 0,
      attributes: [
        { label: "Модель", value: api.model || "—", rarity: api.modelRare ?? 0 },
        { label: "Фон", value: api.backdrop || "—", rarity: api.backdropRare ?? 0 },
        { label: "Узор", value: api.symbol || "—", rarity: api.symbolRare ?? 0 },
      ],
      stats: stats,
      history: [],
      isOffchain: false
    };
  }
};