import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "@secret-vault/db/client";
import { config } from "@secret-vault/backend-common/config";
import { sign } from "jsonwebtoken";
import { CustomRequest } from "../../middleware/auth";

export const signUpUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, publicKey } =
            req.body;

        if (!email || !password || !publicKey) {
            res.status(400).json({
                message: "All fields are requried"
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email:email
            }
        })

        console.log(existingUser);

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "Email or Phone Number already exists.",
            });
            return;
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: password_hash,
                publicKey
            }
        })

        res.status(200).json({
            success: true,
            message: "User created successfully",
            data: user
        })


    } catch (error: any) {
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "An error occurred during registration.",
        });
    }
};

export const signInUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found with the provided email"
            })
            return
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Incorrect password.",
            });
            return;
        }

        const token = sign({ id: existingUser.id }, config.JWT_SECRET as string, { expiresIn: '7d' });

        res.cookie('dev_secret_vault_auth_token', token, {
            secure: false,
            // sameSite: 'none',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user: existingUser,
                token
            }
        })
    } catch (error: any) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "An error occurred during sign in.",
        });
    }
};

