package com.blinkgift.core.config;

import com.blinkgift.core.security.TelegramAuthFilter;
import com.blinkgift.core.security.TelegramAuthenticationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TelegramAuthenticationProvider telegramAuthenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Отключаем CSRF для REST API
                .cors(cors -> {}) // Включаем CORS (настройка бина ниже)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Без сессий

                .authorizeHttpRequests(auth -> auth
                        // Публичные эндпоинты (Swagger, Health check)
                        .requestMatchers("/api-documentation/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Разрешаем pre-flight запросы
                        .requestMatchers("/error").permitAll()

                        // Все остальные запросы требуют аутентификации
                        .anyRequest().authenticated()
                )

                // Добавляем наш фильтр перед стандартным
                .addFilterBefore(telegramAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Создаем AuthenticationManager вручную, так как Spring Boot 3 изменил способ его получения
    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(Collections.singletonList(telegramAuthenticationProvider));
    }

    // Настраиваем наш фильтр
    @Bean // Можно добавить @Bean, чтобы Spring управлял им, или вызывать как раньше
    public TelegramAuthFilter telegramAuthFilter() {
        return new TelegramAuthFilter(authenticationManager());
    }

    // Настройка CORS (чтобы фронтенд мог слать запросы)
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // В продакшене лучше указать конкретный домен фронтенда вместо "*"
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}