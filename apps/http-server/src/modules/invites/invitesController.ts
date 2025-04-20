import prisma from "@secret-vault/db/client";

export const getAllInvites = async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        const { type, status } = req.query;

        if (!type || !status) {
            return res.status(400).json({ message: "Type and status are required" });
        }

        const validStatuses = ["PENDING", "ACCEPTED", "REJECTED", "ALL"];
        const validTypes = ["sent", "received"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid type" });
        }

        const where: any = {};
        if (type === "sent") {
            where.inviterId = userId;
        } else {
            where.inviteeId = userId;
        }

        if (status !== "ALL") {
            where.status = status;
        }
        
         
        const invites = await prisma.invite.findMany({
            where,
            include: {
                vault: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                inviter:{
                    select:{
                        id: true,
                        email: true,
                        name: true,
                    }
                }
            }
        });
    

        return res.status(200).json({ invites });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error?.message });
    }
};