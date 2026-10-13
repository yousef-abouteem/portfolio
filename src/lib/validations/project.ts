import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url("Invalid URL")]);

const translationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  summary: z.string().trim().min(1, "Summary is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and dashes only",
    ),
  techStack: z.array(z.string().trim().min(1)).max(20),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0),
  translations: z.object({
    en: translationSchema,
    ar: translationSchema,
    tr: translationSchema,
  }),
});

export type ProjectInput = z.infer<typeof projectSchema>;

const emptyTranslation = { title: "", summary: "", description: "" };

export const emptyProject: ProjectInput = {
  slug: "",
  techStack: [],
  liveUrl: "",
  repoUrl: "",
  featured: false,
  published: false,
  sortOrder: 0,
  translations: {
    en: { ...emptyTranslation },
    ar: { ...emptyTranslation },
    tr: { ...emptyTranslation },
  },
};