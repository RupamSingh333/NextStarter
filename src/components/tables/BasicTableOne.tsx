'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Button from '../ui/button/Button';
import Pagination from '../tables/Pagination';
import PageLoader from '../ui/loading/PageLoader';


interface Customer {
  _id: string;
  customer: string;
  phone: string;
  fore_closure: string;
  settlement: { $numberDecimal: string };
  minimum_part_payment: { $numberDecimal: string };
  foreclosure_reward: { $numberDecimal: string };
  settlement_reward: { $numberDecimal: string };
  minimum_part_payment_reward: { $numberDecimal: string };
  payment_type: number;
  isPaid: boolean;
  payment_url: string;
  isLogin: boolean;
  last_login: string;
  otp: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  payments: {
    _id: string;
    screen_shot: string;
  }[];
}

export default function BasicTableOne() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  const fetchCustomers = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/customers/list?page=${page}&limit=${pageSize}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setCustomerList(data.data);
        setTotalRecords(data.totalRecords);
        setTotalPages(Math.ceil(data.totalRecords / pageSize));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-sm">
          <PageLoader />
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[700px] md:min-w-[1100px]">

          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {/* New Sr. No. header */}
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Sr. No.
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Customer
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Phone
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Foreclosure
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Settlement
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Min. Part Payment
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Rewards
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Screenshots
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {!loading && customerList.map((cust, index) => (
                <TableRow key={cust._id}>
                  {/* New Sr. No. cell */}
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {cust.customer}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    {cust.phone}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.fore_closure}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.settlement.$numberDecimal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.minimum_part_payment.$numberDecimal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-600 dark:text-gray-400">
                    <div className="space-y-1">
                      <div>Foreclosure: ₹{cust.foreclosure_reward.$numberDecimal}</div>
                      <div>Settlement: ₹{cust.settlement_reward.$numberDecimal}</div>
                      <div>Min Part: ₹{cust.minimum_part_payment_reward.$numberDecimal}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    <Badge size="sm" color={cust.isPaid ? 'success' : 'warning'}>
                      {cust.isPaid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex flex-wrap gap-2">
                      {cust.payments.map((p) => (
                        <a
                          key={p._id}
                          href={p.screen_shot}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={p.screen_shot}
                            alt="Screenshot"
                            width={40}
                            height={40}
                            className="rounded border border-gray-300"
                          />
                        </a>
                      ))}
                    </div>
                  </TableCell>
                  {/* Action cell: keep Edit and Delete buttons, replace Activate/Deactivate button with label */}
                  <TableCell className="px-5 py-4 text-start space-x-2 flex items-center gap-2">
                    <Button size="sm" variant="primary">Edit</Button>
                    <Button size="sm" variant="outline">Delete</Button>
                    <Badge size="sm" color={cust.isActive ? 'success' : 'error'}>
                      {cust.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination outside scroll container so always visible */}
      <div className="flex justify-between items-center px-5 py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalRecords}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}