export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "https://api.isnap.io",
  CHANGES_URL: "https://api.changes.tg",
  DEFAULT_USER_ID: "8241853306",
}

export const ASSET_URLS = {
  fragmentGift: (slug: string) => `https://nft.fragment.com/gift/${slug}.webp`,
  tgAvatar: (username: string) => `https://poso.see.tg/api/avatar/${username}`,
}

export const CHART_PERIODS = ["12h", "24h", "7d", "30d"] as const
export type ChartPeriod = typeof CHART_PERIODS[number]