import { MobileShell } from "@/components/shared/mobile-shell";

export default function BeboerLayout({ children }: { children: React.ReactNode }) {
  return <MobileShell>{children}</MobileShell>;
}
