"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminImageBriefs from "@/components/admin/PprAdminImageBriefs";

export default function AdminImageBriefsPage() {
  return (
    <PprAdminShell
      title="Image briefs"
      subtitle="Every image slot with its generation prompt, state, and a placeholder preview — read-only reference"
    >
      <PprAdminImageBriefs />
    </PprAdminShell>
  );
}
