export const AUTH_CONFIG = {
  // Тот самый tgauth, который требует внешнее API
  EXTERNAL_TGAUTH: JSON.stringify({
    id: 8241853306,
    first_name: "ЛинкПро",
    username: "linkproadmin",
    auth_date: 1767463372,
    hash: "f26034faff41934d58242f155c1771d42caf6c753df28d3d61cead61708c6208",
  }),
  
  getInitData: () => window.Telegram?.WebApp?.initData || "",
};