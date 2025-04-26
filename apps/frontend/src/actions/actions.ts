"use server";

import { fetchDashboardStats } from "@/services/extraServices";
import { cookies } from "next/headers"; 
import jwt from "jsonwebtoken";
import { config } from "@secret-vault/backend-common/config";

export async function getDashboardStats() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("dev_secret_vault_auth_token")?.value;

    if (!authToken) {
        throw new Error("User not authenticated"); 
      }
  return await fetchDashboardStats(authToken);
}





export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("dev_secret_vault_auth_token")?.value;
  console.log("token", token);  
  if (!token) return null;
    
  try {
    const user = jwt.verify(token, config.JWT_SECRET as string);
    console.log("user", user);
    return user;
  } catch (error) {
    return null;
  }
}
