import { cookies } from "next/headers";
import { config } from "@secret-vault/backend-common/config";

export async function serverFetch<T = any>(endpoint: string, options: RequestInit = {}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("DEV_SECRET_VAULT_AUTH_TOKEN")?.value;

    if (!token) {
      return { success: false, error: "Auth token missing" };
    }

    const res = await fetch(`${config.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Cookie: `DEV_SECRET_VAULT_AUTH_TOKEN=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, error: `API error: ${res.status} ${res.statusText}` };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || "Unexpected error" };
  }
}
