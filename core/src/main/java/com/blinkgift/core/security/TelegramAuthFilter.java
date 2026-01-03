package com.blinkgift.core.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.io.IOException;

public class TelegramAuthFilter extends AbstractAuthenticationProcessingFilter {

    public TelegramAuthFilter(RequestMatcher requiresAuthenticationRequestMatcher) {
        super(requiresAuthenticationRequestMatcher);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        // Достаем заголовок Authorization
        // Формат ожидается: "twa-init-data <строка_данных>" или просто "<строка_данных>"
        // В Node.js коде смотрели просто на req.headers.authorization
        String header = request.getHeader("Authorization");

        if (header == null) {
            // Если заголовка нет, фильтр ничего не делает, дальше сработает Security Config (403)
            return null;
        }

        // Очищаем префикс "Bearer " если вдруг фронт его шлет, хотя для TWA это не стандарт
        String initData = header.startsWith("Bearer ") ? header.substring(7) : header;

        // Создаем токен и пробуем аутентифицировать через Manager -> Provider
        TelegramAuthenticationToken token = new TelegramAuthenticationToken(initData);
        return getAuthenticationManager().authenticate(token);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult)
            throws IOException, ServletException {
        // Если все ок, кладем юзера в контекст и идем дальше к Контроллеру
        SecurityContextHolder.getContext().setAuthentication(authResult);
        chain.doFilter(request, response);
    }
}
