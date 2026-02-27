export const IS_DEV = import.meta.env.DEV;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:7777",

  WS_URL: import.meta.env.VITE_WS_URL || "http://localhost:7777/ws-deals",

  CHANGES_URL: import.meta.env.VITE_CHANGES_API_URL || "https://api.changes.tg",

  DEFAULT_USER_ID: import.meta.env.VITE_DEFAULT_USER_ID || "8241853306",
};

export const TELEGRAM_CONFIG = {
  MOCK_AUTH: JSON.stringify({
    id: Number(API_CONFIG.DEFAULT_USER_ID),
    first_name: "LinkPro",
    username: "linkproadmin",
    auth_date: Math.floor(Date.now() / 1000),
    hash: "f26034faff41934d58242f155c1771d42caf6c753df28d3d61cead61708c6208",
  }),
};

export const ASSETS = {
  FRAGMENT_GIFT: (slug: string) => `https://nft.fragment.com/gift/${slug}.webp`,
  AVATAR: (username: string) => `https://poso.see.tg/api/avatar/${username}`,
};