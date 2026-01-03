package com.blinkgift.core.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;

public class TelegramAuthenticationToken extends AbstractAuthenticationToken {

    private final Object principal; // Здесь будет TelegramUser после входа
    private final String credentials; // Здесь сырая строка initData до входа

    // Конструктор для "до аутентификации" (только сырая строка)
    public TelegramAuthenticationToken(String initData) {
        super(AuthorityUtils.NO_AUTHORITIES);
        this.principal = null;
        this.credentials = initData;
        setAuthenticated(false);
    }

    // Конструктор для "после успешной аутентификации" (данные юзера)
    public TelegramAuthenticationToken(TelegramUser user) {
        super(AuthorityUtils.createAuthorityList("ROLE_USER"));
        this.principal = user;
        this.credentials = null;
        setAuthenticated(true);
    }

    @Override
    public String getCredentials() {
        return credentials;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
}
