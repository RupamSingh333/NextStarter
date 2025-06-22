'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Pagination from '../tables/Pagination';
import PageLoader from '../ui/loading/PageLoader';
import { toast } from 'react-hot-toast';
import { useModal } from '@/hooks/useModal';
import { UserPermissionGuard } from '@/components/common/PermissionGuard';
import UnauthorizedComponent from '@/components/common/UnauthorizedComponent';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

interface DecimalValue {
  $numberDecimal: string;
}

interface Payment {
  _id: string;
  screen_shot: string;
}

interface Customer {
  _id: string;
  customer: string;
  phone: string;
  fore_closure: string;
  settlement: DecimalValue;
  minimum_part_payment: DecimalValue;
  foreclosure_reward: DecimalValue;
  settlement_reward: DecimalValue;
  minimum_part_payment_reward: DecimalValue;
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
  payments: Payment[];
  lender_name: string;
}

interface Filters {
  customer: string;
  phone: string;
  lender: string;
}

interface PaymentStatusOption {
  id: number;
  name: string;
}

const BASE_PAGE_SIZES = [10, 25, 50, 100, 500, 1000];
const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
  { id: -1, name: 'All' },
  { id: 1, name: 'Paid' },
  { id: 0, name: 'Unpaid' },
  { id: 3, name: 'Logged In' },
];

