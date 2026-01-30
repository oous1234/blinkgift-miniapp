import { apiRequest } from "../infrastructure/apiClient";
import Settings from "../infrastructure/settings";

export default class WalletService {
  static async getBalance(): Promise<number> {
    const res = await apiRequest<{ amountInCents: number }>("/wallet");
    return res.amountInCents / 100;
  }

  static async createPaymentLink(amount: number): Promise<string> {
    const res = await apiRequest<{ url: string }>("/payment/link", "GET", null, {
      amount: String(amount)
    });
    return res.url;
  }

  static async withdraw(amount: number, iban: string): Promise<void> {
    await apiRequest("/wallet", "POST", {
      amountInCents: Math.round(amount * 100),
      iban,
    });
  }
}