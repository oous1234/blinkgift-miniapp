import { apiClient } from "../infrastructure/apiClient";

export default class WalletService {
  static async getBalance(): Promise<number> {
    try {
      const res = await apiClient.get<{ amountInCents: number }>("/wallet");
      return res.amountInCents / 100;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  }

  static async createPaymentLink(amount: number): Promise<string> {
    const res = await apiClient.get<{ url: string }>("/payment/link", {
      amount: String(amount)
    });
    return res.url;
  }

  static async withdraw(amount: number, iban: string): Promise<void> {
    await apiClient.post("/wallet", {
      amountInCents: Math.round(amount * 100),
      iban,
    });
  }
}