export interface HistoryItem {
    address: string
    collectionAddress: string
    hash: string
    name: string
    time: string
    timestamp: number
    typeData: {
        type: "transfer" | "mint" | "putUpForSale" | "cancelSale" | "sale"
        newOwner?: string | null
        oldOwner?: string | null
        price?: string | null
        currency?: string | null
        priceNano?: string | null
    }
}

export interface NftExplorerDetails {
    history: HistoryItem[]
    info: {
        address: string
        name: string
        ownerAddress: string
        image: string
        description: string
        attributes: Array<{ traitType: string; value: string }>
    }
}