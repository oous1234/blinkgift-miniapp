// data.ts

export interface GiftItem {
    id: string;
    name: string;
    collection: string;
    image: string; // URL заглушки
    rarity: "Common" | "Rare" | "Legendary" | "Limited";
    floorPrice: number; // Текущая рыночная цена (с агрегатора)
    purchasePrice: number; // Цена покупки (из истории транзакций кошелька)
    background: string;
    quantity: number;
    lastSaleDate: string;
}

export const MOCK_INVENTORY: GiftItem[] = [
  {
    id: "1",
    name: "Plush Pepe",
    collection: "Telegram Stars",
    image: "https://nft.fragment.com/gift/plushpepe-1515.medium.jpg", // Пример
    rarity: "Legendary",
    floorPrice: 250.0,
    purchasePrice: 180.0,
    background: "Nebula",
    quantity: 1,
    lastSaleDate: "2024-12-20",
  },
  {
    id: "2",
    name: "Loot Bag",
    collection: "Gemstones",
    image: "https://nft.fragment.com/gift/lootbag-11217.medium.jpg",
    rarity: "Rare",
    floorPrice: 215000.0,
    purchasePrice: 60.0,
    background: "Arctic",
    quantity: 3,
    lastSaleDate: "2025-01-01",
  },
  {
    id: "3",
    name: "Durov’s Cap",
    collection: "Christmas 2024",
    image: "https://nft.fragment.com/gift/durovscap-2222.medium.jpg",
    rarity: "Common",
    floorPrice: 12.5,
    purchasePrice: 12.5,
    background: "Red Velvet",
    quantity: 10,
    lastSaleDate: "2023-12-25",
  },
  {
    id: "4",
    name: "Lon Gem",
    collection: "Alchemist",
    image: "https://nft.fragment.com/gift/iongem-555.medium.jpg",
    rarity: "Limited",
    floorPrice: 500.0,
    purchasePrice: 50.0, // Огромный икс
    background: "Matrix",
    quantity: 1,
    lastSaleDate: "2024-10-10",
  },
  {
    id: "5",
    name: "Heart Locket",
    collection: "Alchemist",
    image: "https://nft.fragment.com/gift/heartlocket-915.medium.jpg",
    rarity: "Limited",
    floorPrice: 500.0,
    purchasePrice: 50.0, // Огромный икс
    background: "Matrix",
    quantity: 1,
    lastSaleDate: "2024-10-10",
  },
  {
    id: "6",
    name: "Precious Peach",
    collection: "Alchemist",
    image: "https://nft.fragment.com/gift/preciouspeach-2161.medium.jpg",
    rarity: "Limited",
    floorPrice: 500.0,
    purchasePrice: 50.0, // Огромный икс
    background: "Matrix",
    quantity: 1,
    lastSaleDate: "2024-10-10",
  },
  {
    id: "7",
    name: "Westside Sign",
    collection: "Alchemist",
    image: "https://nft.fragment.com/gift/westsidesign-2005.medium.jpg",
    rarity: "Limited",
    floorPrice: 500.0,
    purchasePrice: 50.0, // Огромный икс
    background: "Matrix",
    quantity: 1,
    lastSaleDate: "2024-10-10",
  },
  {
    id: "8",
    name: "Signet Ring",
    collection: "Alchemist",
    image: "https://nft.fragment.com/gift/signetring-10272.medium.jpg",
    rarity: "Limited",
    floorPrice: 500.0,
    purchasePrice: 50.0, // Огромный икс
    background: "Matrix",
    quantity: 1,
    lastSaleDate: "2024-10-10",
  },
]