const BASE_URL = "https://api.changes.tg"

export interface ApiModel {
  name: string
  rarityPermille: number
}

export default class ChangesService {
  // Получаем список всех подарков
  static async getGifts(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/gifts`)
    return res.ok ? res.json() : []
  }

  // Получаем список моделей для конкретного подарка
  static async getModels(gift: string): Promise<string[]> {
    if (!gift || gift === "Все подарки") return []
    // Превращаем "Artisan Brick" в "Artisan-Brick"
    const giftParam = gift.trim().replace(/\s+/g, "-")
    const res = await fetch(`${BASE_URL}/models/${giftParam}`)
    if (!res.ok) return []

    const data: ApiModel[] = await res.json()
    // Извлекаем только имена моделей: ["Art Nouveau", "Big Cubus"]
    return data.map(m => m.name)
  }

  // Формируем прямую ссылку на PNG модели
  // Результат: https://api.changes.tg/model/Artisan-Brick/Art-Nouveau.png
  static getModelImage(gift: string, model: string): string {
    const g = gift.trim().replace(/\s+/g, "-")
    const m = model.trim().replace(/\s+/g, "-")
    return `${BASE_URL}/model/${g}/${m}.png`
  }

  // Формируем ссылку на оригинальный подарок (базовая иконка)
  static getOriginalImage(gift: string): string {
    const g = gift.trim().replace(/\s+/g, "-")
    return `${BASE_URL}/original/${g}.png`
  }

  // Заглушки для фонов и узоров (если понадобятся)
  static getPatternImage(gift: string, pattern: string): string {
    const g = gift.trim().replace(/\s+/g, "-")
    const p = pattern.trim().replace(/\s+/g, "-")
    return `${BASE_URL}/pattern/${g}/${p}.png`
  }
}