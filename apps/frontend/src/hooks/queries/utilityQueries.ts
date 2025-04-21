import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/extraServices";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => getDashboardStats(),
    });
};
