"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminReports from "@/components/admin/PprAdminReports";

export default function AdminReportsPage() {
  return (
    <PprAdminShell title="Reports" subtitle="Export operational datasets as CSV — generated client-side from demo data">
      <PprAdminReports />
    </PprAdminShell>
  );
}
