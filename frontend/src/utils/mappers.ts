import { Gift, Attribute, MarketStat } from "../types/domain";
import { ApiDetailedGift, ApiInventoryItem } from "../types/apiDto";
import { ASSETS } from "../config/constants";

const PARAM_LABELS: Record<string, string> = {
  model: "Модель",
  backdrop: "Фон",
  symbol: "Узор",
  collection: "Коллекция",
  "model+backdrop": "Модель + Фон",
  "model+backdrop+symbol": "Сет (M+B+S)"
};

export const Mappers = {
  // Метод для списка (поиск)
  mapInventoryItem: (api: ApiInventoryItem): Partial<Gift> => {
    const apiSlug = api.slug || "";
    const apiNum = api.num ?? api.number;
    const slugHasNumber = /-\d+$/.test(apiSlug);
    let finalId = api.id || apiSlug;

    if (!slugHasNumber && apiNum !== undefined) {
      finalId = `${apiSlug}-${apiNum}`;
    }

    return {
      id: finalId,
      slug: apiSlug,
      number: apiNum ?? 0,
      name: api.title || api.name || "Unknown Gift",
      image: api.image || ASSETS.FRAGMENT_GIFT(apiSlug.split('-')[0]),
      isOffchain: api.is_offchain ?? false,
      floorPrice: api.gift_value?.model_floor?.average?.ton ?? api.price ?? 0,
    };
  },

  // Метод для детальной информации
  mapDetailedGift: (api: ApiDetailedGift): Gift => {
    const attributes: Attribute[] = [
      { label: "Модель", value: api.model, rarity: api.modelRare },
      { label: "Фон", value: api.backdrop, rarity: api.backdropRare },
      { label: "Узор", value: api.symbol, rarity: api.symbolRare },
    ];

    const stats: MarketStat[] = Object.entries(api.parameters || {}).map(([key, val]) => ({
      label: PARAM_LABELS[key] || key,
      count: val.amount,
      floor: val.floorPrice,
      avgPrice30d: val.avg30dPrice || 0,
      dealsCount30d: val.dealsCount30d || 0,
      lastTrades: val.lastTrades || [],
    }));

    return {
      id: api.giftSlug,
      slug: api.giftSlug,
      number: api.giftNum,
      name: api.giftName,
      image: api.giftAvatarLink,
      floorPrice: api.floorPriceTon,
      estimatedPrice: api.estimatedPriceTon,
      attributes,
      stats,
      isOffchain: false,
      history: [],
    };
  }
};