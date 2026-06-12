"use client";

import {
  BarChart3,
  Building2,
  CalendarDays,
  FileText,
  HardHat,
  Home,
  KanbanSquare,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  Plug,
  Scale,
  Settings,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/shared/app-shell";
import { useStore } from "@/lib/store";

export default function UtbyggerLayout({ children }: { children: React.ReactNode }) {
  const { claims } = useStore();
  const newClaims = claims.filter((c) => c.status === "Sendt inn" || c.status === "Mottatt").length;

  const nav: NavItem[] = [
    { label: "Dashboard", href: "/utbygger", icon: LayoutDashboard },
    { label: "Reklamasjoner", href: "/utbygger/reklamasjoner", icon: Wrench, badge: newClaims },
    { label: "Kanban", href: "/utbygger/reklamasjoner/kanban", icon: KanbanSquare },
    { label: "Prosjekter", href: "/utbygger/prosjekter", icon: Building2 },
    { label: "Boenheter", href: "/utbygger/boenheter", icon: Home },
    { label: "Kalender", href: "/utbygger/kalender", icon: CalendarDays },
    { label: "Meldinger", href: "/utbygger/meldinger", icon: MessageSquare },
    { label: "Dokumenter / FDV", href: "/utbygger/dokumenter", icon: FileText },
    { label: "Underleverandører", href: "/utbygger/underleverandorer", icon: HardHat },
    { label: "Statistikk", href: "/utbygger/statistikk", icon: BarChart3 },
    { label: "Tilvalg", href: "/utbygger/tilvalg", icon: Sparkles },
    { label: "Overtakelse", href: "/utbygger/overtakelse", icon: KeyRound },
    { label: "Sameie", href: "/utbygger/sameie", icon: Users },
    { label: "Juridisk", href: "/utbygger/juridisk", icon: Scale },
    { label: "Integrasjoner", href: "/utbygger/integrasjoner", icon: Plug },
    { label: "Innstillinger", href: "/utbygger/innstillinger", icon: Settings },
  ];

  return (
    <AppShell
      portal="utbygger"
      navItems={nav}
      portalLabel="Utbyggerportal"
      userName="Kari Nordheim"
      orgName="Nordheim Bolig AS"
      showProjectSwitcher
    >
      {children}
    </AppShell>
  );
}
