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

interface Permission {
    module: string;
    actions: string[];
    _id?: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    permissions: Permission[];
    __v: number;
}

const PermissionToggle = ({
    module,
    permissions,
    setPermissions
}: {
    module: string;
    permissions: Permission[];
    setPermissions: (permissions: Permission[]) => void;
}) => {
    const availableActions = ['create', 'read', 'update', 'delete'];
    const modulePermissions = permissions.find(p => p.module === module) || { module, actions: [] };

    const toggleAction = (action: string) => {
        const newPermissions = permissions.map(perm =>
            perm.module === module
                ? {
                    module,
                    actions: perm.actions.includes(action)
                        ? perm.actions.filter(a => a !== action)
                        : [...perm.actions, action]
                }
                : perm
        );
        setPermissions(newPermissions);
    };

    const toggleSelectAll = (checked: boolean) => {
        const newPermissions = checked
            ? [
                ...permissions.filter(p => p.module !== module),
                { module, actions: [...availableActions] }
            ]
            : [
                ...permissions.filter(p => p.module !== module),
                { module, actions: [] }
            ];
        setPermissions(newPermissions);
    };

    const allSelected = availableActions.every(action =>
        modulePermissions.actions.includes(action)
    );

    return (
        <div className="border p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{module}</h4>
                <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={allSelected}
                            onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-600">
                        </div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            All
                        </span>
                    </label>
                </div>
            </div>

            <div className="flex flex-row gap-2">
                {availableActions.map(action => (
                    <div key={action} className="flex items-center gap-2">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulePermissions.actions.includes(action)}
                                onChange={() => toggleAction(action)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-600">
                            </div>
                            <span className="ms-3 text-xs font-medium text-gray-900 dark:text-gray-300 capitalize">
                                {action}
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};
const PermissionManager = ({
    permissions,
    setPermissions
}: {
    permissions: Permission[];
    setPermissions: (permissions: Permission[]) => void;
}) => {
    const availableModules = ['User', 'Customer', 'Coupon'];

    // Initialize permissions if empty
    useEffect(() => {
        if (permissions.length === 0) {
            setPermissions(
                availableModules.map(module => ({
                    module,
                    actions: []
                }))
            );
        }
    }, []);

    return (
        <div className="space-y-4">
            {availableModules.map(module => (
                <PermissionToggle
                    key={module}
                    module={module}
                    permissions={permissions}
                    setPermissions={setPermissions}
                />
            ))}
        </div>
    );
};

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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        isActive: true,
        permissions: [] as Permission[]
    });

    const [createformData, setCreateFormData] = useState({
        name: '',
        email: '',
        password: '',
        permissions: [] as Permission[]
    });

    const { isOpen, openModal, closeModal } = useModal();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('basicDetails');

    const tabs = [
        { id: 'basicDetails', label: 'Basic Details' },
        { id: 'permissions', label: 'Permissions' },
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
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            isActive: user.isActive,
            permissions: user.permissions || []
        });
        openModal();
    };

    const handleCreateClick = () => {
        setCreateFormData({
            name: '',
            email: '',
            password: '',
            permissions: []
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = async () => {
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
                permissions: createformData.permissions
            }),
        }).then(async (res) => {
            const result = await res.json();
            if (!res.ok || !result.success) {
                toast.error(result.message);
            }
            return result;
        });

        toast.promise(promise, {
            loading: 'Creating user...',
            success: (res) => res?.success ? 'User created successfully!' : null,
            error: (err) => err.message || 'Creation failed',
        });

        try {
            const result = await promise;
            if (result.success) {
                fetchUsers(currentPage, pageSize);
                setCreateFormData({ name: '', email: '', password: '', permissions: [] });
                setIsCreateModalOpen(false);
            }
        } catch (error) {
            console.error('Create error:', error);
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

        // Create update data without _id in permissions
        const updateData = {
            name: formData.name,
            email: formData.email,
            isActive: formData.isActive,
            permissions: formData.permissions.map(({ _id, ...rest }) => rest) // Remove _id from each permission
        };

        if (formData.password?.trim()) {
            updateData.password = formData.password.trim();
        }

        const promise = fetch(`/api/admin/users/update/${editUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        }).then(async (res) => {
            const result = await res.json();
            if (!res.ok || !result.success) {
                toast.error(result.message);
            }
            return result;
        });

        toast.promise(promise, {
            loading: 'Updating user...',
            success: (res) => res?.success ? 'User updated successfully!' : null,
            error: (err) => err.message || 'Update failed',
        });

        try {
            const result = await promise;
            if (result.success) {
                fetchUsers(currentPage, pageSize);
                closeModal();
            }
        } catch (error) {
            console.error('Update error:', error);
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
                        className="inline-flex items-center px-2.5 py-2 justify-center gap-1 rounded-full font-medium text-sm bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 cursor-pointer p-8"
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

            {/* Edit User Modal */}
            <Modal isOpen={isOpen} onClose={() => { setEditUserId(null); closeModal(); }} className="p-5 lg:p-8">
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
                    Update User: {formData.name}
                </h4>

                <div className="max-w-4xl mx-auto mt-10">
                    <div className="flex rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-theme-xs">
                        {/* Tab Buttons */}
                        <div className="w-1/4 border-r border-gray-300 dark:border-gray-700 p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full mt-4 py-1 pl-3 pr-8 text-sm rounded-lg text-left appearance-none h-10 shadow-theme-xs focus:outline-hidden focus:ring-3 bg-none transition-all ${activeTab === tab.id ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-200 border border-brand-300 dark:border-brand-800' : 'text-gray-800 bg-transparent border border-transparent dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="w-3/4 p-4 text-sm text-gray-700 dark:text-white/90">
                            {activeTab === 'basicDetails' && (
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
                                        placeholder="Leave blank to keep current password"
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
                            )}
                            {activeTab === 'permissions' && (
                                <div className="space-y-4">

                                    <PermissionManager
                                        permissions={formData.permissions}
                                        setPermissions={(perms) => setFormData({ ...formData, permissions: perms })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
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
                className="p-5 lg:p-8"
            >
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
                    Create New User
                </h4>
                <div className="max-w-4xl mx-auto mt-10">
                    <div className="flex rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-theme-xs">
                        {/* Tab Buttons */}
                        <div className="w-1/4 border-r border-gray-300 dark:border-gray-700 p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full mt-4 py-1 pl-3 pr-8 text-sm rounded-lg text-left appearance-none h-10 shadow-theme-xs focus:outline-hidden focus:ring-3 bg-none transition-all ${activeTab === tab.id ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-200 border border-brand-300 dark:border-brand-800' : 'text-gray-800 bg-transparent border border-transparent dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="w-3/4 p-4 text-sm text-gray-700 dark:text-white/90">
                            {activeTab === 'basicDetails' && (
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
                            )}
                            {activeTab === 'permissions' && (
                                <div className="space-y-4">

                                    <PermissionManager
                                        permissions={createformData.permissions}
                                        setPermissions={(perms) => setCreateFormData({ ...createformData, permissions: perms })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
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
                    <Button
                        size="sm"
                        onClick={handleCreateSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}