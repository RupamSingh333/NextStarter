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
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Pagination from '../tables/Pagination';
import PageLoader from '../ui/loading/PageLoader';
import { toast } from 'react-hot-toast';
import { useModal } from "@/hooks/useModal";


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
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState(-1); // -1: All
  const paymentStatus = [
    { id: -1, name: 'All' },
    { id: 1, name: 'Paid' },
    { id: 0, name: 'Unpaid' },
    { id: 3, name: 'Logged In' },
    // { id: 2, name: 'Not Logged In' },
  ];
  const basePageSizes = [10, 25, 50, 100, 500];

  const getPageSizeOptions = () => {
    if (totalRecords === 0) return [10];
    const filtered = basePageSizes.filter((size) => size < totalRecords);
    if (!filtered.includes(totalRecords)) {
      filtered.push(totalRecords);
    }
    return [...new Set(filtered)].sort((a, b) => a - b);
  };

  const pageSizeOptions = getPageSizeOptions();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);

  const fetchCustomers = async (page: number, size: number, status: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/customers/list?page=${page}&perPage=${size}&filter=${status}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (data.success) {
        setCustomerList(data.data);
        setTotalRecords(data.totalRecords);
        setTotalPages(Math.ceil(data.totalRecords / size));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, pageSize, selectedStatus);
  }, [currentPage, pageSize, selectedStatus]);

  const { isOpen, openModal, closeModal } = useModal();
  const [statusType, setStatusType] = useState("1");
  const [selectedID, setSelectedId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    closeModal(); // Start loading

    const updatePromise: Promise<string> = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/admin/customers/update-payment-type", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: selectedID,
            payment_type: statusType,
          }),
        });

        const data = await response.json().catch(() => ({})); // handle invalid JSON
        // console.log("Update response:", data);
        
        if (!data.success) {
          // Always resolve with an error message to be handled by toast
          return reject(data.message || "Something went wrong while updating payment type.");
        }

        resolve("Payment type updated successfully");
      } catch {
        // Catch all network or unexpected errors
        reject("Unable to connect to the server. Please try again.");
      }
    });

    toast.promise(updatePromise, {
      loading: "Updating payment type...",
      success: (msg: string) => msg,
      error: (err) => err,
    });

    try {
      await updatePromise;
      closeModal(); // Close modal after success
      fetchCustomers(currentPage, pageSize, selectedStatus); // Refresh list
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleExcelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setExcelFile(event.target.files[0]);
    } else {
      setExcelFile(null);
    }
  };

  const handleUploadExcel = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file to upload.");
      return;
    }

    setIsUploadingExcel(true);
    const formData = new FormData();
    formData.append("file", excelFile);

    const uploadPromise: Promise<string> = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/admin/customers/uploadCustomers", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          return reject(data.message || "Failed to upload Excel file.");
        }

        resolve(data.message || "Excel file uploaded successfully.");
      } catch (error) {
        console.error("Excel upload error:", error);
        reject("Network error or unable to connect to server.");
      }
    });

    toast.promise(uploadPromise, {
      loading: "Uploading Excel file...",
      success: (msg) => {
        fetchCustomers(currentPage, pageSize, selectedStatus); // Refresh customer list
        setExcelFile(null); // Clear selected file
        return msg;
      },
      error: (err) => err,
    }).finally(() => {
      setIsUploadingExcel(false);
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-sm">
          <PageLoader />
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex justify-between items-center p-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white ">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to page 1
            }}
            className="border border-gray-300 bg-white dark:bg-gray-800 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                {size} / page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white">Payment Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(Number(e.target.value));
              setCurrentPage(1); // Reset to page 1
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {paymentStatus.map((status) => (
              <option key={status.id} value={status.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                {status.name}
              </option>
            ))}
          </select>
        </div>
        {/* New Excel Upload Section */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelFileChange}
            className="hidden"
            id="excel-upload-input"
          />
          <Button
            size="sm"
            variant="primary"
            onClick={() => document.getElementById('excel-upload-input')?.click()}
            disabled={isUploadingExcel}
          >
            {isUploadingExcel ? "Uploading..." : "Upload Customers (Excel)"}
          </Button>
          {excelFile && <span className="text-sm text-gray-600 dark:text-gray-300">{excelFile.name}</span>}
          {excelFile && !isUploadingExcel && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleUploadExcel}
              disabled={isUploadingExcel}
            >
              Confirm Upload
            </Button>
          )}
        </div>
      </div>

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
                    {(cust.isPaid === false && cust.payments.length > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(cust._id); // Set customer ID
                          openModal(); // Open modal
                        }}
                        className="focus:outline-none"
                      >
                        <Badge size="sm" color={cust.isActive ? 'success' : 'error'}>
                          {cust.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </button>
                    )}
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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px] p-5 lg:p-8">
        <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
          Update Status
        </h4>
        <Label>Select Payment Type</Label>
        <select
          className="form-control w-full mt-2 border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={statusType}
          onChange={(e) => setStatusType(e.target.value)}
        >
          <option value="1" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">FORECLOSURE</option>
          <option value="2" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">SETTLEMENT</option>
          <option value="3" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">PART PAYMENT</option>
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>

      </Modal>

    </div>
  );
}