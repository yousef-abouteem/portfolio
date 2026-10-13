import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url("Invalid URL")]);

const translationSchema = z.object({
  headline: z.string().trim().min(1, "Headline is required").max(120),
  bio: z.string().trim().min(1, "Bio is required").max(2000),
});

export const profileSchema = z.object({
  email: z.union([z.literal(""), z.email("Invalid email")]),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  cvUrl: optionalUrl,
  avatarUrl: optionalUrl,
  translations: z.object({
    en: translationSchema,
    ar: translationSchema,
    tr: translationSchema,
  }),
});

export type ProfileInput = z.infer<typeof profileSchema>;