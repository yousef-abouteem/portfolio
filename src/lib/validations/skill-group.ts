import { z } from "zod";

const name = z.string().trim().min(1, "Name is required").max(60);

export const skillGroupSchema = z.object({
  skills: z.array(z.string().trim().min(1)).min(1, "Add at least one skill").max(30),
  sortOrder: z.coerce.number().int().min(0),
  names: z.object({ en: name, ar: name, tr: name }),
});

export type SkillGroupInput = z.infer<typeof skillGroupSchema>;

export const emptySkillGroup: SkillGroupInput = {
  skills: [],
  sortOrder: 0,
  names: { en: "", ar: "", tr: "" },
};
