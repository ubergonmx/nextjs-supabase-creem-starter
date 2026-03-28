import { Card } from '@/components/ui/card'
import { CreditCard, Database, KeyRound, Layout } from 'lucide-react'

export function FeaturesSection() {
    return (
        <section id="features">
            <div className="py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground max-w-2xl text-balance text-4xl font-semibold">Everything you need to ship a SaaS</h2>
                    </div>
                    <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card
                            variant="soft"
                            className="overflow-hidden p-6">
                            <KeyRound className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">Supabase Auth</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Email + OAuth login, session management, and protected routes via middleware — all pre-configured and ready to use.</p>
                        </Card>

                        <Card
                            variant="soft"
                            className="group overflow-hidden px-6 pt-6">
                            <CreditCard className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">Creem Payments</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Subscription billing, one-time purchases, and webhook handling pre-wired so you can start monetizing from day one.</p>
                        </Card>

                        <Card
                            variant="soft"
                            className="group overflow-hidden px-6 pt-6">
                            <Database className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">Credits System</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Atomic balance operations, a transaction ledger, and race-condition-safe deductions built on Supabase RLS.</p>
                        </Card>

                        <Card
                            variant="soft"
                            className="overflow-hidden p-6 md:col-span-2 lg:col-span-1">
                            <Layout className="text-primary size-5" />
                            <h3 className="text-foreground mt-5 text-lg font-semibold">Feature-Based Architecture</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Co-located domain logic, self-documenting folder structure, and a clear pattern that is easy to extend as your product grows.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
