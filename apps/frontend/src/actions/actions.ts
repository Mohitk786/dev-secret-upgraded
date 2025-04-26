"use server";

import { fetchDashboardStats } from "@/services/extraServices";
import { cookies } from "next/headers"; 

export async function getDashboardStats() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("dev_secret_vault_auth_token")?.value;

    if (!authToken) {
        throw new Error("User not authenticated"); 
      }
  return await fetchDashboardStats(authToken);
}
