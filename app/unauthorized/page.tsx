'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => router.push('/')}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Sign in with a different account
          </Button>
        </div>
      </div>
    </div>
  )
}
