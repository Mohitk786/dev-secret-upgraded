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

    const token = cookies?.DEV_SECRET_VAULT_AUTH_TOKEN;

    if (!token) {
      console.error("No token found in cookies");
      return;
    }


    const decoded = jwt.verify(token, config.JWT_SECRET as string);
    if (typeof decoded === "string") return;

    return decoded?.id;
  } catch (err: any) {
    console.error("Error decoding token:", err?.message);
    socket.disconnect();
    return;
  }
};
