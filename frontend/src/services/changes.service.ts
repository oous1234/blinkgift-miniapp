import { API_CONFIG } from "../constants/config"

export const ChangesService = {
  slugify(text: string) {
    return text.trim().replace(/\s+/g, "-")
  },

  async getGifts() {
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/gifts`)
    return res.ok ? res.json() : []
  },

  async getModels(gift: string) {
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/models/${this.slugify(gift)}`)
    const data = await res.json()
    return data.map((m: any) => m.name)
  },

  async getPatterns(gift: string) {
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/patterns/${this.slugify(gift)}`)
    const data = await res.json()
    return data.map((p: any) => p.name)
  },

  async getBackdrops(gift: string) {
    const res = await fetch(`${API_CONFIG.CHANGES_URL}/backdrops/${this.slugify(gift)}`)
    return res.json()
  },

  getModelUrl(gift: string, model: string, ext: 'png' | 'json' = 'json') {
    return `${API_CONFIG.CHANGES_URL}/model/${this.slugify(gift)}/${this.slugify(model)}.${ext}`
  },

  getPatternImage(gift: string, pattern: string) {
    return `${API_CONFIG.CHANGES_URL}/pattern/${this.slugify(gift)}/${this.slugify(pattern)}.png`
  }
}