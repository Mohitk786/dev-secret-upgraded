import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@secret-vault/backend-common/config";

interface User {
  id: string;
}

export interface CustomRequest extends Request {
  user?: User;
}

export const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req?.cookies?.dev_secret_vault_auth_token || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET as string) as User;

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