const CustomerTable: React.FC = () => {
  // State management
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]); // Store all fetched customers
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const [filters, setFilters] = useState<Filters>({
    customer: '',
    phone: '',
    lender: '',
  });
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Modal state
  const { isOpen, openModal, closeModal } = useModal();
  const [statusType, setStatusType] = useState("1");
  const [selectedID, setSelectedId] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced filters
  const debouncedFilters = useDebounce(filters, 300); // Reduced delay for better responsiveness

  // Get page size options based on total records
  const getPageSizeOptions = useCallback(() => {
    if (totalRecords === 0) return [10];
    const filtered = BASE_PAGE_SIZES.filter(size => size < totalRecords);
    if (!filtered.includes(totalRecords)) {
      filtered.push(totalRecords);
    }
    return [...new Set(filtered)].sort((a, b) => a - b);
  }, [totalRecords]);

  const pageSizeOptions = getPageSizeOptions();

  // Fetch customers data
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/customers/list?perPage=1000`, // Fetch larger initial dataset
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if (data.success) {
        setAllCustomers(data.data);
        setTotalRecords(data.totalRecords);
        setTotalPages(Math.ceil(data.totalRecords / 1000)); // Initial pagination based on fetch
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
  }, []);

  // Filter customers client-side
  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers];

    // Apply status filter
    if (selectedStatus !== -1) {
      result = result.filter(customer =>
        selectedStatus === 1 ? customer.isPaid :
          selectedStatus === 0 ? !customer.isPaid :
            selectedStatus === 3 ? customer.isLogin : true
      );
    }

    // Apply text filters
    if (debouncedFilters.customer) {
      result = result.filter(customer =>
        customer.customer.toLowerCase().includes(debouncedFilters.customer.toLowerCase())
      );
    }
    if (debouncedFilters.phone) {
      result = result.filter(customer =>
        customer.phone.includes(debouncedFilters.phone)
      );
    }

    if (debouncedFilters.lender) {
      result = result.filter(customer =>
        customer.lender_name?.toLowerCase().includes(debouncedFilters.lender.toLowerCase()) || false
      );
    }

    return result;
  }, [allCustomers, selectedStatus, debouncedFilters]);

  // Update paginated list
  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setCustomerList(filteredCustomers.slice(start, end));
    setTotalPages(Math.ceil(filteredCustomers.length / pageSize));
    setTotalRecords(filteredCustomers.length);
  }, [currentPage, pageSize, filteredCustomers]);

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      customer: '',
      phone: '',
      lender: '',
    });
    setSelectedStatus(-1);
    setCurrentPage(1);
  };

  // Handle payment type update
  const handleSubmit = async () => {
    if (!selectedID) return;

    setIsSubmitting(true);
    closeModal();

    try {
      const response = await fetch("/api/admin/customers/update-payment-type", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedID,
          payment_type: statusType,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update payment type");
      }

      toast.success("Payment type updated successfully");
      fetchCustomers(); // Refetch to update the cached data
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update payment type");
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleDownloadExcel = () => {
    // Prepare data for Excel
    const data = customerList.map((cust, idx) => ({
      'Sr. No.': (currentPage - 1) * pageSize + idx + 1,
      'Customer': cust.customer,
      'Phone': cust.phone,
      'Fore Closure': Number(cust.fore_closure),
      'Settlement': Number(cust.settlement.$numberDecimal),
      'Min. Part Payment': Number(cust.minimum_part_payment.$numberDecimal),
      'Foreclosure Reward': Number(cust.foreclosure_reward.$numberDecimal),
      'Settlement Reward': Number(cust.settlement_reward.$numberDecimal),
      'Min. Part Payment Reward': Number(cust.minimum_part_payment_reward.$numberDecimal),
      'Status': cust.isPaid ? 'Paid' : 'Pending',
      'Lender': cust?.lender_name || "N/A",
    }));
    // Create sheet
    const ws = XLSX.utils.json_to_sheet(data);
    // Add header row manually for bold/freeze/filter
    const header = [
      'Sr. No.',
      'Customer',
      'Phone',
      'Fore Closure',
      'Settlement',
      'Min. Part Payment',
      'Foreclosure Reward',
      'Settlement Reward',
      'Min. Part Payment Reward',
      'Status',
      'Lender',
    ];
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: 'A1' });
    // Style header row: bold, dark text, neutral background
    header.forEach((_, idx) => {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: idx })];
      if (cell) cell.s = {
        font: { bold: true, color: { rgb: '1E293B' } }, // Tailwind slate-800
        fill: { fgColor: { rgb: 'E5E7EB' } }, // Tailwind slate-200
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    });
    // Freeze header row (for both Excel and Google Sheets compatibility)
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    ws['!panes'] = [{ ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' }];
    // Add autofilter to header row
    ws['!autofilter'] = { ref: `A1:K${data.length + 2}` };
    // Set column widths
    ws['!cols'] = [
      { wch: 8 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 10 }
    ];
    // Add totals row
    const totalRow = [
      '', 'Total', '',
      data.reduce((sum, d) => sum + (d['Fore Closure'] || 0), 0),
      data.reduce((sum, d) => sum + (d['Settlement'] || 0), 0),
      data.reduce((sum, d) => sum + (d['Min. Part Payment'] || 0), 0),
      data.reduce((sum, d) => sum + (d['Foreclosure Reward'] || 0), 0),
      data.reduce((sum, d) => sum + (d['Settlement Reward'] || 0), 0),
      data.reduce((sum, d) => sum + (d['Min. Part Payment Reward'] || 0), 0),
      '',
    ];
    XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: -1 });
    // Style totals row: bold, light neutral background
    const totalRowIdx = data.length + 1;
    for (let c = 0; c < header.length; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r: totalRowIdx, c })];
      if (cell) cell.s = {
        font: { bold: true, color: { rgb: '1E293B' } },
        fill: { fgColor: { rgb: 'F1F5F9' } }, // Tailwind slate-100
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }
    // Name file with date/time
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const fileName = `customers_list_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}-${pad(now.getMilliseconds())}.xlsx`;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, fileName);
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

      {/* Main Filters Section */}
      <div className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 min-w-[150px] ">
            <label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
              Page Size:
            </label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-2 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
              Payment Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
            >
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Filter Panel Button */}
          <a
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="inline-flex items-center px-5 py-3 justify-center gap-1 rounded-full font-medium text-sm bg-blue-light-500/15 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500 cursor-pointer"
          >
            <FiFilter className="w-4 h-4" />
            {showFilterPanel ? 'Hide Filters' : 'Advanced Filters'}
            {showFilterPanel ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </a>
          <a
            onClick={resetFilters}
            className="inline-flex items-center px-5 py-3 justify-center gap-1 rounded-full font-medium text-sm bg-blue-light-500/15 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500 cursor-pointer"
          >
            <FiX className="w-4 h-4" />
            Reset Filters
          </a>
        </div>

        {/* Excel Download Button */}
        <a
          onClick={handleDownloadExcel}
          className="inline-flex items-center px-5 py-3 justify-center gap-1 rounded-full font-medium text-sm bg-blue-light-500/15 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500 cursor-pointer"
        >
          Download
        </a>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-white/[0.05]">
              {/* Customer Search */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-white">
                  Customer:
                </label>
                <input
                  type="text"
                  name="customer"
                  value={filters.customer}
                  onChange={handleFilterChange}
                  className="w-full py-2 px-3 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Search customers"
                />
              </div>

              {/* Phone Search */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-white">
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={filters.phone}
                  onChange={handleFilterChange}
                  className="w-full py-2 px-3 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Search phone"
                />
              </div>



              {/* Lender Search */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-white">
                  Lender:
                </label>
                <input
                  type="text"
                  name="lender"
                  value={filters.lender}
                  onChange={handleFilterChange}
                  className="w-full py-2 px-3 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Search lender"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[700px] md:min-w-[1100px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Sr. No.
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Customer / Phone
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">
                  Lender
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
              {customerList.map((cust, index) => (
                <TableRow key={cust._id}>
                  <TableCell className="px-5 py-1 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-1 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    <span className="inline-flex items-center gap-1 mt-1">
                      {cust.customer}
                    </span>
                    <br />
                    <span className="inline-flex items-center gap-1 mt-1">
                      {cust.phone}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-1 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    {cust?.lender_name || "N/A"}
                  </TableCell>
                  <TableCell className="px-5 py-1 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.fore_closure}
                    <br />
                    <Badge size="sm" color='success'>
                      ₹{cust.foreclosure_reward.$numberDecimal}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-1 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.settlement.$numberDecimal}
                    <br />
                    <Badge size="sm" color='success'>
                      ₹{cust.settlement_reward.$numberDecimal}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-1 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                    ₹{cust.minimum_part_payment.$numberDecimal}
                    <br />
                    <Badge size="sm" color='success'>
                      ₹{cust.minimum_part_payment_reward.$numberDecimal}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-1 text-start text-theme-sm">
                    <Badge size="sm" color={cust.isPaid ? 'success' : 'warning'}>
                      {cust.isPaid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-1 text-start">
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
                    <TableCell className="px-5 py-1 text-start space-x-2 flex items-center gap-2">
                      {(cust.isPaid === false && cust.payments.length > 0) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(cust._id);
                            openModal();
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

      {/* Pagination */}
      <div className="flex justify-between items-center px-5 py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalRecords}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Payment Type Update Modal */}
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
          <option value="1">FORECLOSURE</option>
          <option value="2">SETTLEMENT</option>
          <option value="3">PART PAYMENT</option>
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
};

export default CustomerTable;