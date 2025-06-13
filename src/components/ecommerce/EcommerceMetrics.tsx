"use client";

import React, { useEffect, useState } from "react";
// import Badge from "../ui/badge/Badge";
import {
  // ArrowDownIcon,
  // ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "@/icons";

interface DashboardData {
  users: {
    activeUserCount: number;
    inActiveUserCount: number;
    userCount: number;
  };
  customers: {
    customerCount: number;
    piadCustomerCount: number;
    unPaidCustomerCount: number;
    fullPaymentTypeCustomerCount: number;
    settlementPaymentTypeCustomerCount: number;
    partialPaymentTypeCustomerCount: number;
  };
  payments: {
    foreClosureSum: string;
    paidForeClosureSum: string;
    settlementSum: string;
    paidSettlementSum: string;
    partialSum: string;
    paidPartialSum: string;
  };
}

export const EcommerceMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-40"
          ></div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { customers, users, payments } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {/* Merged Users */}
      <MetricCard
        title="Users"
        value={users.userCount}
        badgeColor="success"
        badgeChange="+0.00%"
        icon={<GroupIcon className="text-blue-600 size-6 dark:text-blue-300" />}
        subValues={[
          { label: "Active", value: users.activeUserCount, color: "green" },
          { label: "Inactive", value: users.inActiveUserCount, color: "red" },
        ]}
      />

      {/* Customers */}
      <MetricCard
        title="Customers"
        value={customers.customerCount}
        badgeColor="success"
        badgeChange="+11.01%"
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        subValues={[
          { label: "Paid", value: customers.piadCustomerCount, color: "green" },
          { label: "Unpaid", value: customers.unPaidCustomerCount, color: "red" },
        ]}
      />

      {/* Total Paid Amount */}
      <MetricCard
        title="Total Paid"
        value={
          parseFloat(payments.paidForeClosureSum) +
          parseFloat(payments.paidSettlementSum) +
          parseFloat(payments.paidPartialSum)
        }
        prefix="₹"
        badgeColor="success"
        badgeChange="+3.14%"
        icon={<BoxIconLine className="text-yellow-600 size-6 dark:text-yellow-400" />}
        subValues={[
          { label: "Foreclosure", value: parseFloat(payments.paidForeClosureSum) },
          { label: "Settlement", value: parseFloat(payments.paidSettlementSum) },
          { label: "Partial", value: parseFloat(payments.paidPartialSum) },
        ]}
      />

      {/* Foreclosure Payment */}
      <MetricCard
        title="Foreclosure Payment"
        value={parseFloat(payments.foreClosureSum)}
        prefix="₹"
        badgeColor="success"
        badgeChange="+2.10%"
        icon={<BoxIconLine className="text-purple-600 size-6 dark:text-purple-400" />}
        subValues={[
          {
            label: "Paid",
            value: parseFloat(payments.paidForeClosureSum),
            color: "green",
          },
          {
            label: "Pending",
            value: parseFloat(payments.foreClosureSum) - parseFloat(payments.paidForeClosureSum),
            color: "red",
          },
        ]}
      />

      {/* Settlement Payment */}
      <MetricCard
        title="Settlement Payment"
        value={parseFloat(payments.settlementSum)}
        prefix="₹"
        badgeColor="success"
        badgeChange="+1.75%"
        icon={<BoxIconLine className="text-cyan-600 size-6 dark:text-cyan-400" />}
        subValues={[
          {
            label: "Paid",
            value: parseFloat(payments.paidSettlementSum),
            color: "green",
          },
          {
            label: "Pending",
            value: parseFloat(payments.settlementSum) - parseFloat(payments.paidSettlementSum),
            color: "red",
          },
        ]}
      />

      {/* Partial Payment */}
      <MetricCard
        title="Partial Payment"
        value={parseFloat(payments.partialSum)}
        prefix="₹"
        badgeColor="success"
        badgeChange="+1.20%"
        icon={<BoxIconLine className="text-orange-600 size-6 dark:text-orange-400" />}
        subValues={[
          {
            label: "Paid",
            value: parseFloat(payments.paidPartialSum),
            color: "green",
          },
          {
            label: "Pending",
            value: parseFloat(payments.partialSum) - parseFloat(payments.paidPartialSum),
            color: "red",
          },
        ]}
      />

    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  badgeChange: string;
  badgeColor: "success" | "error";
  icon: React.ReactNode;
  subValues?: {
    label: string;
    value: number;
    color?: string;
  }[];
}

const MetricCard = ({
  title,
  value,
  prefix = "",
  badgeChange,
  badgeColor,
  icon,
  subValues = [],
}: MetricCardProps) => {
  const isNegative = badgeColor === "error";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
          </h4>
        </div>

        {/* <Badge color={badgeColor}>
          {isNegative ? <ArrowDownIcon /> : <ArrowUpIcon />}
          {badgeChange}
        </Badge> */}
      </div>

      {subValues.length > 0 && (
        <div className="mt-4 space-y-1">
          {subValues.map((sub) => (
            <div key={sub.label} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{sub.label}</span>
              <span
                className={`font-semibold ${sub.color === "green"
                    ? "text-green-600"
                    : sub.color === "red"
                      ? "text-red-500"
                      : "text-gray-800 dark:text-white"
                  }`}
              >
                {typeof sub.value === "number" ? sub.value.toLocaleString() : sub.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
