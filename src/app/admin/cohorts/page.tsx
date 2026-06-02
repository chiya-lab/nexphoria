"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminCohorts from "@/components/admin/PprAdminCohorts";

export default function AdminCohortsPage() {
  return (
    <PprAdminShell title="Cohorts" subtitle="Week-by-week retention by signup cohort">
      <PprAdminCohorts />
    </PprAdminShell>
  );
}
