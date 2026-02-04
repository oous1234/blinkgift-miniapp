// src/services/sniper.service.ts
import { apiRequest } from "../infrastructure/apiClient";
import { SniperRule } from "../types/sniper";

export default class SniperService {
  static async getUserFilters(userId: string): Promise<SniperRule> {
    return await apiRequest<SniperRule>("/api/v1/sniper/filters", "GET", null, { userId });
  }

  static async updateFilters(rule: SniperRule): Promise<void> {
    await apiRequest<void>(`/api/v1/sniper/filters?userId=${rule.userId}`, "POST", rule);
  }

  static async getMatchHistory(userId: string, limit: number = 50): Promise<any[]> {
    return await apiRequest<any[]>("/api/v1/sniper/history", "GET", null, { userId, limit });
  }
}