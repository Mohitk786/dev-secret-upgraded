import { cookies } from "next/headers";

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("DEV_SECRET_VAULT_AUTH_TOKEN")?.value;

  if (!token) {
    throw new Error("Auth token missing");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "https://api.developermatch.me/api"}${endpoint}`,
    {
      ...options,
      headers: {
        ...options.headers,
        Cookie: `DEV_SECRET_VAULT_AUTH_TOKEN=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }

  return res.json();
}
