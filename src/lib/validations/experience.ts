import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url("Invalid URL")]);
const month = z.string().regex(/^\d{4}-\d{2}$/, "Pick a month");

const translationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  organization: z.string().trim().min(1, "Organization is required").max(120),
  location: z.string().trim().max(120),
  description: z.string().trim().max(2000),
});

export const experienceSchema = z
  .object({
    type: z.enum(["education", "work", "certificate"]),
    startDate: month,
    endDate: z.union([z.literal(""), month]),
    url: optionalUrl,
    translations: z.object({
      en: translationSchema,
      ar: translationSchema,
      tr: translationSchema,
    }),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

export type ExperienceInput = z.infer<typeof experienceSchema>;

const emptyTranslation = {
  title: "",
  organization: "",
  location: "",
  description: "",
};

export const emptyExperience: ExperienceInput = {
  type: "work",
  startDate: "",
  endDate: "",
  url: "",
  translations: {
    en: { ...emptyTranslation },
    ar: { ...emptyTranslation },
    tr: { ...emptyTranslation },
  },
};
