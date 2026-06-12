"use client";

import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Route,
  Settings,
  Users,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/shared/app-shell";
import { useStore } from "@/lib/store";

export default function LeverandorLayout({ children }: { children: React.ReactNode }) {
  const { workOrders } = useStore();
  const newOrders = workOrders.filter((w) => w.status === "Ny").length;

  const nav: NavItem[] = [
    { label: "Dashboard", href: "/leverandor", icon: LayoutDashboard },
    { label: "Arbeidsordre", href: "/leverandor/arbeidsordre", icon: ClipboardList, badge: newOrders },
    { label: "Kalender", href: "/leverandor/kalender", icon: CalendarDays },
    { label: "Ruteplan", href: "/leverandor/ruteplan", icon: Route },
    { label: "Meldinger", href: "/leverandor/meldinger", icon: MessageSquare },
    { label: "Dokumenter", href: "/leverandor/dokumenter", icon: FileText },
    { label: "Team", href: "/leverandor/team", icon: Users },
    { label: "Rapporter", href: "/leverandor/rapporter", icon: BarChart3 },
    { label: "Innstillinger", href: "/leverandor/innstillinger", icon: Settings },
  ];

  return (
    <AppShell
      portal="leverandor"
      navItems={nav}
      portalLabel="Leverandørportal"
      userName="Thomas Bakke"
      orgName="Bare Rør AS"
    >
      {children}
    </AppShell>
  );
}
