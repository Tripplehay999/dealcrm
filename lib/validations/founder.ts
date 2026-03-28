import { z } from 'zod'

export const founderSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(200),
  email: z
    .string()
    .email('Enter a valid email')
    .nullable()
    .optional()
    .or(z.literal('')),
  linkedin_url: z
    .string()
    .url('Enter a valid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
  twitter_url: z
    .string()
    .url('Enter a valid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
  role_title: z.string().max(100).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
})

export type FounderInput = z.infer<typeof founderSchema>
