import { API_CONFIG, TELEGRAM_CONFIG, IS_DEV } from "../config/constants";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  useChangesApi?: boolean;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, useChangesApi, ...rest } = options;

  const baseUrl = useChangesApi ? API_CONFIG.CHANGES_URL : API_CONFIG.BASE_URL;
  const url = new URL(`${baseUrl}${endpoint}`);

  // Автоматическая авторизация Telegram
  const initData = window.Telegram?.WebApp?.initData;
  const tgAuthValue = initData || (IS_DEV ? TELEGRAM_CONFIG.MOCK_AUTH : "");

  if (tgAuthValue) {
    url.searchParams.append("tgauth", tgAuthValue);
  }

  // Обработка query-параметров
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(initData ? { "Authorization": initData } : {}),
    ...customHeaders,
  });

  const response = await fetch(url.toString(), {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, `HTTP ${response.status}: ${endpoint}`, errorData);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, params?: RequestOptions["params"], useChangesApi = false) =>
    request<T>(endpoint, { method: "GET", params, useChangesApi }),

  post: <T>(endpoint: string, body?: any, params?: RequestOptions["params"]) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      params
    }),

  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};