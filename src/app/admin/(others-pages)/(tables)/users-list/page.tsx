import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersListTable from "@/components/tables/UsersListTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Users List | RepayKaro - Dashboard",
  description:
    "This is Users List page for RepayKaro Admin Dashboard",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users List" />
      <div className="space-y-6">
        <ComponentCard title="Users List">
          <UsersListTable />
        </ComponentCard>
      </div>
    </div>
  );
}
