import { useMutation } from "@tanstack/react-query";
import { sendInvite } from "@/services/collabServices";
import { confirmAccess, toggleAccess } from "@/services/collabServices";
import useToast from "@/hooks/utils/useToast";

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