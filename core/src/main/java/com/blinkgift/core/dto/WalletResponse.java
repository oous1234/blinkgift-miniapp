package com.blinkgift.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WalletResponse {
    private String telegramId;
    private String amountInCents;
}
