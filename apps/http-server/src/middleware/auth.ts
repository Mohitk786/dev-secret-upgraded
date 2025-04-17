import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@secret-vault/backend-common/config";

interface User {
  id: string;
  email: string;
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const isAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const token = req?.cookies?.dev_secret_vault_auth_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, config.JWT_SECRET as string) as User;
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
