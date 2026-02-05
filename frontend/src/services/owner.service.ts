import { ApiClient } from "../infrastructure/api"
import { ApiOwner } from "../types/api"
import { mapApiOwnerToProfile } from "../utils/mappers"

export const OwnerService = {
  async getPortfolioHistory(ownerId: string, range: string) {
    const response = await ApiClient.get<any>("/owner", {
      ownerUuid: ownerId,
      range
    })
    return response.data || []
  },

  async searchOwners(query: string, limit = 10, offset = 0) {
    const response = await ApiClient.get<{ owners: ApiOwner[] }>("/owner/search", {
      search_query: query,
      limit,
      offset
    })
    return (response.owners || []).map(mapApiOwnerToProfile)
  }
}