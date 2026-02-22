import { apiClient } from "../infrastructure/apiClient";

export interface SearchOwnerResult {
  id: number;
  username?: string;
  title: string;
  type: string;
  nft_count: number;
  verified: boolean;
}

export interface SearchResponse {
  query: string;
  results: SearchOwnerResult[];
}

export const OwnerService = {
  async searchOwners(query: string, limit = 20): Promise<SearchOwnerResult[]> {
    if (!query || query.length < 2) return [];

    try {
      const response = await apiClient.get<SearchResponse>("/api/v1/owners/search", {
        q: query,
        limit,
      });
      return response.results || [];
    } catch (e) {
      console.error("OwnerService.searchOwners failed", e);
      return [];
    }
  },

  async getPortfolioHistory(ownerId: string, range: string) {
    const response = await apiClient.get<any>("/owner", {
      ownerUuid: ownerId,
      range,
    });
    return response.data || [];
  },
};