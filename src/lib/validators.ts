import { z } from 'zod'

export const applicationStatusValues = [
  'applied',
  'interview',
  'offer',
  'rejected',
] as const

export const interviewStatusValues = [
  'to_schedule',
  'scheduled',
  'completed',
  'cancelled',
] as const

// Validasi URL Search Params (?status=interview&q=stripe&sort=recent&page=1&selected=5)
export const applicationSearchSchema = z.object({
  status: z.enum(['all', ...applicationStatusValues]).catch('all'),
  q: z.string().optional().catch(undefined),
  sort: z.enum(['recent', 'oldest', 'company']).catch('recent'),
  page: z.coerce.number().int().min(1).catch(1),
  selected: z.coerce.number().int().positive().optional().catch(undefined),
})

export type ApplicationSearch = z.infer<typeof applicationSearchSchema>

// Validasi Form "+ New application"
export const createApplicationSchema = z.object({
  company: z.string().min(1, 'Company wajib diisi'),
  role: z.string().min(1, 'Role wajib diisi'),
  status: z.enum(applicationStatusValues).default('applied'),
  salaryRange: z.string().optional(),
  location: z.string().optional(),
  jobUrl: z.url('Format URL tidak valid').optional().or(z.literal('')),
  notes: z.string().optional(),
  contactName: z.string().optional(),
  contactRole: z.string().optional(),
  contactEmail: z.email('Email tidak valid').optional().or(z.literal('')),
})

// Validasi Form "+ Add round"
export const createInterviewSchema = z
  .object({
    id: z.number().int().positive().optional(),
    round: z.string().trim().min(1, 'Round name is required'),
    status: z.enum(['to_schedule', 'scheduled', 'completed', 'cancelled']),
    scheduledAt: z.string().optional().default(''),
    durationMinutes: z.number().int().positive(),
    interviewer: z.string().trim().optional().default(''),
    notes: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.id) {
      if (!val.scheduledAt) {
        ctx.addIssue({
          code: 'custom',
          path: ['scheduledAt'],
          message: 'Date & time is required',
        })
      }
      if (!val.interviewer) {
        ctx.addIssue({
          code: 'custom',
          path: ['interviewer'],
          message: 'Interviewer is required',
        })
      }
    }
  })

export const saveApplicationChangesSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['applied', 'interview', 'offer', 'rejected']),
  interviews: z.array(createInterviewSchema),
  deletedInterviewIds: z.array(z.number().int().positive()),
})