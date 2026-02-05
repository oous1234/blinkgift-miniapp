import { Gift, Attribute, MarketStat } from "../types/domain";
import { ApiDetailedGift, ApiInventoryItem } from "../types/apiDto";
import { ASSETS } from "../config/constants";

export const Mappers = {
  mapInventoryItem: (api: ApiInventoryItem): Partial<Gift> => {
    const apiSlug = api.slug || "";
    const apiNum = api.num ?? api.number;
    const slugHasNumber = /-\d+$/.test(apiSlug);
    let finalId = api.id || apiSlug;
    if (!slugHasNumber && apiNum !== undefined) finalId = `${apiSlug}-${apiNum}`;

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

  mapDetailedGift: (api: ApiDetailedGift): Gift => {
    const attributes: Attribute[] = [
      { label: "Модель", value: api.model, rarity: api.modelRare },
      { label: "Фон", value: api.backdrop, rarity: api.backdropRare },
      { label: "Паттерн", value: api.symbol, rarity: api.symbolRare },
    ];

    const stats: MarketStat[] = Object.entries(api.parameters || {}).map(([key, val]) => ({
      label: key === 'model' ? 'Модель' :
             key === 'backdrop' ? 'Фон' :
             key === 'symbol' ? 'Паттерн' :
             key === 'model+backdrop' ? 'Модель+Фон' :
             key === 'model+backdrop+symbol' ? 'Модель+Фон+Паттерн' : key,
      count: val.amount,
      floor: val.floorPrice,
    }));

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
      history: [],
    };
  }
};