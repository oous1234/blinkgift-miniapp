package com.blinkgift.core.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.concurrent.TimeUnit;

public class GetGemsProxyConfig {

    // Твой API ключ
    private static final String API_KEY = "1767696328881-mainnet-10772317-r-JZxQ9TmGu7URUGscDZjznrMzVtNBcCpVlOTgsFx9t8Xv8c4o";

    @Bean
    public okhttp3.OkHttpClient okHttpClient() {
        // Настройка прокси localhost:8000
        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("localhost", 8000));

        return new okhttp3.OkHttpClient.Builder()
                .proxy(proxy)
                // Увеличим таймауты, так как прокси и парсинг могут быть долгими
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    // 👇 ДОБАВЛЯЕМ ЭТОТ БИН 👇
    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            template.header("Authorization", API_KEY);
            template.header("Accept", "application/json"); // На всякий случай добавим и это
        };
    }
}