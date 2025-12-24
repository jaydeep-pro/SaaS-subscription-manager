import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/features/plans/api";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
}
