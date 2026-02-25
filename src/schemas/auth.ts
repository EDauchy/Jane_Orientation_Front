import { z } from "zod";

// ============ LOGIN SCHEMA ============
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .includes("@", { message: "Adresse email invalide" }),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============ REGISTER SCHEMAS ============

// Step 0: Role selection
export const registerRoleSchema = z.object({
  role: z.enum(["user_reconversion", "user_pro"], {
    message: "Veuillez sélectionner un rôle",
  }),
});

// Base registration fields (step 1)
const baseRegisterSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .includes("@", { message: "Adresse email invalide" }),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z
    .string()
    .min(1, "La confirmation du mot de passe est requise"),
});

// Schema for user_reconversion
export const registerReconversionSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  }
);

// Schema for user_pro (with additional fields)
export const registerProSchema = baseRegisterSchema
  .extend({
    profession: z
      .string()
      .min(1, "La profession est requise")
      .min(2, "La profession doit contenir au moins 2 caractères"),
    experienceVerified: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine((data) => data.experienceVerified === true, {
    message: "Vous devez certifier votre expérience",
    path: ["experienceVerified"],
  });

export type RegisterRoleData = z.infer<typeof registerRoleSchema>;
export type RegisterReconversionData = z.infer<typeof registerReconversionSchema>;
export type RegisterProData = z.infer<typeof registerProSchema>;

// Combined type for form state
export type RegisterFormData = {
  role: "user_reconversion" | "user_pro" | "";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profession: string;
  experienceVerified: boolean;
};
