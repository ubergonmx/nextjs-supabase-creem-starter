'use client';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useUser } from '@/features/auth/hooks/use-user';

const menuItems = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/pricing' },
];

export const navLinks = menuItems.map((item) => ({
  label: item.name,
  href: item.href,
}));

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const { user, loading } = useUser();

  const close = () => setMenuState(false);

  return (
    <header>
      {/* Backdrop — outside nav so it covers full page */}
      <AnimatePresence>
        {menuState && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-10 bg-background/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <nav style={{ viewTransitionName: 'site-header' }} className="fixed z-20 w-full border-b bg-background/50 backdrop-blur-[20px] transition-colors duration-150">
        <div className="mx-auto max-w-5xl px-6 transition-all duration-300">
          <div className="flex items-center justify-between py-4 lg:py-5">
            {/* Logo + Desktop nav grouped left */}
            <div className="flex items-center gap-8">
              <Link href="/" aria-label="home" transitionTypes={['same-layout']} className="flex items-center">
                <Logo />
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 lg:flex">
              <ul className="hidden gap-8 text-base lg:flex">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      transitionTypes={item.href.includes('#') ? undefined : ['same-layout']}
                      className="block font-medium text-muted-foreground duration-150 hover:text-accent-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* divider */}
              <div className="mx-3 hidden h-6 w-px bg-muted lg:block"></div>

              {!loading && (
                <>
                  {user ? (
                    <Button size="default" render={<Link href="/dashboard" />} nativeButton={false}>
                      <span>Dashboard</span>
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="default"
                        render={<Link href="/login" />}
                        nativeButton={false}
                      >
                        <span>Login</span>
                      </Button>
                      <Button size="default" render={<Link href="/signup" />} nativeButton={false}>
                        <span>Sign Up</span>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? 'Close Menu' : 'Open Menu'}
              className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
            >
              <IconMenu2
                className={cn(
                  'size-6 transition-all duration-200',
                  menuState ? 'scale-0 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100',
                )}
              />
              <IconX
                className={cn(
                  'absolute inset-0 m-auto size-6 transition-all duration-200',
                  menuState ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-180 opacity-0',
                )}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {menuState && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="border-t bg-background/95 backdrop-blur-xl lg:hidden"
            >
              <div className="mx-auto max-w-5xl px-6 pt-6 pb-8">
                {/* Nav links staggered */}
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.07 * (index + 1),
                        ease: 'easeOut',
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={close}
                        transitionTypes={item.href.includes('#') ? undefined : ['same-layout']}
                        className="block rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.2, ease: 'easeOut' }}
                  className="mt-6 flex flex-col gap-2.5"
                >
                  {!loading && (
                    <>
                      {user ? (
                        <Button
                          className="w-full"
                          render={<Link href="/dashboard" onClick={close} />}
                          nativeButton={false}
                        >
                          Dashboard
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="w-full"
                            render={<Link href="/login" onClick={close} />}
                            nativeButton={false}
                          >
                            Login
                          </Button>
                          <Button
                            className="w-full"
                            render={<Link href="/signup" onClick={close} />}
                            nativeButton={false}
                          >
                            Sign Up
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
