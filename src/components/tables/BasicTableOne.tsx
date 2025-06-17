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
import { PhoneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { UserPermissionGuard } from '@/components/common/PermissionGuard';
import UnauthorizedComponent from '@/components/common/UnauthorizedComponent';

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
  const [isAuthorized, setIsAuthorized] = useState(true);

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
        setTotalRecords(data.totalRecords || data.data.length);
        const calculatedTotalPages = Math.ceil((data.totalRecords || data.data.length) / size);
        setTotalPages(calculatedTotalPages);
        setIsAuthorized(true);
      } else if (data.isAuthorized === false) {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
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

  if (!isAuthorized) {
    return <UnauthorizedComponent />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-sm">
          <PageLoader />
        </div>
      )}

      {/* Improved Header Section */}
      <div className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4 border-b border-gray-200 dark:border-white/[0.05]">
        {/* Left Section - Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 min-w-[150px]">
            <label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">Page Size:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                setCurrentPage(1); // Reset to first page when changing page size
                fetchCustomers(1, newSize, selectedStatus); // Fetch with new page size
              }}
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Selector */}
          <div className="flex items-center gap-2 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">Payment Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                const newStatus = Number(e.target.value);
                setSelectedStatus(newStatus);
                setCurrentPage(1); // Reset to first page when changing status
                fetchCustomers(1, pageSize, newStatus); // Fetch with new status
              }}
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              {paymentStatus.map((status) => (
                <option key={status.id} value={status.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>


        <UserPermissionGuard action="update">
          {/* Right Section - Excel Upload */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 dark:bg-gray-800/50  rounded-lg">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelFileChange}
                className="hidden"
                id="excel-upload-input"
              />
              <button
                onClick={() => document.getElementById('excel-upload-input')?.click()}
                disabled={isUploadingExcel}
                className="inline-flex items-center px-2.5 py-2 justify-center gap-1 rounded-full font-medium text-sm bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 cursor-pointer"
              >
                {isUploadingExcel ? "Uploading..." : "Upload Customers"}<svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.2502 4.99951C9.2502 4.5853 9.58599 4.24951 10.0002 4.24951C10.4144 4.24951 10.7502 4.5853 10.7502 4.99951V9.24971H15.0006C15.4148 9.24971 15.7506 9.5855 15.7506 9.99971C15.7506 10.4139 15.4148 10.7497 15.0006 10.7497H10.7502V15.0001C10.7502 15.4143 10.4144 15.7501 10.0002 15.7501C9.58599 15.7501 9.2502 15.4143 9.2502 15.0001V10.7497H5C4.58579 10.7497 4.25 10.4139 4.25 9.99971C4.25 9.5855 4.58579 9.24971 5 9.24971H9.2502V4.99951Z" fill=""></path></svg>
              </button>


            </div>

            {excelFile && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                  {excelFile.name}
                </span>
                {!isUploadingExcel && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUploadExcel}
                    disabled={isUploadingExcel}
                    className="whitespace-nowrap"
                  >
                    Confirm Upload
                  </Button>
                )}
              </div>
            )}
          </div>
        </UserPermissionGuard>
        
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
                  Foreclosure
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Settlement
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Min. Part Payment
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
                    <span className="inline-flex items-center gap-1 mt-1">
                      <UserCircleIcon className="w-5 h-5" /> &nbsp;
                      {cust.customer}
                    </span>

                    <br />
                    <span className="inline-flex items-center gap-1 mt-1">
                      <PhoneIcon className="w-4 h-4" /> &nbsp;
                      {cust.phone}
                    </span>
                  </TableCell>


                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.fore_closure}
                    <br></br><Badge size="sm" color='success'>
                      ₹{cust.foreclosure_reward.$numberDecimal}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.settlement.$numberDecimal}
                    <br></br><Badge size="sm" color='success'>
                      ₹{cust.settlement_reward.$numberDecimal}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.minimum_part_payment.$numberDecimal}<br></br><Badge size="sm" color='success'>
                      ₹{cust.minimum_part_payment_reward.$numberDecimal}
                    </Badge>
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

                  <UserPermissionGuard action="update">
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
                  </UserPermissionGuard>

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
          onPageChange={(page) => {
            setCurrentPage(page);
            fetchCustomers(page, pageSize, selectedStatus);
          }}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px] p-5 lg:p-8">
        <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
          Update Status
        </h4>
        <Label>Select Payment Type</Label>
        <select
          className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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