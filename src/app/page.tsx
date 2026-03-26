import { Demo } from "@/components/demo";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Next.js + Supabase + Creem</h1>
        <p className="mt-2 text-sm text-muted-foreground">Starter template — coming soon</p>
      </div>
      <Demo />
    </div>
  )
}
