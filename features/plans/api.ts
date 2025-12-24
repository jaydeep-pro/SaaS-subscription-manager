import { api } from "@/lib/api";
import { plansSchema, Plan } from "@/schemas/plan.schema";

export async function fetchPlans(): Promise<Plan[]> {
  const data = await api<unknown>("/plans");
  return plansSchema.parse(data);
}
