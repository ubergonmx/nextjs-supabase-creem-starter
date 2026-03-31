import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center', className)}>
      {/* Light mode */}
      <svg
        fill="none"
        height="28"
        viewBox="0 0 220 48"
        width="128"
        xmlns="http://www.w3.org/2000/svg"
        className="dark:hidden"
        aria-label="CreemKit"
      >
        <g fill="#2563eb" transform="translate(40, 0) scale(-1, 1)">
          <path d="m32 26c0 5.5228-4.4772 10-10 10s-10-4.4772-10-10h-8c0 9.9411 8.0589 18 18 18s18-8.0589 18-18-8.0589-18-18-18v8c5.5228 0 10 4.4772 10 10z" />
          <path d="m10 4c0 5.52285-4.47715 10-10 10v8c9.94113 0 18-8.0589 18-18z" opacity=".5" />
        </g>
        <text
          x="50"
          y="38"
          fill="#0a0a0a"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
          fontSize="36"
          fontWeight="600"
          letterSpacing="-0.5"
        >
          CreemKit
        </text>
      </svg>

      {/* Dark mode */}
      <svg
        fill="none"
        height="28"
        viewBox="0 0 220 48"
        width="128"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden dark:block"
        aria-label="CreemKit"
      >
        <g fill="#fff" transform="translate(40, 0) scale(-1, 1)">
          <path d="m32 26c0 5.5228-4.4772 10-10 10s-10-4.4772-10-10h-8c0 9.9411 8.0589 18 18 18s18-8.0589 18-18-8.0589-18-18-18v8c5.5228 0 10 4.4772 10 10z" />
          <path d="m10 4c0 5.52285-4.47715 10-10 10v8c9.94113 0 18-8.0589 18-18z" opacity=".5" />
        </g>
        <text
          x="50"
          y="38"
          fill="#fff"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
          fontSize="36"
          fontWeight="600"
          letterSpacing="-0.5"
        >
          CreemKit
        </text>
      </svg>
    </div>
  );
};
