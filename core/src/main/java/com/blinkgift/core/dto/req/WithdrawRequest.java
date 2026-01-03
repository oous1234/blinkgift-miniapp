package com.blinkgift.core.dto.req;

import lombok.Data;

@Data
public class WithdrawRequest {
    private String iban;
    private String amountInCents;
}
