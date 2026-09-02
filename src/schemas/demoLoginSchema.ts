import { z } from "zod";

export const demoLoginSchema = z.object({
  email: z
    .email("Informe um e-mail válido."),

  company: z
    .string()
    .trim()
    .min(2, "Informe o nome da empresa.")
    .max(80, "O nome da empresa é muito longo."),
});

export type DemoLoginData =
  z.infer<typeof demoLoginSchema>;