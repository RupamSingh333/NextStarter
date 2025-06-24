'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useDebounce } from '@/hooks/useDebounce';
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
import { FiFilter, FiChevronDown, FiChevronUp,FiDownload } from 'react-icons/fi';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';

interface DecimalValue {
  $numberDecimal: string;
  lender: string;
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

const BASE_PAGE_SIZES = [10, 25, 50, 100];
const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
  { id: -1, name: 'All' },
  { id: 1, name: 'Paid' },
  { id: 0, name: 'Unpaid' },
  { id: 3, name: 'Logged In' },
];

const CustomerTable: React.FC = () => {
  // State management
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]); // Store last API result
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const [filters, setFilters] = useState<Filters>({
    customer: '',
    phone: '',
    lender: '',
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    customer: '',
    phone: '',
    lender: '',
  });
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modal state
  const { isOpen, openModal, closeModal } = useModal();
  const [statusType, setStatusType] = useState("1");
  const [selectedID, setSelectedId] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get page size options based on total records
  // const getPageSizeOptions = useCallback(() => {
  //   if (totalRecords === 0) return [10, 25, 50, 100];
  //   const filtered = BASE_PAGE_SIZES.filter(size => size < totalRecords);
  //   if (totalRecords > 0 && !filtered.includes(totalRecords)) {
  //     filtered.push(totalRecords);
  //   }
  //   return [...new Set([10, 25, 50, 100, ...filtered])].sort((a, b) => a - b);
  // }, [totalRecords]);

  // const pageSizeOptions = getPageSizeOptions();
  const pageSizeOptions = BASE_PAGE_SIZES;

  // Fetch customers data (server-side)
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        perPage: pageSize.toString(),
        page: currentPage.toString(),
        status: selectedStatus.toString(),
        customer: appliedFilters.customer,
        phone: appliedFilters.phone,
        lender: appliedFilters.lender,
      });

      const response = await fetch(
        `/api/admin/customers/list?${params.toString()}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if (data.success) {
        setAllCustomers(data.data);
        setCustomerList(data.data);
        setTotalRecords(data.totalRecords);
        // setTotalPages(data.totalPages);
        setIsAuthorized(true);
      } else if (data.isAuthorized === false) {
        setIsAuthorized(false);
        setCustomerList([]);
        setAllCustomers([]);
        setTotalRecords(0);
      } else {
        setCustomerList([]);
        setAllCustomers([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
      setCustomerList([]);
      setAllCustomers([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, appliedFilters]);

  // Initial fetch and fetch on dependency change
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Client-side filter logic (remove client-side pagination)
  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers];
    if (filters.customer) {
      result = result.filter(customer =>
        customer.customer.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }
    if (filters.phone) {
      result = result.filter(customer =>
        customer.phone.includes(filters.phone)
      );
    }
    if (filters.lender) {
      result = result.filter(customer =>
        customer.lender_name?.toLowerCase().includes(filters.lender.toLowerCase()) || false
      );
    }
    return result;
  }, [allCustomers, filters]);

  // Instead, set customerList directly from API response
  useEffect(() => {
    setCustomerList(filteredCustomers);
  }, [filteredCustomers]);

  // On page change, call API (already handled by fetchCustomers useEffect)
  // When filters/search are applied, always start from page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters, selectedStatus, pageSize]);

  // Handle filter changes (client-side filtering only)
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
  };

  const resetFilters = () => {
    setFilters({
      customer: '',
      phone: '',
      lender: '',
    });
    setAppliedFilters({
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
      fetchCustomers(); // Refetch to update the list
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update payment type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateExcel = (data: Customer[], fileNamePrefix: string) => {
    // Prepare data for Excel
    const excelData = data.map((cust, idx) => ({
      'Sr. No.': idx + 1,
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
    const ws = XLSX.utils.json_to_sheet(excelData);

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
    ws['!autofilter'] = { ref: `A1:K${excelData.length + 2}` };

    // Set column widths
    ws['!cols'] = [
      { wch: 8 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 10 }
    ];

    // Add totals row
    const totalRow = [
      '', 'Total', '',
      excelData.reduce((sum, d) => sum + (d['Fore Closure'] || 0), 0),
      excelData.reduce((sum, d) => sum + (d['Settlement'] || 0), 0),
      excelData.reduce((sum, d) => sum + (d['Min. Part Payment'] || 0), 0),
      excelData.reduce((sum, d) => sum + (d['Foreclosure Reward'] || 0), 0),
      excelData.reduce((sum, d) => sum + (d['Settlement Reward'] || 0), 0),
      excelData.reduce((sum, d) => sum + (d['Min. Part Payment Reward'] || 0), 0),
      '',
    ];
    XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: -1 });

    // Style totals row: bold, light neutral background
    const totalRowIdx = excelData.length + 1;
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
    const fileName = `${fileNamePrefix}_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}-${pad(now.getMilliseconds())}.xlsx`;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, fileName);
  };

  const handleDownload = async (type: 'all' | 'filtered') => {
    const toastId = toast.loading(`Preparing download...`);
    try {
      const params = new URLSearchParams({
        perPage: '100000', // Fetch all records for download
        page: '1',
      });

      if (type === 'filtered') {
        params.set('status', selectedStatus.toString());
        params.set('customer', appliedFilters.customer);
        params.set('phone', appliedFilters.phone);
        params.set('lender', appliedFilters.lender);
      }

      const response = await fetch(`/api/admin/customers/list?${params.toString()}`, {
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        toast.success('Starting download...', { id: toastId });
        generateExcel(result.data, type === 'all' ? 'all_customers' : 'filtered_customers');
      } else if (result.success && result.data.length === 0) {
        toast.error('No data to download.', { id: toastId });
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred', { id: toastId });
    }
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
        {/* Filters (Page Size, Payment Status) - LEFT */}
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
              className="w-full py-1.5 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-8 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
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
              className="w-full py-1.5 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-8 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
            >
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Action Buttons: Advanced Filter + Download Dropdown (RIGHT) */}
        <div className="flex items-center gap-2">
          {/* Advanced Filter Button */}
          <Button
            size="sm"
            variant="outline"
            className="inline-flex items-center px-4 py-1.5 h-8 rounded-full font-medium text-sm bg-blue-light-500/15 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <FiFilter className="w-4 h-4" />
            {showFilterPanel ? 'Hide Filters' : 'Advanced Filters'}
            {showFilterPanel ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </Button>
          {/* Excel Download Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="dropdown-toggle inline-flex items-center justify-center gap-1 rounded-full font-medium text-sm px-4 py-1.5 h-8 bg-blue-light-500/15 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500"
            >
              <FiDownload className="w-4 h-4" />
              Download
              <FiChevronDown className="w-4 h-4" />
            </Button>
            <Dropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
            >
              <DropdownItem onClick={() => { handleDownload('filtered'); setIsDropdownOpen(false); }}>
                Download Filtered
              </DropdownItem>
              <DropdownItem onClick={() => { handleDownload('all'); setIsDropdownOpen(false); }}>
                Download All
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
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

              {/* Search & Reset Buttons */}
              <div className="flex items-end pt-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="inline-flex items-center px-4 py-1.5 h-8 rounded-full font-medium text-sm bg-blue-light-500/15 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500"
                  onClick={handleSearch}
                  disabled={
                    !filters.customer.trim() &&
                    !filters.phone.trim() &&
                    !filters.lender.trim()
                  }
                >
                  Search
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="inline-flex items-center px-4 py-1.5 h-8 rounded-full font-medium text-sm bg-blue-light-500/15 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
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
              {!loading && customerList.length === 0 ? (
                <TableRow>
                  <td colSpan={9} className="py-10 px-5 text-center text-gray-500 dark:text-gray-400">
                    No results found.<br />
                    <span className="text-xs text-gray-400">Click <b>Search</b> to check the server for more results.</span>
                  </td>
                </TableRow>
              ) : (
                customerList.map((cust, index) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-5 py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalRecords / pageSize)}
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