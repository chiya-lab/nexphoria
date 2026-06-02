"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminAffiliates from "@/components/admin/PprAdminAffiliates";

export default function AdminAffiliatesPage() {
  return (
    <PprAdminShell title="Affiliates" subtitle="Applicants, active partners, payouts, and fraud signals — demo only">
      <PprAdminAffiliates />
    </PprAdminShell>
  );
}
