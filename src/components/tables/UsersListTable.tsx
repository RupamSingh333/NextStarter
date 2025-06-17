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
import Button from '@/components/ui/button/Button';
import Pagination from '../tables/Pagination';
import PageLoader from '../ui/loading/PageLoader';
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import { toast } from 'react-hot-toast';
import { useModal } from "@/hooks/useModal";
import { PencilSquareIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { UserPermissionGuard } from '@/components/common/PermissionGuard';
import UnauthorizedComponent from '@/components/common/UnauthorizedComponent';


interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    __v: number;
}

export default function UsersListTable() {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(true);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', isActive: true });
    const [createformData, setCreateFormData] = useState({ name: '', email: '', password: '' });
    const { isOpen, openModal, closeModal } = useModal();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const fetchUsers = async (page: number, size: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/list?page=${page}&perPage=${size}`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setUserList(data.data);
                setTotalRecords(data.totalRecords);
                setTotalPages(Math.ceil(data.totalRecords / size));
                setIsAuthorized(true);
            } else if (data.isAuthorized === false) {
                setIsAuthorized(false);
            } else {
                toast.error(data.message || 'Failed to load users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching user list');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditUserId(user._id);
        setFormData({ name: user.name, email: user.email, password: '', isActive: user.isActive });
        openModal();
    };

    const handleCreateClick = () => {
        setFormData({ name: '', email: '', password: '', isActive: true });
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = async () => {
        setIsCreateModalOpen(false);
        if (!createformData.name || !createformData.email || !createformData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        const promise = fetch(`/api/admin/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...createformData,
                isActive: true,
            }),
        }).then(async (res) => {
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Create failed');
            return result;
        });

        toast.promise(promise, {
            loading: 'Creating user...',
            success: 'User created successfully',
            error: (err) => err.message || 'Create failed',
        });

        try {
            await promise;
            fetchUsers(currentPage, pageSize);
            setCreateFormData({ name: '', email: '', password: '' });
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Create error:', error);
            // error already handled in toast
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleUpdate = async () => {
        if (!editUserId) return;

        if (!formData.name || !formData.email) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        closeModal();

        const filteredFormData = Object.entries(formData).reduce(
            (acc: Record<string, string | number | boolean>, [key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    acc[key] = value as string | number | boolean;
                }
                return acc;
            },
            {} as Record<string, string | number | boolean>
        );

        const promise = fetch(`/api/admin/users/update/${editUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: editUserId,
                ...filteredFormData,
            }),
        }).then(async (res) => {
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Update failed');
            return result;
        });

        toast.promise(promise, {
            loading: 'Updating user...',
            success: 'User updated successfully',
            error: (err) => err.message || 'Update failed',
        });

        try {
            await promise;
            fetchUsers(currentPage, pageSize);
            closeModal();
        } catch (error) {
            console.error('Update error:', error);
            // error already handled in toast
        } finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        fetchUsers(currentPage, pageSize);
    }, [currentPage, pageSize]);

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

            <UserPermissionGuard action="create">
                <div className="flex justify-between items-center p-4 gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">Page Size:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>


                    <span
                        onClick={handleCreateClick}
                        className="  inline-flex items-center px-2.5 py-2 justify-center gap-1 rounded-full font-medium text-sm bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 cursor-pointer p-8"
                    >
                        <UserPlusIcon className="w-4 h-4" />  Add User
                    </span>

                </div>
            </UserPermissionGuard>
            
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[700px] md:min-w-[900px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Sr. No.</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Email</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Action</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {!loading && userList.map((user, index) => (
                                <TableRow key={user._id}>
                                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400"> {user.name}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">{user.email}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                                        <Badge size="sm" color={user.isActive ? 'success' : 'error'}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                                        <UserPermissionGuard action="update">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                                                title="Edit user"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </button>
                                        </UserPermissionGuard>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-between items-center px-5 py-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalRecords}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <Modal isOpen={isOpen} onClose={() => { setEditUserId(null); closeModal(); }} className="max-w-[400px] p-5 lg:p-8">
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
                    Update User: {formData.name}
                </h4>
                <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    <Label>Email</Label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    <Label>Password</Label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    <Label>Status</Label>
                    <select
                        value={formData.isActive ? 'active' : 'inactive'}
                        onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.value === 'active' })
                        }
                        className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setEditUserId(null);
                            closeModal();
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                </div>
            </Modal>

            {/* Create User Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                className="max-w-[400px] p-5 lg:p-8"
            >
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
                    Create New User
                </h4>
                <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <input
                        type="text"
                        value={createformData.name}
                        onChange={(e) => setCreateFormData({ ...createformData, name: e.target.value })}
                        className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    <Label>Email</Label>
                    <input
                        type="email"
                        value={createformData.email}
                        onChange={(e) => setCreateFormData({ ...createformData, email: e.target.value })}
                        className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    <Label>Password</Label>
                    <input
                        type="password"
                        value={createformData.password}
                        onChange={(e) => setCreateFormData({ ...createformData, password: e.target.value })}
                        className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleCreateSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </Modal>


        </div>
    );
}
