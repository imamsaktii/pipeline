import { createServerFn } from '@tanstack/react-start'
import { and, asc, desc, eq, ilike, or, inArray} from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/db'
import { applications, interviews } from '#/db/schema'
import {
  applicationSearchSchema,
  createApplicationSchema,
  createInterviewSchema,
  saveApplicationChangesSchema
} from '#/lib/validators'

const PAGE_SIZE = 8 

export const getApplications = createServerFn({ method: 'GET' })
  .validator((data: unknown) => applicationSearchSchema.parse(data))
  .handler(async ({ data }) => {
    const conditions = []

    if (data.status !== 'all') {
      conditions.push(eq(applications.status, data.status))
    }

    if (data.q?.trim()) {
      const keyword = `%${data.q.trim()}%`
      conditions.push(
        or(ilike(applications.company, keyword), ilike(applications.role, keyword)),
      )
    }

    const orderBy =
      data.sort === 'oldest'
        ? asc(applications.appliedAt)
        : data.sort === 'company'
          ? asc(applications.company)
          : desc(applications.appliedAt)

    const [rows, allApps] = await Promise.all([
      db.query.applications.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy,
        limit: PAGE_SIZE,
        offset: (data.page - 1) * PAGE_SIZE,
        with: {
          interviews: {
            orderBy: asc(interviews.scheduledAt),
          },
        },
      }),
      db.select({ status: applications.status, company: applications.company }).from(applications),
    ])

    // Hitung counts & metrics untuk header + tabs
    const counts = {
      all: allApps.length,
      applied: allApps.filter((a) => a.status === 'applied').length,
      interview: allApps.filter((a) => a.status === 'interview').length,
      offer: allApps.filter((a) => a.status === 'offer').length,
      rejected: allApps.filter((a) => a.status === 'rejected').length,
    }

    const uniqueCompanies = new Set(allApps.map((a) => a.company.toLowerCase())).size
    const responded = counts.interview + counts.offer + counts.rejected
    const responseRate = counts.all > 0 ? Math.round((responded / counts.all) * 100) : 0

    return {
      items: rows,
      counts,
      metrics: {
        totalApplied: counts.all,
        uniqueCompanies,
        activeInterviews: counts.interview,
        offers: counts.offer,
        responseRate,
      },
      pagination: {
        page: data.page,
        pageSize: PAGE_SIZE,
        total: data.status === 'all' ? counts.all : counts[data.status],
      },
    }
  })

export const createApplication = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const [created] = await db
      .insert(applications)
      .values({
        ...data,
        jobUrl: data.jobUrl || null,
        contactEmail: data.contactEmail || null,
      })
      .returning()

    return created
  })

export const addInterviewRound = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createInterviewSchema.parse(data))
  .handler(async ({ data }) => {
    const [created] = await db
      .insert(interviews)
      .values({
        applicationId: data.applicationId,
        round: data.round,
        status: data.status,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        durationMinutes: data.durationMinutes ?? null,
        interviewer: data.interviewer || null,
        notes: data.notes || null,
      })
      .returning()

    return created
  })

  export const deleteApplication = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ id: z.number().int().positive() }).parse(data))
  .handler(async ({ data }) => {
    await db.delete(applications).where(eq(applications.id, data.id))
    return { ok: true }
  })

  export const saveApplicationChanges = createServerFn({ method: 'POST' })
  .validator((data: unknown) => saveApplicationChangesSchema.parse(data))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(applications)
        .set({ status: data.status })
        .where(eq(applications.id, data.id))
        .returning()

      if (!updated) throw new Error('Application not found')

      if (data.deletedInterviewIds.length > 0) {
        await tx
          .delete(interviews)
          .where(inArray(interviews.id, data.deletedInterviewIds))
      }

      for (const item of data.interviews) {
        const payload = {
          round: item.round,
          status: item.status,
          scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null,
          durationMinutes: item.durationMinutes,
          interviewer: item.interviewer,
          notes: item.notes?.trim() || null,
        }

        if (item.id) {
          await tx
            .update(interviews)
            .set(payload)
            .where(eq(interviews.id, item.id))
        } else {
          await tx.insert(interviews).values({
            applicationId: data.id,
            ...payload,
          })
        }
      }

      return updated
    })
  })