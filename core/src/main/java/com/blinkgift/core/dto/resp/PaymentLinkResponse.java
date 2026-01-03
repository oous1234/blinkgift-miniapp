package com.blinkgift.core.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentLinkResponse {
    private String telegramId;
    private String url;
}