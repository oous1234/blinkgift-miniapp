// frontend/src/types/marketplace.ts
export interface ApiMarketplaceItem {
    id: string
    address: string
    backdrop: string
    model: string
    name: string
    price: string
    priceNano: number
    estimatedPrice: number
    marketplace: "getgems" | "portals"
    symbol: string
}

export interface MarketplaceItem extends ApiMarketplaceItem {
    imageUrl: string
}