"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminKpiGrid from "@/components/admin/PprAdminKpiGrid";
import PprAdminRevenueChart from "@/components/admin/PprAdminRevenueChart";
import PprAdminFunnel from "@/components/admin/PprAdminFunnel";

export default function AdminOverviewPage() {
  return (
    <PprAdminShell title="Overview" subtitle="Storefront performance at a glance — synthetic demo data">
      <PprAdminKpiGrid />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <PprAdminRevenueChart />
        <PprAdminFunnel />
      </div>
    </PprAdminShell>
  );
}
