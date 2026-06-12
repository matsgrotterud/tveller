"use client";

import {
  Activity,
  Building2,
  CreditCard,
  Flag,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  Plug,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/shared/app-shell";

const nav: NavItem[] = [
  { label: "SaaS-oversikt", href: "/admin", icon: LayoutDashboard },
  { label: "Kunder", href: "/admin/kunder", icon: Building2 },
  { label: "Prosjekter", href: "/admin/prosjekter", icon: Globe },
  { label: "Brukere", href: "/admin/brukere", icon: Users },
  { label: "Fakturering", href: "/admin/fakturering", icon: Receipt },
  { label: "Abonnement", href: "/admin/abonnement", icon: CreditCard },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
  { label: "GDPR-senter", href: "/admin/gdpr", icon: ShieldCheck },
  { label: "Feature flags", href: "/admin/feature-flags", icon: Flag },
  { label: "Markedsplass", href: "/admin/markedsplass", icon: ShoppingBag },
  { label: "Integrasjoner", href: "/admin/integrasjoner", icon: Plug },
  { label: "Systemstatus", href: "/admin/systemstatus", icon: Activity },
  { label: "Audit log", href: "/admin/audit", icon: ScrollText },
  { label: "Innstillinger", href: "/admin/innstillinger", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell portal="admin" navItems={nav} portalLabel="TvellerOS Superadmin" userName="Mats Tveller" orgName="Tveller AS">
      {children}
    </AppShell>
  );
}
