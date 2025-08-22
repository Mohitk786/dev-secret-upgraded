import { Server } from "socket.io";
import { authenticated } from "./utils/autenticate";
import {
  createSecrets,
  deleteSecret,
  updateSecret,
} from "./controllers/secretController";
import {
  CreateSecretData,
  DeleteSecretData,
  UpdateSecretData,
  VaultDeletedData,
  RevokeCollaboratorData,
  RemoveCollaboratorData,
} from "./types/types";
import {
  deleteVault,
  toggleCollaboratorAccess,
  removeCollaborator,
} from "./controllers/vaultControllert";
import { getSocketByUserId } from "./utils/getSocketI";
import { checkVaultAccess } from "./controllers/secretController";  
import { config } from "@secret-vault/backend-common/config";

export const io = new Server(Number(config.SOCKET_PORT), {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const vaultOnlineUsers: Record<string, Set<string>> = {};
export const userSocketMap: Map<string, string> = new Map();

io.on("connection", async (socket) => {
  const userId = await authenticated(socket);

  if (!userId) {
    socket.emit("error", "Authentication failed. Please log in again.");
    return socket.disconnect();
  }

  socket.on("join-vault", async (vaultId: string) => {
    const accessCheck = await checkVaultAccess(userId, vaultId);
    console.log(`${userId} joined vault ${vaultId}`)

    if (!accessCheck.success) {
      return socket.emit("error", accessCheck.message || "Access denied to this vault");
    }

    socket.join(`vault-${vaultId}`);

    if (!vaultOnlineUsers[vaultId]) {
      vaultOnlineUsers[vaultId] = new Set();
    }

    vaultOnlineUsers[vaultId].add(userId);
    socket.emit("vault-joined", {
        vaultId,
        onlineUsers: Array.from(vaultOnlineUsers[vaultId]),
    });

    // Notify everyone except this socket
    socket.to(`vault-${vaultId}`).emit("user-joined", {
      userId,
      vaultId,
    });
  });

    socket.on("leave-vault", (vaultId: string) => {
      socket.leave(`vault-${vaultId}`);
      if (vaultOnlineUsers[vaultId]) {
        vaultOnlineUsers[vaultId].delete(userId);
        io.to(`vault-${vaultId}`).emit("online-users", {
          vaultId,
          onlineUsers: Array.from(vaultOnlineUsers[vaultId]),
        });
      }
    });


  socket.on("authenticate", (userId: string) => {
    userSocketMap.set(userId, socket.id); // Save the socket ID associated with the user ID
  });

  socket.on("get-online-users", (vaultId: string) => {
    socket.emit("online-users", {
      vaultId,
      onlineUsers: Array.from(vaultOnlineUsers[vaultId] || []),
    });
  });  

  socket.on("create-secrets", async (data: CreateSecretData) => {
    const result = await createSecrets(data, userId);
    
    if (!result.success) {
      return socket.emit("error", result.message || "Failed to create secret");
    }
    
    io.to(`vault-${data.vaultId}`).emit("secret-created", result);
  });

  socket.on("delete-secret", async (data: DeleteSecretData) => {
    const deleted = await deleteSecret(data, userId);

    if (!deleted.success) {
      return socket.emit("error", deleted.message || "Failed to delete secret");
    }
    
    socket.emit("secret-deleted", {
      message: "Secret deleted successfully",
      secretId: deleted.secretId
    });

    // Send to all except the socket that made the request
    socket.to(`vault-${data.vaultId}`).emit("secret-deleted", deleted);
  });

  socket.on("update-secret", async (data: UpdateSecretData) => {
    const updated = await updateSecret(data, userId);
    
    if (!updated.success) {
      return socket.emit("error", updated.message || "Failed to update secret");
    }
    
    socket.emit("secret-updated", {
      message: "Secret updated successfully",
      encryptedSecret: updated.encryptedSecret
    });
    
    socket.to(`vault-${data.vaultId}`).emit("secret-updated", updated);
  });
  
  socket.on("delete-vault", async (data: VaultDeletedData) => {
    const deleted = await deleteVault(data, userId);

    if (!deleted.success) {
      return socket.emit("error", deleted.message || "Failed to delete vault");
    }

    socket.emit("vault-deleted", {
      message: "Vault deleted successfully",
      vaultId: deleted.vaultId
    });

    // Send to all except the socket that made the request
    io.to(`vault-${data.vaultId}`).emit("vault-deleted", {
      message: "Vault has been deleted by the owner",
      vaultId: deleted.vaultId
    });
  });

 

  socket.on("toggle-access", async (data: RevokeCollaboratorData) => {
    const { vaultId, collaboratorId } = data;
    const update = await toggleCollaboratorAccess(userId, vaultId, collaboratorId);
  
    if (!update.success) {
      return socket.emit("error", update.message || "Failed to toggle collaborator access");
    }
  
    // Emit to the initiator (vault owner)
    socket.emit("access-toggled", {
      hasSecretAccess: update.updatedCollaborator?.hasSecretAccess,
      message: `You ${
        update.updatedCollaborator?.hasSecretAccess ? "enabled" : "revoked"
      } ${update.updatedCollaborator?.user?.name}'s access to this vault`
    });
  

    // Emit to the affected collaborator
    const collaboratorSocket = getSocketByUserId(collaboratorId);
    if (collaboratorSocket) {
      io.to(collaboratorSocket.id).emit("access-toggled", {
        collaboratorId,
        hasSecretAccess: update.updatedCollaborator?.hasSecretAccess,
        message: update.message
      });
  
      // If access revoked: remove from room & update online users
      if (!update.updatedCollaborator?.hasSecretAccess) {
        collaboratorSocket.leave(`vault-${vaultId}`);
  
        if (vaultOnlineUsers[vaultId]) {
          vaultOnlineUsers[vaultId].delete(collaboratorId);
  
          io.to(`vault-${vaultId}`).emit("online-users", {
            vaultId,
            onlineUsers: Array.from(vaultOnlineUsers[vaultId])
          });
        }
      }
    }
  });
  

  socket.on("remove-collaborator", async (data: RemoveCollaboratorData) => {
    const { vaultId, collaboratorId } = data;
    const removed = await removeCollaborator(userId, vaultId, collaboratorId);
    
    if (!removed.success) {
      return socket.emit("error", removed.message || "Failed to remove collaborator");
    }

    socket.emit("collaborator-removed", {
      message: `Successfully removed ${removed.collaborator.user.name} from the vault`,
      collaboratorId: removed.collaborator.id,
    });

    // Emit to the removed collaborator
    const collaboratorSocket = getSocketByUserId(collaboratorId);
    if (collaboratorSocket) {
     
      collaboratorSocket.leave(`vault-${vaultId}`);
      io.to(collaboratorSocket.id).emit("collaborator-removed", {
        message: `You have been removed from the vault`,
        collaboratorId: removed.collaborator.id,
      });

      if (vaultOnlineUsers[vaultId]) {
        vaultOnlineUsers[vaultId].delete(collaboratorId);
        io.to(`vault-${vaultId}`).emit("online-users", {
          vaultId,
          onlineUsers: Array.from(vaultOnlineUsers[vaultId]),
        });
      }

    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${userId}`);
    for (const [vaultId, users] of Object.entries(vaultOnlineUsers)) {
      if (users.has(userId)) {
        users.delete(userId);
        io.to(`vault-${vaultId}`).emit("online-users", Array.from(users));
      }
    }

    userSocketMap.forEach((value, key) => {
      if (value === socket.id) {
        userSocketMap.delete(key);
      }
    });
  });
});
