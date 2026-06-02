"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminCustomersTable from "@/components/admin/PprAdminCustomersTable";

export default function AdminCustomersPage() {
  return (
    <PprAdminShell title="Customers" subtitle="Roster with lifetime value, tier, RUO verification, and tags">
      <PprAdminCustomersTable />
    </PprAdminShell>
  );
}
