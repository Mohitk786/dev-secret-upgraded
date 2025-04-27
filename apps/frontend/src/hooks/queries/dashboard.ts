import { fetchDashboardStats } from "@/services/extraServices"
import { useQuery } from "@tanstack/react-query"

export const useDashboardData = () => {
    const {data, isLoading} =  useQuery({
        queryKey: ["get-dashboard-data"],
        queryFn: fetchDashboardStats
    })

    return {data, isLoading}
}