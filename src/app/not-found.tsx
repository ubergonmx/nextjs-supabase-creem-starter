import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-4 max-w-sm text-center text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button className="mt-8" render={<Link href="/" />} nativeButton={false}>
        Back to home
      </Button>
    </div>
  )
}
