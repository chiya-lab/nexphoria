"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminCoaQueue from "@/components/admin/PprAdminCoaQueue";

export default function AdminCoaPage() {
  return (
    <PprAdminShell title="CoA queue" subtitle="Review and action pending Certificate of Analysis approvals — demo only">
      <PprAdminCoaQueue />
    </PprAdminShell>
  );
}
