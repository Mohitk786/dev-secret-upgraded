import { Server } from "socket.io";
import { authenticated } from "./utils/autenticate";
import {
  createSecret,
  deleteSecret,
  updateSecret,
} from "./controllers/secretController";
import {
  CreateSecretData,
  DeleteSecretData,
  UpdateSecretData,
  VaultDeletedData,
  VaultUpdatedData,
  AllowCollaboratorData,
  RevokeCollaboratorData,
} from "./types/types";
import {
  deleteVault,
  updateVault,
  toggleCollaboratorAccess,
  allowAllCollaborators,
} from "./controllers/vaultControllert";
import { getSocketByUserId } from "./utils/getSocketI";
import { checkVaultAccess } from "./controllers/secretController";  

export const io = new Server(8000, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

console.log("🚀 Socket.io server running on port 8000");

const vaultOnlineUsers: Record<string, Set<string>> = {};
export const userSocketMap: Map<string, string> = new Map();

io.on("connection", async (socket) => {
  const userId = await authenticated(socket);

  if (!userId) {
    socket.emit("error", "Unauthorized");
    return socket.disconnect();
  }

  socket.on("join-vault", async (vaultId: string) => {

   const {owner, collaborator} = await checkVaultAccess(userId, vaultId)

   if(!owner && !collaborator){
    return socket.emit("error", "You do not have access to this vault");
   }


    socket.join(`vault-${vaultId}`);

    if (!vaultOnlineUsers[vaultId]) {
      vaultOnlineUsers[vaultId] = new Set();
    }

    vaultOnlineUsers[vaultId].add(userId);
    socket.emit("vault-joined", {
        vaultId,
        onlineUsers: Array.from(vaultOnlineUsers[vaultId]),
    })

    // Notify everyone except this socket
    socket.to(`vault-${vaultId}`).emit("user-joined", {
      userId,
      vaultId,
    });

  });
  socket.on("authenticate", (userId: string) => {
    userSocketMap.set(userId, socket.id); // Save the socket ID associated with the user ID
  });


  socket.on("get-online-users", (vaultId: string) => {
    socket.emit("online-users", {
      vaultId,
      onlineUsers: Array.from(vaultOnlineUsers[vaultId] || []),
    })
  })  


  socket.on("create-secret", async (data: CreateSecretData) => {
    const secret = await createSecret(data, userId);
    io.to(`vault-${data.vaultId}`).emit("secret-created", secret);

  });


  socket.on("delete-secret", async (data: DeleteSecretData) => {
    const deleted = await deleteSecret(data, userId);
    
    socket.emit("secret-deleted", {
      message: "You have deleted a secret",
      secretId: deleted.secretId
    });

    //send to all except the socket that made the request
    socket.to(`vault-${data.vaultId}`).emit("secret-deleted", deleted);
  });

  socket.on("update-secret", async (data: UpdateSecretData) => {
    const updated = await updateSecret(data, userId);
    
    socket.emit("secret-updated", {
      message: "You have updated a secret",
      encryptedSecret: updated.encryptedSecret
    });
    
    socket.to(`vault-${data.vaultId}`).emit("secret-updated", updated);
  });
  
  socket.on("delete-vault", async (data: VaultDeletedData) => {

    console.log("deleting vault", data)
    const deleted = await deleteVault(data, userId);
    console.log("deleted vault", deleted)

      socket.emit("vault-deleted", {
        message: "You have deleted a vault",
        vaultId: deleted.vaultId
      });

      //send to all except the socket that made the request
      io.to(`vault-${data.vaultId}`).emit("vault-deleted", {
        message: "Vault owner has deleted the vault",
        vaultId: deleted.vaultId
      });
  });

  socket.on("allow-all-collaborators", async (data: AllowCollaboratorData) => {
    const { vaultId, collaborators } = data;
    const allowed = await allowAllCollaborators(userId, vaultId, collaborators);
    io.to(`vault-${vaultId}`).emit("collaborator-allowed", allowed);
  });

  socket.on("toggle-access", async (data: RevokeCollaboratorData) => {
    const { vaultId, collaboratorId } = data;
    const update = await toggleCollaboratorAccess(
      userId,
      vaultId,
      collaboratorId
    );

    if (!update) {
      return socket.emit("error", "Failed to toggle access");
    }


    socket.emit("access-toggled", {
      message:  `You ${update?.updatedCollaborator?.hasSecretAccess ? 'enabled' : 'revoked'} ${update?.updatedCollaborator?.user?.name}'s access to this vault`,
    });

    const collaboratorSocket = getSocketByUserId(collaboratorId);

    if (collaboratorSocket) {
      io.to(collaboratorSocket.id).emit("access-toggled", {
        message: update.message,
        hasSecretAccess: update?.updatedCollaborator?.hasSecretAccess
      });

      //make the collaborator leave the vault room
     if(!update?.updatedCollaborator?.hasSecretAccess){
      collaboratorSocket.leave(`vault-${vaultId}`);
     }
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
