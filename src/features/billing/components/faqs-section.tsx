'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'

export function FaqsSection() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'What do I get with this starter?',
      answer:
        'This is demo only but you get a production-ready Next.js app with Supabase authentication, Creem payment integration, a credits system, and a fully styled landing page - all pre-wired so you can start building your SaaS immediately.',
    },
    {
      id: 'item-2',
      question: 'How does the credits system work?',
      answer:
        'Credits and billing here are example logic. In the template, credits are tracked in Supabase and can be consumed per action; you can customize the rules and pricing.',
    },
    {
      id: 'item-3',
      question: 'Can I switch plans later?',
      answer:
        'Yes in this demo, but this is placeholder policy. Update plan names, billing-cycle behavior, and rollover rules to match your product.',
    },
    {
      id: 'item-4',
      question: 'Is there a free trial for paid plans?',
      answer:
        'The free-tier/trial message here is sample content, not a live pricing offer. Replace it with your real trial and pricing terms.',
    },
    {
      id: 'item-5',
      question: 'How do I deploy this to production?',
      answer:
        'Click the "Deploy with Vercel" button in the README, set your environment variables (Supabase and Creem keys), create your products in Creem, and you\'re live. Plan for 15–30 minutes the first time.',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-semibold text-foreground">FAQs</h2>
            <p className="mt-4 text-lg text-balance text-muted-foreground">
              Your questions answered
            </p>
            <p className="mt-6 hidden text-muted-foreground md:block">
              Can&apos;t find what you&apos;re looking for? Contact our{' '}
              <Link href="#" className="font-medium text-primary hover:underline">
                customer support team
              </Link>
            </p>
          </div>

          <div className="md:col-span-3">
            <Accordion>
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-6 text-muted-foreground md:hidden">
            Can&apos;t find what you&apos;re looking for? Contact our{' '}
            <Link href="#" className="font-medium text-primary hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
