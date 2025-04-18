import { Server } from "socket.io";
import { authenticated } from "./utils/autenticate";
import { createSecret, getSecrets, deleteSecret, updateSecret } from "./controllers/secretController";
import { CreateSecretData, DeleteSecretData, GetSecretsData, UpdateSecretData, VaultDeletedData, VaultUpdatedData, AllowCollaboratorData, RevokeCollaboratorData } from "./types/types";
import { deleteVault,  updateVault,  revokeCollaboratorAccess, allowAllCollaborators } from "./controllers/vaultControllert";
import { getSocketByUserId } from "./utils/getSocketI";


export const io = new Server(5000, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const vaultOnlineUsers: Record<string, Set<string>> = {}
export const userSocketMap: Map<string, string> = new Map();



io.on("connection", async (socket) => {
    const userId = await authenticated(socket);

    if (!userId) {
        socket.emit("error", "Unauthorized");
        return socket.disconnect();
    }

    socket.on("authenticate", (userId: string) => {
        userSocketMap.set(userId, socket.id);  // Save the socket ID associated with the user ID
    });

    console.log(`🔐 Authenticated user ${userId} connected`);

    socket.on("join-vault", (vaultId: string) => {
        socket.join(`vault-${vaultId}`);

        if (!vaultOnlineUsers[vaultId]) {
            vaultOnlineUsers[vaultId] = new Set();
        }

        vaultOnlineUsers[vaultId].add(userId);

        io.to(`vault-${vaultId}`).emit("vault-online-users", Array.from(vaultOnlineUsers[vaultId]));
    });

    socket.on("create-secret", async (data: CreateSecretData) => {
        const secret = await createSecret(data, userId);
        io.to(`vault-${data.vaultId}`).emit("secret-created", secret);
    });

    socket.on("get-secrets", async (data: GetSecretsData) => {
        const secrets = await getSecrets(data, userId);
        socket.emit("secrets-fetched", secrets);
    });

    socket.on("delete-secret", async (data: DeleteSecretData) => {
        const deleted = await deleteSecret(data, userId);
        io.to(`vault-${data.vaultId}`).emit("secret-deleted", deleted);
    });

    socket.on("update-secret", async (data: UpdateSecretData) => {
        const updated = await updateSecret(data, userId);
        io.to(`vault-${data.vaultId}`).emit("secret-updated", updated);
    });

    socket.on("vault-updated", async (data: VaultUpdatedData) => {
       const updated = await updateVault(data, userId);
       io.to(`vault-${data.vaultId}`).emit("vault-updated", updated);
    });

    socket.on("delete-vault", async (data: VaultDeletedData) => {
        const deleted = await deleteVault(data, userId);
        io.to(`vault-${data.vaultId}`).emit("vault-deleted", deleted);
    });

    socket.on("allow-all-collaborators", async (data: AllowCollaboratorData) => {
        const {vaultId, collaborators} = data;
        const allowed = await allowAllCollaborators(userId, vaultId, collaborators);
        io.to(`vault-${vaultId}`).emit("collaborator-allowed", allowed);
    });

    socket.on("revoke-collaborator", async (data: RevokeCollaboratorData) => {
        const {vaultId, collaboratorId} = data;
        const revokeSuccess = await revokeCollaboratorAccess(userId, vaultId, collaboratorId);

        if (!revokeSuccess) {
            return socket.emit("error", "Failed to revoke access");
        }
        socket.emit("collaborator-access-revoked", {
            message: `Collaborator ${collaboratorId} access has been revoked.`,
        });
    
        const collaboratorSocket = getSocketByUserId(collaboratorId);

        if (collaboratorSocket) {
            io.to(collaboratorSocket.id).emit("access-revoked", {
                message: "Your access to this vault has been revoked.",
            });
    
            // Optionally disconnect the collaborator from the vault room to stop receiving updates
            collaboratorSocket.leave(`vault-${vaultId}`);
        }
       
    });
    
   
    socket.on("disconnect", () => {
        console.log(`❌ Disconnected: ${userId}`);
        for (const [vaultId, users] of Object.entries(vaultOnlineUsers)) {
            if (users.has(userId)) {
                users.delete(userId);
                io.to(`vault-${vaultId}`).emit("vault-online-users", Array.from(users));
            }
        }

        userSocketMap.forEach((value, key) => {
            if (value === socket.id) {
                userSocketMap.delete(key);
            }
        });
    });
});


io.listen(5000);

