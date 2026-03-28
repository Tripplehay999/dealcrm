import { z } from 'zod'

const scoreField = z
  .number()
  .int()
  .min(0, 'Min 0')
  .max(100, 'Max 100')
  .nullable()
  .optional()

export const dealSchema = z.object({
  name: z.string().min(2, 'Deal name is required').max(200),
  description: z.string().max(2000).nullable().optional(),
  website_url: z
    .string()
    .url('Enter a valid URL (include https://)')
    .nullable()
    .optional()
    .or(z.literal('')),
  industry: z.string().nullable().optional(),
  acquisition_type: z.string().nullable().optional(),
  stage: z.enum(['interested', 'contacted', 'negotiating', 'closed', 'rejected']),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['active', 'archived']),
  estimated_value: z
    .number()
    .min(0)
    .nullable()
    .optional(),
  potential_score: scoreField,
  risk_score: scoreField,
  traction_score: scoreField,
  source: z.string().nullable().optional(),
  notes_summary: z.string().max(1000).nullable().optional(),
})

export type DealInput = z.infer<typeof dealSchema>
