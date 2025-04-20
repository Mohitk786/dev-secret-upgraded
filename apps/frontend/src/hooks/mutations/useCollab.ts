import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendInvite, acceptInvite, rejectInvite  } from "@/services/collabServices";
import { confirmAccess, toggleAccess } from "@/services/collabServices";
import useToast from "@/hooks/utils/useToast";
import { APP_ROUTES } from "@/constants/data";
import { useRouter } from "next/navigation";

export const useInviteCollab = () => {
    return useMutation({
        mutationFn: (data: any) => sendInvite(data),
    });
}

export const useConfirmAccess = () => {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: (data: any) => confirmAccess(data),
        onSuccess: () => {
            showToast({
                type: "success",
                message: "Access confirmed",
            })
        },
        onError: () => {
            showToast({
                type: "error",
                message: "Error confirming access",
            })
        }
    });
}

export const useToggleAccess = () => {
    return useMutation({
        mutationFn: (data: any) => toggleAccess(data),
    });
}

export const useAcceptInvite = () => {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (inviteId: string) => acceptInvite(inviteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invites"] });
            queryClient.invalidateQueries({ queryKey: ["shared-vaults"] });
        },
        onError: (error: any) => {
            showToast({
                type: "error",
                message: error?.response?.data?.message || "Error accepting invite",
            });
            router.push(APP_ROUTES.SHARED_WITH_ME);
        }
    });
}


export const useRejectInvite = () => {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (data: any) => rejectInvite(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invites"] });   
            showToast({
                type: "success",
                message: "Invite rejected",
            });
        },
        onError: () => {
            showToast({
                type: "error",
                message: "Error rejecting invite",
            });
        router.push(APP_ROUTES.SHARED_WITH_ME);
        }       

    });
}