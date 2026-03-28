import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'
import { SettingsForm } from '@/components/settings/settings-form'
import type { Profile } from '@/types'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences."
      />

      <div className="space-y-5">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <SettingsForm profile={profile as Profile | null} userEmail={user!.email ?? ''} />
        </Card>

        {/* Account info */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-surface-100">
              <div>
                <p className="text-sm font-medium text-surface-900">Email address</p>
                <p className="text-xs text-surface-500">{user?.email}</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium ring-1 ring-emerald-200/60">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-surface-900">Member since</p>
                <p className="text-xs text-surface-500">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger zone */}
        <Card>
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
          </CardHeader>
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">Delete account</p>
            <p className="text-xs text-red-600 mt-0.5">
              Contact support to delete your account and all associated data. This action is permanent.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
