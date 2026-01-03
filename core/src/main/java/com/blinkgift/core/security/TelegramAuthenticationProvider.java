package com.blinkgift.core.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TelegramAuthenticationProvider implements AuthenticationProvider {

    @Value("${telegram.bot.token}")
    private String botToken;

    private final ObjectMapper objectMapper;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String initData = (String) authentication.getCredentials();

        if (initData == null || initData.isEmpty()) {
            throw new BadCredentialsException("Empty init data");
        }

        try {
            // 1. Парсим query string в Map
            Map<String, String> params = parseInitData(initData);

            // 2. Достаем hash
            String receivedHash = params.get("hash");
            if (receivedHash == null) {
                throw new BadCredentialsException("No hash found in init data");
            }

            // 3. Удаляем hash из мапы для проверки подписи
            params.remove("hash");

            // 4. Сортируем ключи по алфавиту и собираем data-check-string (key=value\n)
            // TreeMap автоматически сортирует ключи
            String dataCheckString = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .collect(Collectors.joining("\n"));

            // 5. Вычисляем HMAC
            // Шаг A: HMAC-SHA256("WebAppData", botToken) -> secretKey
            byte[] secretKey = calculateHmac("WebAppData".getBytes(StandardCharsets.UTF_8), botToken);

            // Шаг B: HMAC-SHA256(secretKey, dataCheckString) -> hash
            byte[] calculatedHashBytes = calculateHmac(secretKey, dataCheckString);
            String calculatedHash = Hex.encodeHexString(calculatedHashBytes);

            // 6. Сравниваем хеши
            if (!calculatedHash.equals(receivedHash)) {
                log.warn("Invalid hash. Received: {}, Calculated: {}", receivedHash, calculatedHash);
                throw new BadCredentialsException("Invalid Telegram hash");
            }

            // 7. Проверяем auth_date (опционально, но рекомендуется: протухание за 24 часа)
            long authDate = Long.parseLong(params.getOrDefault("auth_date", "0"));
            long now = System.currentTimeMillis() / 1000;
            if (now - authDate > 86400) { // 24 часа
                log.warn("Init data expired. Auth date: {}, Now: {}", authDate, now);
                // Можно раскомментировать, если нужна строгость
                // throw new BadCredentialsException("Init data expired");
            }

            // 8. Парсим объект user из JSON
            String userJson = params.get("user");
            TelegramUser user = objectMapper.readValue(userJson, TelegramUser.class);

            // 9. Возвращаем успешную аутентификацию
            return new TelegramAuthenticationToken(user);

        } catch (Exception e) {
            log.error("Authentication error", e);
            throw new BadCredentialsException("Authentication failed: " + e.getMessage());
        }
    }

    private Map<String, String> parseInitData(String initData) {
        // initData может быть URL-encoded, а может и нет, зависит от того, как шлет фронт.
        // Обычно Telegram WebApp.initData уже готовая строка, но значения внутри закодированы.
        // Spring Security получает raw header.
        // Разбираем строку "key=value&key2=value2"
        Map<String, String> params = new TreeMap<>();
        String[] pairs = initData.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                params.put(key, value);
            }
        }
        return params;
    }

    private byte[] calculateHmac(byte[] key, String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key, "HmacSHA256");
        mac.init(secretKeySpec);
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return TelegramAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
