import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const applicationStatusEnum = pgEnum('application_status', [
  'applied',
  'interview',
  'offer',
  'rejected',
])

export const interviewStatusEnum = pgEnum('interview_status', [
  'to_schedule',
  'scheduled',
  'completed',
  'cancelled',
])

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  company: text('company').notNull(),
  role: text('role').notNull(),
  status: applicationStatusEnum('status').default('applied').notNull(),
  salaryRange: text('salary_range'),
  jobUrl: text('job_url'),
  notes: text('notes'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  location: text('location'), 
  contactName: text('contact_name'),
  contactRole: text('contact_role'),
  contactEmail: text('contact_email'),
})

export const interviews = pgTable('interviews', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  round: text('round').notNull(), 
  status: interviewStatusEnum('status').default('scheduled').notNull(),
  durationMinutes: integer('duration_minutes'),
  interviewer: text('interviewer'), 
  scheduledAt: timestamp('scheduled_at'), 
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const applicationsRelations = relations(applications, ({ many }) => ({
  interviews: many(interviews),
}))

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
}))

export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
export type Interview = typeof interviews.$inferSelect
export type NewInterview = typeof interviews.$inferInsert