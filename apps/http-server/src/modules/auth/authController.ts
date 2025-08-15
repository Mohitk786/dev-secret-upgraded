import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "@secret-vault/db/client";
import { config } from "@secret-vault/backend-common/config";
import { sign } from "jsonwebtoken";

export const signUpUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } =
            req.body;

       

        const existingUser = await prisma.user.findFirst({
            where: {
                email:email
            }
        })


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
            }
        })

        res.status(200).json({
            success: true,
            message: "User created successfully",
            userId: user.id
        })


    } catch (error: any) {
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "An error occurred during registration.",
        });
    }
};


export const uploadPublicKey = async (req: Request, res: Response): Promise<void> => {
    try {
        const { publicKey, userId } = req.body;
        console.log("publicKey", publicKey, userId);
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Something went wrong"
            })
            return
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                publicKey
            }
        })

        res.status(200).json({
            success: true,
            message: "Public key uploaded successfully"
        })

    } catch (error: any) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Something went wrong"
        })
    }
}

export const signInUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

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
        
        res.cookie('DEV_SECRET_VAULT_AUTH_TOKEN', token, {
            secure: false,
            // sameSite: 'none',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        console.log("token1", token);
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


export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('DEV_SECRET_VAULT_AUTH_TOKEN', {
            httpOnly: true,
            secure: config.NODE_ENV === "production", 
            sameSite: 'lax',
            path: '/',
            expires: new Date(0)
        });
        
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
}