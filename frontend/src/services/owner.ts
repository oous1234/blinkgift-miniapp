import { apiRequest } from "../infrastructure/apiClient"
import { OwnerProfile, HistoryPoint } from "../types"

export default class OwnerService {
  static async getPortfolioHistory(range: string, ownerId?: string): Promise<HistoryPoint[]> {
    const targetId = ownerId || window.Telegram.WebApp.initDataUnsafe?.user?.id?.toString() || "8241853306"

    const response = await apiRequest<any>("/owner", "GET", null, {
      ownerUuid: targetId,
      range: range,
    })
    return response.data || []
  }

  static async searchOwners(query: string, limit = 10, offset = 0): Promise<OwnerProfile[]> {
    const response = await apiRequest<any>("/owner/search", "GET", null, {
      search_query: query,
      limit,
      offset,
    })

    return (response.owners || []).map((o: any) => ({
      id: String(o.telegram_id || o.id),
      username: o.username,
      name: o.name,
      giftsCount: o.gifts_count || 0,
      portfolioValue: o.portfolio_value?.average?.ton || 0,
      avatarUrl: o.username ? `https://poso.see.tg/api/avatar/${o.username}` : undefined
    }))
  }
}