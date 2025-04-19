"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetVaultQuery } from "@/hooks/queries/useVaultQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import useToast from "@/hooks/utils/useToast";
import {
  Users,
  MoreVertical,
  UserPlus,
  ArrowLeft,
  Shield,
  PenLine,
  Trash2,
  UserX,
  ShieldCheck,
  ShieldX,
  Plus
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetVaultCollaboratorsQuery } from "@/hooks/queries/useCollabQuery";
// import { useDecryptAllSecrets } from "@/hooks/utils/useDecryptAllSecrets";
import { useConfirmAccess, useToggleAccess } from "@/hooks/mutations/useCollab";
// import { reEncryptData } from "@/lib/reEncryption";
// import ConfirmAccess from "@/components/Helper/ConfirmAccess";
import { ConfirmModalData } from "@/constants/data";
import { accessToAll } from "@/E2E/operations/accessToAll";
import ConfirmAccess from "@/components/utils/ConfirmAccess";
import useSocket from "@/hooks/utils/useSocket";
import { useAuth } from "@/hooks/queries/authQueries";
// import { confirmAccess } from "@/services/collabServices";

interface Collaborator {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
  role: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  hasSecretAccess: boolean;
}

const VaultCollaborators = () => {

  const { vaultId } = useParams();
  const socket = useSocket();
  const [isAccessConfirmModalOpen, setIsAccessConfirmModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>({
    title: "",
    description1: "",
    description2: "",
    buttonText: "",
    onConfirm: () => { },
    collaborator: null,
  });
  const [collaboratorToRemove, setCollaboratorToRemove] = useState<Collaborator | null>(null);

  const { data: vault } = useGetVaultQuery(vaultId as string);
  const { data: collaborators, isLoading } = useGetVaultCollaboratorsQuery(vaultId as string)
  const { user } = useAuth()
  const { mutate: confirmAccess, isPending: isConfirmingAccess } = useConfirmAccess();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  // const { mutate: toggleAccess, isPending: isTogglingAccess } = useToggleAccess();

  // const { decyptedSecrets } = useDecryptAllSecrets(vault?.vault)



  // const updatePermissionsMutation = useMutation({
  //   mutationFn: async ({ memberId, permissions }: { memberId: string, permissions: any }) => {
  //     return axiosInstance.patch(`/collab/vault-collaborators/${vaultId}/${memberId}`, permissions);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["vault-collaborators", vaultId] });
  //     showToast({
  //       type: "success",
  //       message: "Permissions updated",
  //     });
  //   },
  //   onError: (error: any) => {
  //     showToast({
  //       type: "error",
  //       message: "Error updating permissions",
  //     });
  //   }
  // });

  const handleRemoveCollaborator = (collaborator: Collaborator) => {
    setCollaboratorToRemove(collaborator);
  };

  const confirmRemoveCollaborator = () => {
    if (collaboratorToRemove) {
      socket.emit("remove-collaborator", { collaboratorId: collaboratorToRemove.id, vaultId: vaultId as string })
      setCollaboratorToRemove(null)
    }
  };

  const togglePermission = (collaborator: Collaborator, permission: 'canView' | 'canEdit' | 'canDelete' | 'canAdd') => {
    // Cannot disable view permission
    if (permission === 'canView') return;

    const newPermissions = {
      [permission]: !collaborator[permission]
    };

      // updatePermissionsMutation.mutate({
      //   memberId: collaborator?.id,
      //   permissions: newPermissions
      // });
  };

  const handleConfirmAccess = async () => {
    const finalData = await accessToAll(vault?.id, collaborators)
    await confirmAccess({ finalData, vaultId: vaultId as string })
  }

  const handleToggleAccess = async (collaborator: Collaborator) => {
    console.log("toggle access collaborator", collaborator)
    socket.emit("join-vault", vaultId as string)
    socket.emit("toggle-access", { collaboratorId: collaborator.user.id, vaultId: vaultId as string })
  }

  const handleActionClick = async (flag: string, collaborator?: Collaborator) => {
    setIsAccessConfirmModalOpen(true)

    if (flag === "access_to_all") {
      setModalData({ ...ConfirmModalData.access_to_all, onConfirm: handleConfirmAccess })
    }

    if (flag === "toggle_access") {
      setModalData({ ...ConfirmModalData.toggle_access, onConfirm: handleToggleAccess, collaborator: collaborator })
    }
    if (flag === "remove_collaborator") {
      setModalData({ ...ConfirmModalData.remove_collaborator, onConfirm: handleRemoveCollaborator, collaborator: collaborator })
    }

    setIsAccessConfirmModalOpen(true)
  }


  useEffect(() => {

    socket.emit("get-online-users", vaultId as string)
    const handleOnlineUsers = (data: any) => {
      setOnlineUsers(data.onlineUsers)
    }

    socket.on("online-users", handleOnlineUsers)
    return () => {
      socket.off("online-users", handleOnlineUsers)
    }

  }, [vaultId])

  return (
    <>
      <div className="space-y-6">


        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Vault Collaborators</h1>
            <p className="text-muted-foreground">
              {vault ? `Manage who has access to "${vault.name}"` : 'Manage who has access to this vault'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/u/dashboard/vaults/${vaultId}/invite`}>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </Link>
            <Button className="flex items-center gap-2 bg-green-400 hover:bg-green-600 text-black" onClick={() => handleActionClick("access_to_all")} disabled={isConfirmingAccess}>
              <ShieldCheck className="h-4 w-4" />
              Confirm Access
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Collaborators
            </CardTitle>
            <CardDescription>
              People with access to this vault
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-8 text-center">
                <p>Loading collaborators...</p>
              </div>
            ) : collaborators.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No collaborators yet</p>
                <Link href={`/u/dashboard/vaults/${vaultId}/invite`}>
                  <Button variant="outline" className="mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Collaborators
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Permissions</TableHead>
                    {vault?.ownerId !== user?.id && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaborators && collaborators.map((collaborator: Collaborator) => (
                    <TableRow key={collaborator?.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {collaborator?.user?.avatarUrl ? (
                            <img src={collaborator?.user?.avatarUrl} alt={collaborator?.user?.name || collaborator?.user?.email} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              {collaborator?.user?.name?.charAt(0) || collaborator?.user?.email.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="flex items-center gap-2">{collaborator?.user?.name || collaborator?.user?.email} {onlineUsers && onlineUsers.includes(collaborator?.user?.id) && <span className="text-green-500 text-xs">Online</span>}</p>
                            {collaborator?.user?.name && (
                              <p className="text-xs text-muted-foreground">{collaborator?.user?.email}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-not-allowed"
                          >
                            <Shield className="h-3 w-3 mr-1" /> View
                          </Badge>

                          <Badge
                            variant={collaborator?.canEdit ? "outline" : "secondary"}
                            className={collaborator?.canEdit
                              ? "bg-green-500/10 text-green-500 border-green-500/20 cursor-pointer"
                              : "cursor-pointer"}
                            onClick={() => togglePermission(collaborator, 'canEdit')}
                          >
                            <PenLine className="h-3 w-3 mr-1" /> Edit
                          </Badge>

                          <Badge
                            variant={collaborator?.canDelete ? "outline" : "secondary"}
                            className={collaborator?.canDelete
                              ? "bg-red-500/10 text-red-500 border-red-500/20 cursor-pointer"
                              : "cursor-pointer"}
                            onClick={() => togglePermission(collaborator, 'canDelete')}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Badge>

                          <Badge
                            variant={collaborator?.canAdd ? "outline" : "secondary"}
                            className={collaborator?.canAdd
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-pointer"
                              : "cursor-pointer"}
                            onClick={() => togglePermission(collaborator, 'canAdd')}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Badge>
                        </div>
                      </TableCell>
                      {vault?.ownerId !== user?.id && <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                              onClick={() => handleActionClick("remove_collaborator", collaborator)}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={`${collaborator?.hasSecretAccess ? "text-red-600 cursor-pointer" : "text-green-600 cursor-pointer"}`}
                              onClick={() => handleActionClick("toggle_access", collaborator)}
                            >
                              {collaborator?.hasSecretAccess ? <ShieldX className="h-4 w-4 mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                              {collaborator?.hasSecretAccess ? "Revoke Access" : "Allow Access"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={!!collaboratorToRemove} onOpenChange={(open) => !open && setCollaboratorToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Collaborator</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {collaboratorToRemove?.user?.name || collaboratorToRemove?.user?.email}?
                They will no longer have access to this vault.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {/* <AlertDialogAction
                onClick={confirmRemoveCollaborator}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ConfirmAccess
          open={isAccessConfirmModalOpen}
          onOpenChange={setIsAccessConfirmModalOpen}
          modalData={modalData}
        />
      </div>
    </>
  );
};

export default VaultCollaborators;
