"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRelative } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/permissions";
import { TENANTS, USERS } from "@/lib/seed";

export default function AdminBrukerePage() {
  const [query, setQuery] = useState("");

  const adminUsers = USERS.filter((u) => u.role !== "beboer")
    .filter((u) => !query || `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Brukere</h1>
        <p className="text-sm text-muted-foreground">
          Administrative brukere på tvers av kunder. Beboere vises ikke (dataminimering).
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input placeholder="Søk på navn eller e-post …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i brukere" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead>Kunde</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sist innlogget</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminUsers.map((u) => {
            const tenant = TENANTS.find((t) => t.id === u.tenant_id);
            return (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell className="text-muted-foreground">{tenant?.name ?? "Tveller AS"}</TableCell>
                <TableCell><Badge className="bg-fjord-50 text-fjord-700">{ROLE_LABEL[u.role]}</Badge></TableCell>
                <TableCell>
                  <Badge className={u.status === "active" ? "bg-evergreen-50 text-evergreen-700" : "bg-amber-50 text-amber-800"}>
                    {u.status === "active" ? "Aktiv" : "Invitert"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.last_login_at ? formatRelative(u.last_login_at) : "Aldri"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
