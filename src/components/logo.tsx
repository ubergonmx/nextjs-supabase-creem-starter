import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Light mode icon (blue) */}
      <svg
        fill="none"
        height="24"
        viewBox="0 0 40 48"
        width="20"
        className="dark:hidden"
        aria-hidden="true"
      >
        <g fill="#2563eb" transform="translate(40, 0) scale(-1, 1)">
          <path d="m32 26c0 5.5228-4.4772 10-10 10s-10-4.4772-10-10h-8c0 9.9411 8.0589 18 18 18s18-8.0589 18-18-8.0589-18-18-18v8c5.5228 0 10 4.4772 10 10z" />
          <path d="m10 4c0 5.52285-4.47715 10-10 10v8c9.94113 0 18-8.0589 18-18z" opacity=".5" />
        </g>
      </svg>
      {/* Dark mode icon (white) */}
      <svg
        fill="none"
        height="24"
        viewBox="0 0 40 48"
        width="20"
        className="hidden dark:block"
        aria-hidden="true"
      >
        <g fill="#fff" transform="translate(40, 0) scale(-1, 1)">
          <path d="m32 26c0 5.5228-4.4772 10-10 10s-10-4.4772-10-10h-8c0 9.9411 8.0589 18 18 18s18-8.0589 18-18-8.0589-18-18-18v8c5.5228 0 10 4.4772 10 10z" />
          <path d="m10 4c0 5.52285-4.47715 10-10 10v8c9.94113 0 18-8.0589 18-18z" opacity=".5" />
        </g>
      </svg>
      <span className="font-semibold text-foreground">CreemKit</span>
    </div>
  )
}
