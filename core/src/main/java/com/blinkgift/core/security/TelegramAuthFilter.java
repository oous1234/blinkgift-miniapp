package com.blinkgift.core.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class TelegramAuthFilter extends OncePerRequestFilter {

    private final AuthenticationManager authenticationManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Достаем заголовок
        String header = request.getHeader("Authorization");

        // 2. Если заголовка нет, просто идем дальше (SecurityConfig сам решит, пускать ли анонима)
        if (header == null || header.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Очищаем префикс (если есть)
        String initData = header.startsWith("Bearer ") ? header.substring(7) : header;

        try {
            // 4. Пытаемся авторизовать
            TelegramAuthenticationToken authRequest = new TelegramAuthenticationToken(initData);
            Authentication authResult = authenticationManager.authenticate(authRequest);

            // 5. Если успешно — кладем в контекст
            SecurityContextHolder.getContext().setAuthentication(authResult);

        } catch (AuthenticationException e) {
            // Если токен невалидный — логируем, но не падаем (можно вернуть 401 тут,
            // но лучше дать Spring Security обработать это дальше)
            log.warn("Telegram auth failed: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        // 6. ВСЕГДА продолжаем цепочку
        filterChain.doFilter(request, response);
    }
}