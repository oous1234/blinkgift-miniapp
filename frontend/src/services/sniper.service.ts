import { apiClient } from "../infrastructure/apiClient";
import { ASSETS } from "../config/constants";
import { SniperRule, SniperEvent } from "../types/sniper";

export const SniperService = {
  async getFilters(userId: string): Promise<SniperRule[]> {
    const data = await apiClient.get<any>("/api/v1/sniper/filters", { userId });
    return Array.isArray(data) ? data : [data];
  },

  async updateFilters(userId: string, rule: Partial<SniperRule>): Promise<void> {
    await apiClient.post(`/api/v1/sniper/filters`, {
      userId,
      ...rule
    }, { userId });
  },

  async getMatchHistory(userId: string, limit: number = 50): Promise<SniperEvent[]> {
    const data = await apiClient.get<any[]>("/api/v1/sniper/history", { userId, limit });

    return (data || []).map(item => ({
      id: item.id || `evt-${Date.now()}-${Math.random()}`,
      name: item.name || item.giftName || 'Unknown Gift',
      model: item.model || 'Standard',
      backdrop: item.backdrop || '',
      symbol: item.symbol || '',
      price: item.price ? parseFloat(item.price) : 0,
      marketplace: item.marketplace || 'FRAGMENT',
      receivedAt: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
      imageUrl: ASSETS.FRAGMENT_GIFT((item.name || item.giftName || '').toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")),
      dealScore: item.dealScore || 0
    }));
  }
};