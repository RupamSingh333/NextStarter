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

        const promise = fetch(`/api/admin/users/update/${editUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: editUserId,
                ...formData,
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

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-sm">
                    <PageLoader />
                </div>
            )}

            <div className="flex justify-between items-center p-4 gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Page Size:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>
                </div>

                <Button onClick={() => {
                    handleCreateClick();
                }}>
                    + Create User
                </Button>
            </div>

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
                                        <Button size="sm" onClick={() => handleEditClick(user)}>Edit</Button>
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
                        className="border p-2 rounded"
                    />

                    <Label>Email</Label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border p-2 rounded"
                    />

                    <Label>Password</Label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="border p-2 rounded"
                    />

                    <Label>Status</Label>
                    <select
                        value={formData.isActive ? 'active' : 'inactive'}
                        onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.value === 'active' })
                        }
                        className="border p-2 rounded"
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
                        className="border p-2 rounded"
                    />

                    <Label>Email</Label>
                    <input
                        type="email"
                        value={createformData.email}
                        onChange={(e) => setCreateFormData({ ...createformData, email: e.target.value })}
                        className="border p-2 rounded"
                    />

                    <Label>Password</Label>
                    <input
                        type="password"
                        value={createformData.password}
                        onChange={(e) => setCreateFormData({ ...createformData, password: e.target.value })}
                        className="border p-2 rounded"
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
