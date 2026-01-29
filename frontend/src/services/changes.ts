// services/changes.ts
const BASE_URL = "https://api.changes.tg"

export default class ChangesService {
  private static slugify(text: string): string {
    return text.trim().replace(/\s+/g, "-")
  }

  static async getGifts(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/gifts`)
    return res.ok ? res.json() : []
  }

  static async getModels(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return []
    const res = await fetch(`${BASE_URL}/models/${this.slugify(gift)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((m: any) => m.name)
  }

  // Предположим, паттерны получаются так же. Если нет — можно заменить на статический список.
  static async getPatterns(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return []
    const res = await fetch(`${BASE_URL}/patterns/${this.slugify(gift)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((p: any) => p.name)
  }

  static getModelImage(gift: string, model: string): string {
    return `${BASE_URL}/model/${this.slugify(gift)}/${this.slugify(model)}.png`
  }

  static getOriginalImage(gift: string): string {
    return `${BASE_URL}/model/${this.slugify(gift)}/Original.png`
  }

  static getPatternImage(gift: string, pattern: string): string {
    return `${BASE_URL}/pattern/${this.slugify(gift)}/${this.slugify(pattern)}.png`
  }
}