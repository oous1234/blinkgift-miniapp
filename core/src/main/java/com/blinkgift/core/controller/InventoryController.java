package com.blinkgift.core.controller;

import com.blinkgift.core.dto.GiftItem;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory") // Или "/api/inventory", зависит от настроек Settings.apiUrl() на фронте
@CrossOrigin(origins = "*") // Разрешаем запросы с любого домена (для теста)
public class InventoryController {

    private final ObjectMapper objectMapper;

    public InventoryController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<?> getInventory(@RequestHeader(value = "Authorization", required = false) String token) {
        // Логируем токен, чтобы убедиться, что фронт его шлет
        System.out.println("Received request with token: " + token);

        try {
            // 1. Читаем файл из ресурсов (src/main/resources/inventory-mock.json)
            ClassPathResource resource = new ClassPathResource("inventory-mock.json");
            InputStream inputStream = resource.getInputStream();

            // 2. Парсим JSON в список объектов GiftItem
            List<GiftItem> items = objectMapper.readValue(inputStream, new TypeReference<List<GiftItem>>() {});

            // 3. Формируем ответ
            // Твой фронт ожидает { items: [...] } или просто массив.
            // Сделаем объект map, чтобы соответствовать интерфейсу InventoryResponse { items: GiftItem[] }
            Map<String, Object> response = new HashMap<>();
            response.put("items", items);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error reading inventory file");
        }
    }
}
