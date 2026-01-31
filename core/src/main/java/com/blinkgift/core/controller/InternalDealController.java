package com.blinkgift.core.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/internal/v1/deals")
@RequiredArgsConstructor
public class InternalDealController {

    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/publish")
    public void publishDeal(@RequestBody Map<String, Object> dealData) {
        messagingTemplate.convertAndSend("/topic/deals", (Object) dealData);
    }
}