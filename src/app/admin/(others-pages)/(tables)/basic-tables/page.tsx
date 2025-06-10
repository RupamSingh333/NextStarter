import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Customers List | RepayKaro - Dashboard",
  description:
    "This is Customers List page for RepayKaro Admin Dashboard",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Customers List" />
      <div className="space-y-6">
        <ComponentCard title="Customers List">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
