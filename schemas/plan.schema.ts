import { int, z } from "zod";

export const planSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Plan name is required"),
  price: z.number().min(0, "Price must be at least 0"),
  interval: z.string(),
  description: z.string(),
  features: z.array(z.string()),
});

export const plansSchema = z.array(planSchema);

export type Plan = z.infer<typeof planSchema>;
