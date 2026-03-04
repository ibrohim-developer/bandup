import Link from '@/components/no-prefetch-link'
import { getCurrentUser, getToken } from '@/lib/strapi/server'
import { find } from '@/lib/strapi/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { History, Headphones, BookOpen, PenTool, ExternalLink } from 'lucide-react'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function HistoryPage() {
  const token = await getToken()
  const user = token ? await getCurrentUser() : null

  let attempts: any[] | null = null

  if (user) {
    attempts = await find('test-attempts', {
      filters: {
        user: { id: { $eq: user.id } },
      },
      sort: ['createdAt:desc'],
      fields: ['module_type', 'band_score', 'status', 'createdAt'],
      pagination: { pageSize: 50 },
    }, token!)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <History className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Test History</h1>
            <p className="text-muted-foreground">View all your past test attempts</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Attempts</CardTitle>
          <CardDescription>Your complete test history</CardDescription>
        </CardHeader>
        <CardContent>
          {attempts && attempts.length > 0 ? (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div
                  key={attempt.documentId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      attempt.module_type === 'listening' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      attempt.module_type === 'reading' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {attempt.module_type === 'listening' && <Headphones className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                      {attempt.module_type === 'reading' && <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      {attempt.module_type === 'writing' && <PenTool className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium capitalize">{attempt.module_type} Test</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-14 sm:pl-0">
                    <div className="sm:text-right">
                      {attempt.status === 'completed' && attempt.band_score && (
                        <p className="text-2xl font-bold">{attempt.band_score}</p>
                      )}
                      <Badge variant={attempt.status === 'completed' ? 'default' : 'secondary'}>
                        {attempt.status}
                      </Badge>
                    </div>
                    {attempt.status === 'completed' && (
                      <Link href={`/dashboard/results/${attempt.documentId}`}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No test history yet</p>
              <p className="mb-4">Start practicing to see your progress here</p>
              <Link href="/dashboard">
                <Button>Take Your First Test</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
