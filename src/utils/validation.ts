import { z } from 'zod';

// Example schema for State Election Data
export const StateElectionSchema = z.object({
  id: z.string().min(2).max(10),
  name: z.string().min(1),
  hindiName: z.string().min(1),
  status: z.object({
    en: z.string(),
    hi: z.string()
  }),
  nextElection: z.object({
    en: z.string(),
    hi: z.string()
  }),
  nextElectionYear: z.number().int().min(2024).max(2035),
  timeline: z.object({
    en: z.array(z.string()),
    hi: z.array(z.string())
  })
});

export type StateElection = z.infer<typeof StateElectionSchema>;

// Input validation for Search
export const SearchQuerySchema = z.string().max(100).transform(s => s.trim());

export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  return schema.safeParse(data);
};
