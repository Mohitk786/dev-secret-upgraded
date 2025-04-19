import { login, signup } from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useToast from "../utils/useToast";


export const useLoginMutation = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); 
    const { showToast } = useToast();

    const redirectTo = searchParams.get("redirectTo") || "/u/dashboard";

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("DEV_SECRET_VAULT_AUTH_TOKEN", data?.data?.token);
            localStorage.setItem("PUBLIC_KEY", data?.data?.user?.publicKey);
            router.push(redirectTo);
        },
        onError: (error: any) => {
            showToast({type: "error", message: error?.response?.data?.message});
        }
    })
}

export const useSignupMutation = () => {
    const router = useRouter();
    const {showToast} = useToast();
   
    return useMutation({
        mutationFn: signup,
        onSuccess: () => {
            showToast({type: "success", message:"Private key saved to your device. Please keep it safe. You will need it in future to login to your account otherwise you will not be able to access your account."});
            router.push("/login");
        },
        onError: (error: any) => {
            showToast({type: "error", message: error?.response?.data?.message});
        }
    })

}
