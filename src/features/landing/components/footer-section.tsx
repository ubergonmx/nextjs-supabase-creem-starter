'use client';

import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const links = [
  {
    title: 'Product',
    items: [
      { label: 'Features', href: '/#features' },
      { label: 'Solution', href: '#' },
      { label: 'Customers', href: '#' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
];

const socials = [
  {
    label: 'X (Twitter)',
    href: '#',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-5"
      >
        <path
          fill="currentColor"
          d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
        />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-5"
      >
        <path
          fill="currentColor"
          d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2zm2-3a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2"
        />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-5"
      >
        <path
          fill="currentColor"
          d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
        />
      </svg>
    ),
  },
  {
    label: 'Threads',
    href: '#',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-5"
      >
        <path
          fill="currentColor"
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5a2.89 2.89 0 0 1-2.89-2.89a2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05a6.34 6.34 0 0 0-6.34 6.34a6.34 6.34 0 0 0 6.34 6.34a6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"
        />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-5"
      >
        <path
          fill="currentColor"
          d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
        />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ubergonmx/nextjs-supabase-creem-starter',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-5"
      >
        <path
          fill="currentColor"
          d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.726-4.042-1.61-4.042-1.61c-.546-1.387-1.333-1.757-1.333-1.757c-1.089-.744.084-.729.084-.729c1.205.085 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.418-1.305.762-1.605c-2.665-.305-5.467-1.332-5.467-5.931c0-1.31.468-2.381 1.236-3.221c-.124-.304-.535-1.527.117-3.176c0 0 1.008-.322 3.301 1.23A11.49 11.49 0 0 1 12 6.844c1.018.005 2.042.138 3.003.404c2.291-1.552 3.297-1.23 3.297-1.23c.654 1.649.243 2.872.119 3.176c.77.84 1.233 1.911 1.233 3.221c0 4.61-2.807 5.623-5.479 5.921c.43.372.815 1.103.815 2.222c0 1.605-.015 2.898-.015 3.293c0 .321.216.694.825.576C20.565 21.795 24 17.297 24 12C24 5.373 18.627 0 12 0"
        />
      </svg>
    ),
  },
];

export function FooterSection() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="border-t bg-muted/40 pt-16 pb-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label="go home" transitionTypes={['same-layout']}>
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A production-ready Next.js starter — ship your SaaS in days, not months.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-xs text-muted-foreground">Theme</span>
              <div className="flex rounded-md border">
                {(
                  [
                    { value: 'light', Icon: IconSun, label: 'Light' },
                    { value: 'dark', Icon: IconMoon, label: 'Dark' },
                    { value: 'system', Icon: IconDeviceDesktop, label: 'System' },
                  ] as const
                ).map(({ value, Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    title={label}
                    onClick={() => setTheme(value)}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center transition-colors first:rounded-l-sm last:rounded-r-sm',
                      theme === value
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-8">
            {links.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground duration-150 hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CreemKit, All rights reserved
          </span>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-muted-foreground duration-150 hover:text-foreground"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
