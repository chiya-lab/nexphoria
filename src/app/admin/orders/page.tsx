"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminOrdersTable from "@/components/admin/PprAdminOrdersTable";

export default function AdminOrdersPage() {
  return (
    <PprAdminShell title="Orders" subtitle="Search, filter, and action orders — demo only">
      <PprAdminOrdersTable />
    </PprAdminShell>
  );
}
