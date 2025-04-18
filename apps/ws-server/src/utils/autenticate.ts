import jwt from "jsonwebtoken";
import { Socket, DefaultEventsMap } from "socket.io";
import { config } from "@secret-vault/backend-common/config";

export const authenticated = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  try {
    const rawCookies = socket.handshake.headers.cookie || "";
    const cookies = Object.fromEntries(
      rawCookies.split("; ").map((c) => c.split("="))
    );

    // Correcting cookie name
    const token = cookies?.dev_secret_vault_auth_token;

    if (!token) {
      console.error("No token found in cookies");
      return;
    }

    // Verifying JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET as string);
    if (typeof decoded === "string") return;

    return decoded?.id;
  } catch (err: any) {
    console.error("Error decoding token:", err?.message);
    socket.disconnect();
    return;
  }
};
