import { API_CONFIG, TELEGRAM_CONFIG, IS_DEV } from "../config/constants";

type OrderDirection = 'asc' | 'desc';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, ...rest } = options;

  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  
  const initData = window.Telegram?.WebApp?.initData;
  const tgAuthValue = initData || (IS_DEV ? TELEGRAM_CONFIG.MOCK_AUTH : "");
  url.searchParams.append("tgauth", tgAuthValue);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
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
    throw new ApiError(response.status, `API_ERROR: ${endpoint}`, errorData);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, params?: RequestOptions["params"]) => 
    request<T>(endpoint, { method: "GET", params }),
    
  post: <T>(endpoint: string, body?: any, params?: RequestOptions["params"]) => 
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body), params }),
    
  put: <T>(endpoint: string, body?: any) => 
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    
  delete: <T>(endpoint: string) => 
    request<T>(endpoint, { method: "DELETE" }),
};