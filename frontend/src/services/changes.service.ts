import { apiClient } from "../infrastructure/apiClient";

const slugify = (text: string) => {
  if (!text) return "";
  return text.trim().toLowerCase().replace(/\s+/g, "-");
};

export const ChangesService = {
  async getGifts(): Promise<string[]> {
    try {
      // Передаем useChangesApi = true
      const data = await apiClient.get<string[]>("/gifts", undefined, true);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("ChangesService.getGifts failed", e);
      return [];
    }
  },

  async getModels(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return [];
    try {
      const giftSlug = slugify(gift);
      const data = await apiClient.get<any[]>(`/models/${giftSlug}`, undefined, true);
      return Array.isArray(data) ? data.map((m) => m.name) : [];
    } catch (e) {
      return [];
    }
  },

  async getPatterns(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return [];
    try {
      const giftSlug = slugify(gift);
      const data = await apiClient.get<any[]>(`/patterns/${giftSlug}`, undefined, true);
      return Array.isArray(data) ? data.map((p) => p.name) : [];
    } catch (e) {
      return [];
    }
  },

  async getBackdrops(gift: string): Promise<any[]> {
    if (!gift || gift === "Все подарки") return [];
    try {
      const giftSlug = slugify(gift);
      const data = await apiClient.get<any[]>(`/backdrops/${giftSlug}`, undefined, true);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },

  getModelUrl(gift: string, model: string, ext: "png" | "json" = "json"): string {
    const giftSlug = slugify(gift);
    if (!giftSlug) return "";
    const modelSlug = (!model || model === "Любая модель") ? "Original" : slugify(model);
    return `https://api.changes.tg/model/${giftSlug}/${modelSlug}.${ext}`;
  },

  getPatternImage(gift: string, pattern: string): string | null {
    if (!pattern || pattern === "Любой узор") return null;
    const giftSlug = slugify(gift);
    if (!giftSlug) return null;
    return `https://api.changes.tg/pattern/${giftSlug}/${slugify(pattern)}.png`;
  },

  getOriginalImage(gift: string): string {
    const giftSlug = slugify(gift);
    if (!giftSlug) return "";
    return `https://api.changes.tg/model/${giftSlug}/Original.png`;
  }
};