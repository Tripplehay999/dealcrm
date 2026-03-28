'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { dealSchema, type DealInput } from '@/lib/validations/deal'
import {
  ACQUISITION_TYPES,
  DEAL_PRIORITIES,
  DEAL_STAGES,
  INDUSTRIES,
  SOURCES,
  priorityLabel,
  stageLabel,
} from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Deal } from '@/types'

interface DealFormProps {
  deal?: Deal
  onSuccess?: (id: string) => void
}

export function DealForm({ deal, onSuccess }: DealFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!deal

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal
      ? {
          name: deal.name,
          description: deal.description ?? '',
          website_url: deal.website_url ?? '',
          industry: deal.industry ?? '',
          acquisition_type: deal.acquisition_type ?? '',
          stage: deal.stage,
          priority: deal.priority,
          status: deal.status,
          estimated_value: deal.estimated_value ?? undefined,
          potential_score: deal.potential_score ?? undefined,
          risk_score: deal.risk_score ?? undefined,
          traction_score: deal.traction_score ?? undefined,
          source: deal.source ?? '',
          notes_summary: deal.notes_summary ?? '',
        }
      : {
          stage: 'interested',
          priority: 'medium',
          status: 'active',
        },
  })

  const onSubmit = async (data: DealInput) => {
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in.')
      return
    }

    const payload = {
      ...data,
      website_url: data.website_url || null,
      description: data.description || null,
      industry: data.industry || null,
      acquisition_type: data.acquisition_type || null,
      source: data.source || null,
      notes_summary: data.notes_summary || null,
      estimated_value: data.estimated_value ?? null,
      potential_score: data.potential_score ?? null,
      risk_score: data.risk_score ?? null,
      traction_score: data.traction_score ?? null,
    }

    if (isEdit) {
      const { error: updateError } = await supabase
        .from('deals')
        .update(payload)
        .eq('id', deal.id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      // Log activity
      await supabase.from('activities').insert({
        user_id: user.id,
        deal_id: deal.id,
        type: 'deal_updated',
        description: `Updated deal "${data.name}"`,
      })

      if (onSuccess) {
        onSuccess(deal.id)
      } else {
        router.push(`/deals/${deal.id}`)
        router.refresh()
      }
    } else {
      const { data: newDeal, error: insertError } = await supabase
        .from('deals')
        .insert({ ...payload, user_id: user.id })
        .select()
        .single()

      if (insertError || !newDeal) {
        setError(insertError?.message ?? 'Failed to create deal.')
        return
      }

      // Log activity
      await supabase.from('activities').insert({
        user_id: user.id,
        deal_id: newDeal.id,
        type: 'deal_created',
        description: `Added deal "${data.name}"`,
      })

      router.push(`/deals/${newDeal.id}`)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Basic Info */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-4 pb-2 border-b border-surface-100">
          Basic Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Company / Deal name"
              placeholder="e.g. Launchpad Analytics"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              placeholder="What does this company do? Why is it interesting?"
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
          <Input
            label="Website"
            placeholder="https://example.com"
            type="url"
            error={errors.website_url?.message}
            {...register('website_url')}
          />
          <Select
            label="Industry"
            options={[
              { value: '', label: 'Select industry' },
              ...INDUSTRIES.map((i) => ({ value: i, label: i })),
            ]}
            error={errors.industry?.message}
            {...register('industry')}
          />
          <Select
            label="Acquisition type"
            options={[
              { value: '', label: 'Select type' },
              ...ACQUISITION_TYPES.map((t) => ({ value: t, label: t })),
            ]}
            error={errors.acquisition_type?.message}
            {...register('acquisition_type')}
          />
          <Select
            label="Source"
            options={[
              { value: '', label: 'Select source' },
              ...SOURCES.map((s) => ({ value: s, label: s })),
            ]}
            error={errors.source?.message}
            {...register('source')}
          />
        </div>
      </section>

      {/* Pipeline Status */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-4 pb-2 border-b border-surface-100">
          Pipeline Status
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Select
            label="Stage"
            options={DEAL_STAGES.map((s) => ({ value: s, label: stageLabel(s) }))}
            error={errors.stage?.message}
            {...register('stage')}
          />
          <Select
            label="Priority"
            options={DEAL_PRIORITIES.map((p) => ({
              value: p,
              label: priorityLabel(p),
            }))}
            error={errors.priority?.message}
            {...register('priority')}
          />
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'archived', label: 'Archived' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>
      </section>

      {/* Financials */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-4 pb-2 border-b border-surface-100">
          Financials
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Estimated value ($)"
            placeholder="e.g. 350000"
            type="number"
            min={0}
            error={errors.estimated_value?.message}
            {...register('estimated_value', { valueAsNumber: true })}
          />
        </div>
      </section>

      {/* Scoring */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-1 pb-2 border-b border-surface-100">
          Scoring
        </h2>
        <p className="text-xs text-surface-500 mb-4">
          Score each dimension 0–100. Final score = (Potential × 40%) + (Traction × 40%) + ((100 − Risk) × 20%)
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="Potential score (0–100)"
            placeholder="e.g. 80"
            type="number"
            min={0}
            max={100}
            error={errors.potential_score?.message}
            {...register('potential_score', { valueAsNumber: true })}
          />
          <Input
            label="Traction score (0–100)"
            placeholder="e.g. 70"
            type="number"
            min={0}
            max={100}
            error={errors.traction_score?.message}
            {...register('traction_score', { valueAsNumber: true })}
          />
          <Input
            label="Risk score (0–100)"
            placeholder="e.g. 30"
            type="number"
            min={0}
            max={100}
            hint="Higher = riskier"
            error={errors.risk_score?.message}
            {...register('risk_score', { valueAsNumber: true })}
          />
        </div>
      </section>

      {/* Internal notes summary */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-4 pb-2 border-b border-surface-100">
          Internal Summary
        </h2>
        <Textarea
          label="Notes summary"
          placeholder="Quick internal summary of this opportunity..."
          rows={3}
          error={errors.notes_summary?.message}
          {...register('notes_summary')}
        />
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} size="md">
          {isEdit ? 'Save changes' : 'Create deal'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
