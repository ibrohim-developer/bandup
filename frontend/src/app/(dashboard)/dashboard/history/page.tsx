import Link from '@/components/no-prefetch-link'
import { getCurrentUser } from '@/lib/strapi/server'
import { find } from '@/lib/strapi/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { History, Headphones, BookOpen, PenTool, Mic, ExternalLink } from 'lucide-react'

/* eslint-disable @typescript-eslint/no-explicit-any */

const MODULE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; text: string; historyHref: string; resultHref: (id: string) => string }> = {
  listening: {
    icon: <Headphones className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-600 dark:text-blue-400',
    historyHref: '/dashboard/listening/history',
    resultHref: (id) => `/dashboard/results/${id}`,
  },
  reading: {
    icon: <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-600 dark:text-purple-400',
    historyHref: '/dashboard/reading/history',
    resultHref: (id) => `/dashboard/results/${id}`,
  },
  writing: {
    icon: <PenTool className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-600 dark:text-orange-400',
    historyHref: '/dashboard/writing/history',
    resultHref: (id) => `/dashboard/results/${id}`,
  },
  speaking: {
    icon: <Mic className="w-5 h-5 text-pink-600 dark:text-pink-400" />,
    bg: 'bg-pink-50 dark:bg-pink-950',
    text: 'text-pink-600 dark:text-pink-400',
    historyHref: '/dashboard/speaking/history',
    resultHref: (id) => `/dashboard/speaking/result/${id}`,
  },
}

export default async function HistoryPage() {
  const user = await getCurrentUser()

  let attempts: any[] = []

  if (user) {
    attempts = await find('test-attempts', {
      filters: {
        user: { id: { $eq: user.id } },
        status: { $eq: 'completed' },
      },
      sort: ['createdAt:desc'],
      fields: ['module_type', 'band_score', 'raw_score', 'status', 'createdAt'],
      pagination: { pageSize: 50 },
    })
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
          <History className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Test History</h1>
          <p className="text-muted-foreground">All your completed test attempts</p>
        </div>
      </div>

      {/* All attempts list */}
      {attempts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-2xl">
          <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No test history yet</p>
          <p className="mb-6 text-sm">Start practicing to see your progress here</p>
          <Link href="/dashboard">
            <Button>Take Your First Test</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 bg-muted/40 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            <span />
            <span>Module</span>
            <span className="text-right">Score</span>
            <span />
          </div>
          <div className="divide-y">
            {attempts.map((attempt) => {
              const cfg = MODULE_CONFIG[attempt.module_type]
              if (!cfg) return null
              const score = attempt.band_score ?? attempt.raw_score
              return (
                <div
                  key={attempt.documentId}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <p className="font-medium capitalize text-sm">{attempt.module_type}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(attempt.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    {score != null ? (
                      <span className={`text-xl font-bold ${cfg.text}`}>{score}</span>
                    ) : (
                      <Badge variant="secondary">—</Badge>
                    )}
                  </div>
                  <Link href={cfg.resultHref(attempt.documentId)}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
