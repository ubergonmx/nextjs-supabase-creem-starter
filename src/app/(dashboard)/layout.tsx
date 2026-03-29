import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard | CreemKit",
    default: "Dashboard | CreemKit",
  },
  description: "Private dashboard for managing subscriptions, credits, and product data.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
