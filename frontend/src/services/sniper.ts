import { apiRequest } from "../infrastructure/apiClient"
import { SniperFilters } from "../views/Market/hooks/useSniperLogic"

export default class SniperService {
  /**
   * Отправляет фильтры на бекенд.
   * Передаем userId и в Query (как требует контроллер), и внутри Body.
   */
  static async updateFilters(userId: string, filters: SniperFilters) {
    return await apiRequest("/api/v1/sniper/filters", "POST",
      {
        userId: userId,
        models: filters.models || [],
        backdrops: filters.backdrops || [],
        symbols: [],
        maxPrice: 10000,
        notificationsEnabled: true
      },
      { userId }
    )
  }

  static async getFilters(userId: string) {
    return await apiRequest<any>("/api/v1/sniper/filters", "GET", null, { userId })
  }
}