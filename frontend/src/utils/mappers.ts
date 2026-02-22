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
  mapInventoryItem: (api: any): Partial<Gift> => {
    const slug = api.slug;
    return {
      id: slug,
      slug: slug,
      number: api.serialNumber || api.num || 0,
      name: api.name || api.title || "Gift",
      image: api.image || (slug ? ASSETS.FRAGMENT_GIFT(slug.split('-')[0]) : ""),
      isOffchain: api.isOffchain || api.is_offchain || false,
      floorPrice: api.estimatedPrice || api.price || 0,
    };
  },

  mapDetailedGift: (api: any): Gift => {
    // 1. Атрибуты самого предмета
    const attributes: Attribute[] = [
      { label: "Модель", value: api.model, rarity: api.modelRare || 0 },
      { label: "Фон", value: api.backdrop, rarity: api.backdropRare || 0 },
      { label: "Узор", value: api.symbol, rarity: api.symbolRare || 0 },
    ];

    // 2. Статистика и сделки (из поля parameters твоего JSON)
    const stats: MarketStat[] = Object.entries(api.parameters || {}).map(([key, anyVal]) => {
      const val = anyVal as any;
      return {
        label: PARAM_LABELS[key] || key,
        count: val.amount || 0,
        floor: val.floorPrice || 0,
        avgPrice30d: val.avg30dPrice || 0,
        dealsCount30d: val.dealsCount30d || 0,
        lastTrades: val.lastTrades || [], // Те самые сделки по модели/фону/символу
      };
    });

    return {
      id: api.giftSlug,
      slug: api.giftSlug,
      number: api.giftNum,
      name: api.giftName,
      image: api.giftAvatarLink,
      floorPrice: api.floorPriceTon || 0,
      estimatedPrice: api.estimatedPriceTon || 0,
      attributes,
      stats,
      isOffchain: false,
      history: [], // Блокчейн историю здесь не используем
    };
  }
};