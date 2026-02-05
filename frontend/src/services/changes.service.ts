import { API_CONFIG } from "../config/constants";

const slugify = (text: string) => text.trim().toLowerCase().replace(/\s+/g, "-");

export const ChangesService = {
  async getGifts(): Promise<string[]> {
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/gifts`);
    return res.ok ? res.json() : [];
  },

  async getModels(gift: string) {
    if (!gift || gift === "Все подарки") return [];
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/models/${slugify(gift)}`);
    const data = await res.json();
    return data.map((m: any) => m.name);
  },

  async getPatterns(gift: string) {
    if (!gift || gift === "Все подарки") return [];
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/patterns/${slugify(gift)}`);
    const data = await res.json();
    return data.map((p: any) => p.name);
  },

  async getBackdrops(gift: string) {
    if (!gift || gift === "Все подарки") return [];
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/backdrops/${slugify(gift)}`);
    return res.ok ? res.json() : [];
  },

  // Ссылки на ассеты
  getModelUrl(gift: string, model: string, ext: "png" | "json" = "json") {
    const modelSlug = model === "Любая модель" ? "Original" : slugify(model);
    return `${API_CONFIG.CHANGES_URL}/model/${slugify(gift)}/${modelSlug}.${ext}`;
  },

  getPatternImage(gift: string, pattern: string) {
    if (!pattern || pattern === "Любой узор") return null;
    return `${API_CONFIG.CHANGES_URL}/pattern/${slugify(gift)}/${slugify(pattern)}.png`;
  },

  getOriginalUrl(gift: string, ext: "png" | "json" = "json") {
    return `${API_CONFIG.CHANGES_URL}/model/${slugify(gift)}/Original.${ext}`;
  }
};