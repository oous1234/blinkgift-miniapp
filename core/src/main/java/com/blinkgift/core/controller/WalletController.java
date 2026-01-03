package com.blinkgift.core.controller;

import com.blinkgift.core.dto.WalletResponse;
import com.blinkgift.core.dto.req.WithdrawRequest;
import com.blinkgift.core.dto.resp.PaymentLinkResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
public class WalletController {

    @GetMapping("/wallet")
    public ResponseEntity<WalletResponse> getWallet(Principal principal) {
        // Principal внедряется Spring Security после успешной проверки Telegram hash
        // Мы договорились, что в principal.getName() будет лежать telegramId
        String telegramId = principal.getName();

        // ЛОГИКА (пример вызова сервиса):
        // User user = walletService.findUserByTelegramId(telegramId);
        // String amount = user.getWalletAmountInCents().toString();

        // ЗАГЛУШКА для примера (пока нет сервиса):
        String amount = "1000"; // 10 EUR

        return ResponseEntity.ok(new WalletResponse(telegramId, amount));
    }

    /**
     * POST /wallet
     * Запрос на вывод средств.
     */
    @PostMapping("/wallet")
    public ResponseEntity<WalletResponse> postWithdrawMoney(
            @RequestBody WithdrawRequest request,
            Principal principal
    ) {
        String telegramId = principal.getName();

        // ЛОГИКА:
        // 1. Найти юзера
        // 2. Проверить баланс >= request.getAmountInCents()
        // 3. Вычесть деньги, сохранить заявку на вывод
        // 4. Вернуть остаток

        // ЗАГЛУШКА:
        return ResponseEntity.ok(new WalletResponse(telegramId, "500"));
    }

    /**
     * GET /payment/link
     * Генерация ссылки на оплату (Invoice).
     */
    @GetMapping("/payment/link")
    public ResponseEntity<PaymentLinkResponse> getPaymentLink(
            @RequestParam("amount") Double amount,
            Principal principal
    ) {
        String telegramId = principal.getName();

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().build();
        }

        // ЛОГИКА:
        // Вызов Telegram Bot API (createInvoiceLink) через сервис
        // String invoiceLink = telegramBotService.createInvoiceLink(telegramId, amount);

        // ЗАГЛУШКА:
        String invoiceLink = "https://t.me/invoice/example-link";

        return ResponseEntity.ok(new PaymentLinkResponse(telegramId, invoiceLink));
    }
}