import { apiClient } from "../infrastructure/apiClient";
import { Mappers } from "../utils/mappers";
import { ApiOwner, ApiHistoryPoint } from "../types/apiDto";

export const OwnerService = {
  async getPortfolioHistory(ownerId: string, range: string) {
    const response = await apiClient.get<{ data: ApiHistoryPoint[] }>("/owner", {
      ownerUuid: ownerId,
      range,
    });
    return response.data || [];
  },

  async searchOwners(query: string, limit = 10) {
    const response = await apiClient.get<{ owners: ApiOwner[] }>("/owner/search", {
      search_query: query,
      limit,
    });
    return (response.owners || []).map(Mappers.mapOwner);
  },
};