import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | CreemKit",
    default: "Auth | CreemKit",
  },
  description: "Authentication pages for your CreemKit workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
