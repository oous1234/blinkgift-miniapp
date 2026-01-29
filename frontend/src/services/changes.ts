const BASE_URL = "https://api.changes.tg"

export default class ChangesService {
    static async getGifts(): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/gifts`)
        return res.ok ? res.json() : []
    }

    static async getModels(gift: string): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/models/${gift.replace(/\s+/g, "")}`)
        return res.ok ? res.json() : []
    }

    static async getBackdrops(gift: string): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/backdrops/${gift.replace(/\s+/g, "")}`)
        return res.ok ? res.json() : []
    }

    static async getPatterns(gift: string): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/patterns/${gift.replace(/\s+/g, "")}`)
        return res.ok ? res.json() : []
    }

    // Хелперы для иконок
    static getModelImage(gift: string, model: string): string {
        const g = gift.replace(/\s+/g, "")
        return `${BASE_URL}/model/${g}/${model}.png`
    }

    static getBackdropInfo(gift: string, backdrop: string): string {
        // У Changes API для бэкдропов обычно нет прямой картинки в .png через /backdrop/,
        // поэтому будем использовать плейсхолдер или цвет, если API не отдает картинку.
        return ""
    }

    static getPatternImage(gift: string, pattern: string): string {
        const g = gift.replace(/\s+/g, "")
        return `${BASE_URL}/pattern/${g}/${pattern}.png`
    }

    static getOriginalImage(gift: string): string {
        // Убираем пробелы и приводим к нижнему регистру
        const g = gift.replace(/\s+/g, "").toLowerCase()
        return `${BASE_URL}/original/${g}.png`
    }
}