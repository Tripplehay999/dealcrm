import { z } from 'zod'

export const noteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty').max(10000),
})

export type NoteInput = z.infer<typeof noteSchema>
