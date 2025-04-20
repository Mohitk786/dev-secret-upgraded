import { CustomRequest, isAuthenticated } from "../../middleware/auth";
import { Response } from "express";
import { Router } from "express";
const paymentRouter = Router();
import razorpayInstance from "../../utils/razorpay";
import membershipAmount from "../../utils/plan_charges";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import prisma from "@secret-vault/db/client";
import { config } from "@secret-vault/backend-common/config";




paymentRouter.post("/payment/create", isAuthenticated, async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { membershipType }:{membershipType:string} = req.body ;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType as keyof typeof membershipAmount] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName: user.name,
                membershipType: membershipType,
            },
        });

        const payment = await prisma.payment.create({
            data: {
                userId: userId,
                orderId: order.id,
                status: order.status,
                amount: Number(order.amount),
                currency: order.currency,
                receipt: order.receipt || "",
                notes: order.notes,
            }
        });
        // Return back my order details to frontend
        res.json({ ...payment, keyId: config.RAZORPAY_KEY_ID });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
});

paymentRouter.post("/payment/webhook", async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        console.log("Webhook Called");
        const webhookSignature = req.get("X-Razorpay-Signature");
        console.log("Webhook Signature", webhookSignature);

        if (!webhookSignature) {
            return res.status(400).json({ msg: "Webhook signature is invalid" });
        }

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            config.RAZORPAY_WEBHOOK_SECRET || ""
        );

        if (!isWebhookValid) {
            console.log("INvalid Webhook Signature");
            return res.status(400).json({ msg: "Webhook signature is invalid" });
        }
        console.log("Valid Webhook Signature");

        // Udpate my payment Status in DB
        const paymentDetails = req.body.payload.payment.entity;

        console.log("paymentDetails", paymentDetails);


        const payment = await prisma.payment.findFirst({
            where:
                { orderId: paymentDetails.order_id }
        });

        if (!payment) {
            return res.status(404).json({ msg: "Payment not found" });
        }

        console.log("payment", payment);

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: paymentDetails.status,
                notes: paymentDetails.notes
            }
        });

        console.log("Payment saved");


        const user = await prisma.user.findFirst({ where: { id: payment.userId } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Update the user as premium
        await prisma.user.update({
            where: { id: payment.userId },
            data: {
                isPremium: true,
                membershipType: paymentDetails.notes?.membershipType as string || null
            }
        });


        // if (req.body.event == "payment.captured") {
        // }
        // if (req.body.event == "payment.failed") {
        // }

        // return success response to razorpay

        return res.status(200).json({ msg: "Webhook received successfully" });
    } catch (err:any) {
        return res.status(500).json({ msg: err.message });
    }
});

paymentRouter.get("/premium/verify", isAuthenticated, async (req: CustomRequest, res: Response): Promise<any> => {
    const userId = req.user?.id;
    
    
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    if (userId) {
        if (user.isPremium) {
            return res.json({ ...user });
        }
    }
    
    console.log("User is not premium");

    return res.json({ ...user });
});

export default paymentRouter;