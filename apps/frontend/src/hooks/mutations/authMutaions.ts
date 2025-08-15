
import { login, signup, uploadPublicKey } from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useToast from "../utils/useToast";

export const useLoginMutation = () => {
    const router = useRouter();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            
            localStorage.setItem("PUBLIC_KEY", data?.data?.user?.publicKey);
            router.push("/u/dashboard");
        },
        onError: (error: any) => {
            showToast({type: "error", message: error?.response?.data?.message});
        }
    })
}

export const useSignupMutation = () => {
    const {showToast} = useToast();
    return useMutation({
        mutationFn: signup,
        
        onError: (error: any) => {
            showToast({type: "error", message: error?.response?.data?.message});
        }
    })  

}


export const useUploadPublicKeyMutation = () => {
    return useMutation({
        mutationFn: uploadPublicKey,
        
    })
}