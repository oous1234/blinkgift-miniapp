import { ApiClient } from "../infrastructure/api"
import { SniperRule } from "../types/sniper"
import { ASSET_URLS } from "../constants/config"

export const SniperService = {
  async getUserFilters(userId: string): Promise<SniperRule> {
    return ApiClient.get<SniperRule>("/api/v1/sniper/filters", { userId })
  },

  async updateFilters(rule: SniperRule): Promise<void> {
    await ApiClient.post<void>(`/api/v1/sniper/filters`, rule)
  },

  async getMatchHistory(userId: string, limit: number = 50): Promise<any[]> {
    const data = await ApiClient.get<any[]>("/api/v1/sniper/history", { userId, limit })

    return (data || []).map(item => ({
      ...item,
      id: item.id || `evt-${Date.now()}-${Math.random()}`,
      receivedAt: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
      imageUrl: ASSET_URLS.fragmentGift((item.name || item.giftName || '').toLowerCase().replace(/#/g, "-").replace(/\s+/g, ""))
    }))
  }
}