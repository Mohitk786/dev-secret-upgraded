import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/services/authServices";
import { QUERY_KEYS } from "@/constants/queryKeys";


export const useAuthQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: fetchUser,
    retry: false,
  });
};



export const useAuth = () => {
  const { data: user, isLoading, error } = useAuthQuery();
  return {
    user: user || null,
    loading: isLoading,
    error
  };
};
