import Link from '@/components/no-prefetch-link'
import { getCurrentUser } from '@/lib/strapi/server'
import { find } from '@/lib/strapi/api'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ModuleConfig {
  type: 'listening' | 'reading' | 'writing' | 'speaking'
  label: string
  Icon: LucideIcon
  bgLight: string
  bgDark: string
  textLight: string
  textDark: string
  resultHref: (attemptId: string) => string
  backHref: string
}

export async function ModuleHistory({ module }: { module: ModuleConfig }) {
  const user = await getCurrentUser()

  let attempts: any[] = []

  if (user) {
    attempts = await find('test-attempts', {
      filters: {
        user: { id: { $eq: user.id } },
        module_type: { $eq: module.type },
        status: { $eq: 'completed' },
      },
      sort: ['createdAt:desc'],
      fields: ['band_score', 'raw_score', 'status', 'createdAt', 'time_spent_seconds'],
      populate: ['test'],
      pagination: { pageSize: 100 },
    })
  }

  const { Icon, bgLight, bgDark, textLight, textDark, label } = module

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${bgLight} ${bgDark} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${textLight} ${textDark}`} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{label} History</h1>
          <p className="text-muted-foreground">All your past {label.toLowerCase()} attempts</p>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-2xl">
          <Icon className={`w-12 h-12 mx-auto mb-4 opacity-30 ${textLight} ${textDark}`} />
          <p className="text-lg font-medium">No {label.toLowerCase()} attempts yet</p>
          <p className="mb-6 text-sm">Complete a test to see it here</p>
          <Link href={module.backHref}>
            <Button>Start a {label} Test</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                <th className="text-left px-5 py-3">Test</th>
                <th className="text-right px-5 py-3">Duration</th>
                <th className="text-right px-5 py-3">Score</th>
                <th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attempts.map((attempt) => {
                const score = attempt.band_score ?? attempt.raw_score
                const title = attempt.test?.title ?? `${label} Test`
                return (
                  <tr key={attempt.documentId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(attempt.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4 text-right text-muted-foreground whitespace-nowrap">
                      {attempt.time_spent_seconds ? formatTime(attempt.time_spent_seconds) : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {score != null ? (
                        <span className={`text-xl font-bold ${textLight} ${textDark}`}>{score}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={module.resultHref(attempt.documentId)}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
