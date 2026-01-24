// frontend/src/services/changes.ts
const BASE_URL = "https://api.changes.tg"

export default class ChangesService {
    static async getGifts(): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/gifts`)
        return res.ok ? res.json() : []
    }
    static async getModels(gift: string): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/models/${gift}`)
        return res.ok ? res.json() : []
    }
    static async getBackdrops(gift: string): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/backdrops/${gift}`)
        return res.ok ? res.json() : []
    }
    static async getPatterns(gift: string): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/patterns/${gift}`)
        return res.ok ? res.json() : []
    }

    static getModelImage(gift: string, model: string): string {
        return `${BASE_URL}/model/${gift}/${model}.png`
    }
    static getPatternImage(gift: string, pattern: string): string {
        return `${BASE_URL}/pattern/${gift}/${pattern}.png`
    }
    static getOriginalImage(gift: string): string {
        return `${BASE_URL}/original/${gift}.png`
    }
}