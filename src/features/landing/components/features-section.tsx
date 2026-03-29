import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  IconArrowUp,
  IconCalendarCheck,
  IconWorld,
  IconPlayerPlay,
  IconPlus,
  IconSignature,
  IconShieldLock,
  IconCreditCard,
} from '@tabler/icons-react'

const MESCHAC_AVATAR = 'https://avatars.githubusercontent.com/u/47919550?v=4'
const BERNARD_AVATAR = 'https://avatars.githubusercontent.com/u/31113941?v=4'
const THEO_AVATAR = 'https://avatars.githubusercontent.com/u/68236786?v=4'
const GLODIE_AVATAR = 'https://avatars.githubusercontent.com/u/99137927?v=4'

export default function FeaturesSection() {
  return (
    <section style={{ contentVisibility: 'auto' }}>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="max-w-2xl text-4xl font-semibold text-balance text-foreground">
              Everything you need to launch and scale your SaaS
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="soft" className="overflow-hidden p-6">
              <IconShieldLock className="size-5 text-primary" stroke={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                Auth &amp; User Management
              </h3>
              <p className="mt-3 text-balance text-muted-foreground">
                Supabase-powered authentication with email, OAuth, and role-based access — ready out
                of the box.
              </p>

              <MeetingIllustration />
            </Card>

            <Card variant="soft" className="group overflow-hidden px-6 pt-6">
              <IconCreditCard className="size-5 text-primary" stroke={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                Payments &amp; Subscriptions
              </h3>
              <p className="mt-3 text-balance text-muted-foreground">
                Creem integration with checkout, webhooks, and subscription lifecycle fully wired up.
              </p>

              <CodeReviewIllustration />
            </Card>
            <Card variant="soft" className="group overflow-hidden px-6 pt-6">
              <IconCalendarCheck className="size-5 text-primary" stroke={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                Credits &amp; Usage Tracking
              </h3>
              <p className="mt-3 text-balance text-muted-foreground">
                Built-in credits system with purchase, consumption, and balance tracking for
                usage-based billing.
              </p>

              <div className="-mx-2 -mt-2 mask-b-from-50 px-2 pt-2">
                <AIAssistantIllustration />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

const MeetingIllustration = () => {
  return (
    <Card aria-hidden className="mt-9 aspect-video p-4">
      <div className="relative hidden h-fit">
        <div className="absolute bottom-1.5 -left-1.5 rounded-md border-t border-red-700 bg-red-500 px-1 py-px text-[10px] font-medium text-white shadow-md shadow-red-500/35">
          PDF
        </div>
        <div className="h-10 w-8 rounded-md border bg-gradient-to-b from-zinc-100 to-zinc-200"></div>
      </div>
      <div className="mb-0.5 text-sm font-semibold">AI Strategy Meeting</div>
      <div className="mb-4 flex gap-2 text-sm">
        <span className="text-muted-foreground">2:30 - 3:45 PM</span>
      </div>
      <div className="mb-2 flex -space-x-1.5">
        <div className="flex -space-x-1.5">
          {[
            { src: MESCHAC_AVATAR, alt: 'Méschac Irung' },
            { src: BERNARD_AVATAR, alt: 'Bernard Ngandu' },
            { src: THEO_AVATAR, alt: 'Théo Balick' },
            { src: GLODIE_AVATAR, alt: 'Glodie Lukose' },
          ].map((avatar, index) => (
            <div
              key={index}
              className="size-7 rounded-full border bg-background p-0.5 shadow shadow-zinc-950/5"
            >
              <Image
                className="aspect-square rounded-full object-cover"
                src={avatar.src}
                alt={avatar.alt}
                height={460}
                width={460}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm font-medium text-muted-foreground">ML Pipeline Discussion</div>
    </Card>
  )
}

const CodeReviewIllustration = () => {
  return (
    <div aria-hidden className="relative mt-6">
      <Card className="aspect-video w-4/5 translate-y-4 p-3 transition-transform duration-200 ease-in-out group-hover:-rotate-3">
        <div className="mb-3 flex items-center gap-2">
          <div className="size-6 rounded-full border bg-background p-0.5 shadow shadow-zinc-950/5">
            <Image
              className="aspect-square rounded-full object-cover"
              src={MESCHAC_AVATAR}
              alt="M Irung"
              height={460}
              width={460}
              unoptimized
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Méschac Irung</span>

          <span className="text-xs text-muted-foreground/75">2m</span>
        </div>

        <div className="ml-8 space-y-2">
          <div className="h-2 rounded-full bg-foreground/10"></div>
          <div className="h-2 w-3/5 rounded-full bg-foreground/10"></div>
          <div className="h-2 w-1/2 rounded-full bg-foreground/10"></div>
        </div>

        <IconSignature className="mt-3 ml-8 size-5" stroke={1.5} />
      </Card>
      <Card className="absolute -top-4 right-0 flex aspect-3/5 w-2/5 translate-y-4 p-2 transition-transform duration-200 ease-in-out group-hover:rotate-3">
        <div className="m-auto flex size-10 rounded-full bg-foreground/5">
          <IconPlayerPlay className="m-auto size-4 fill-foreground/50 stroke-foreground/50" />
        </div>
      </Card>
    </div>
  )
}

const AIAssistantIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-6 aspect-video translate-y-4 p-4 pb-6 transition-transform duration-200 group-hover:translate-y-0"
    >
      <div className="w-fit">
        <IconCalendarCheck className="size-3.5 text-purple-400" stroke={1.5} />
        <p className="mt-2 line-clamp-2 text-sm">
          How can I optimize my neural network to reduce inference time while maintaining accuracy?
        </p>
      </div>
      <div className="-mx-3 mt-3 -mb-3 space-y-3 rounded-lg bg-foreground/5 p-3">
        <div className="text-sm text-muted-foreground">Ask AI Assistant</div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <IconPlus size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <IconWorld size={14} />
            </Button>
          </div>

          <Button size="icon" className="size-7 rounded-2xl bg-black">
            <IconArrowUp size={14} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
