const BASE_URL = "https://api.changes.tg"

export interface ApiBackdrop {
  name: string
  centerColor: number
  edgeColor: number
  patternColor: number
  textColor: number
  rarityPermille: number
  hex: {
    centerColor: string
    edgeColor: string
    patternColor: string
    textColor: string
  }
}

export default class ChangesService {
  private static slugify(text: string): string {
    return text.trim().replace(/\s+/g, "-")
  }

  static async getGifts(): Promise<string[]> {
    try {
      const res = await fetch(`${BASE_URL}/gifts`)
      return res.ok ? res.json() : []
    } catch {
      return []
    }
  }

  static async getModels(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return []
    const res = await fetch(`${BASE_URL}/models/${this.slugify(gift)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((m: any) => m.name)
  }

  static async getPatterns(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return []
    const res = await fetch(`${BASE_URL}/patterns/${this.slugify(gift)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((p: any) => p.name)
  }

  static async getBackdrops(gift: string): Promise<ApiBackdrop[]> {
    if (!gift || gift === "Все подарки") return []
    const res = await fetch(`${BASE_URL}/backdrops/${this.slugify(gift)}`)
    if (!res.ok) return []
    return await res.json()
  }

  static getModelUrl(gift: string, model: string, ext: 'png' | 'json' = 'json'): string {
    return `${BASE_URL}/model/${this.slugify(gift)}/${this.slugify(model)}.${ext}`
  }

  static getOriginalUrl(gift: string, ext: 'png' | 'json' = 'json'): string {
    return `${BASE_URL}/model/${this.slugify(gift)}/Original.${ext}`
  }

  static getPatternImage(gift: string, pattern: string): string {
    return `${BASE_URL}/pattern/${this.slugify(gift)}/${this.slugify(pattern)}.png`
  }
}