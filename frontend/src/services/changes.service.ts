import { apiClient } from "../infrastructure/apiClient";

const slugify = (text: string) => text.trim().toLowerCase().replace(/\s+/g, "-");

export const ChangesService = {
  async getGifts(): Promise<string[]> {
    return apiClient.get<string[]>("/gifts", undefined, true);
  },

  async getModels(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return [];
    const data = await apiClient.get<any[]>(`/models/${slugify(gift)}`, undefined, true);
    return data.map((m) => m.name);
  },

  async getPatterns(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return [];
    const data = await apiClient.get<any[]>(`/patterns/${slugify(gift)}`, undefined, true);
    return data.map((p) => p.name);
  },

  async getBackdrops(gift: string): Promise<any[]> {
    if (!gift || gift === "Все подарки") return [];
    return apiClient.get<any[]>(`/backdrops/${slugify(gift)}`, undefined, true);
  },

  getModelUrl(gift: string, model: string, ext: "png" | "json" = "json"): string {
    const modelSlug = model === "Любая модель" ? "Original" : slugify(model);
    const giftSlug = slugify(gift);
    return `https://api.changes.tg/model/${giftSlug}/${modelSlug}.${ext}`;
  },

  getPatternImage(gift: string, pattern: string): string | null {
    if (!pattern || pattern === "Любой узор") return null;
    return `https://api.changes.tg/pattern/${slugify(gift)}/${slugify(pattern)}.png`;
  },

  getOriginalUrl(gift: string, ext: "png" | "json" = "json"): string {
    return `https://api.changes.tg/model/${slugify(gift)}/Original.${ext}`;
  },

  getOriginalImage(gift: string): string {
    return this.getOriginalUrl(gift, "png");
  }
};