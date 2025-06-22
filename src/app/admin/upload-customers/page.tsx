'use client';
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { toast } from "react-hot-toast";
import UnauthorizedComponent from '@/components/common/UnauthorizedComponent';
import { useAuth } from '@/context/AuthContext';
import PageLoader from "@/components/ui/loading/PageLoader";
import StatusIcon from "@/components/common/Icon";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";


const REQUIRED_HEADERS = [
    'customer',
    'phone',
    'fore_closure',
    'settlement',
    'minimum_part_payment',
    'foreclosure_reward',
    'settlement_reward',
    'minimum_part_payment_reward',
    'payment_url',
    'lender_name'
];

export default function UploadCustomersPage() {
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>("idle");
    const [scanError, setScanError] = useState<string | null>(null);
    const [missingHeaders, setMissingHeaders] = useState<string[]>([]);
    const [apiMessage, setApiMessage] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<boolean | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { admin, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && admin?.permissions) {
            const hasPermission = admin.permissions.some(
                (perm) =>
                    perm.module === "Customer" && perm.actions.includes("create")
            );
            setIsAuthorized(hasPermission);
        }
    }, [admin, isLoading]);

    if (isLoading) return <PageLoader />; // optional loader

    if (!isAuthorized) {
        return <UnauthorizedComponent />;
    }

    // Custom DropZone for Excel files
    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setExcelFile(acceptedFiles[0]);
            setScanStatus('scanning');
            setScanError(null);
            setMissingHeaders([]);
            setApiMessage(null);
            setApiSuccess(null);
            // Wait 2.5 seconds before validating
            setTimeout(() => {
                validateExcelHeaders(acceptedFiles[0]);
            }, 2500);
        }
    };

    // Validate Excel headers
    const validateExcelHeaders = async (file: File) => {
        setScanStatus('scanning');
        setScanError(null);
        setMissingHeaders([]);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headerRow = Array.isArray(json[0]) ? json[0] : json[0] ? Object.values(json[0]) : [];
            const headers = headerRow.map((h: string) => (typeof h === 'string' ? h.trim() : h));
            const missing = REQUIRED_HEADERS.filter(h => !headers.includes(h));
            if (missing.length > 0) {
                setScanStatus('error');
                setMissingHeaders(missing);
                setScanError('Missing required headers: ' + missing.join(', '));
            } else {
                setScanStatus('success');
            }
        } catch {
            setScanStatus('error');
            setScanError('Failed to read Excel file.');
        }
    };

    const handleUpload = async () => {
        if (!excelFile) {
            toast.error("Please select an Excel file to upload.");
            return;
        }
        if (scanStatus !== 'success') {
            toast.error("Please upload a valid Excel file with correct headers.");
            return;
        }
        setIsUploading(true);
        setApiMessage(null);
        setApiSuccess(null);
        const formData = new FormData();
        formData.append("file", excelFile);
        try {
            const response = await fetch("/api/admin/customers/uploadCustomers", {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok || data.success === false) {
                setApiSuccess(false);
                setApiMessage(data.message || "Failed to upload Excel file.");
                // If missingHeaders in response, show them
                if (data.missingHeaders && Array.isArray(data.missingHeaders)) {
                    setMissingHeaders(data.missingHeaders);
                }
                setScanStatus('error');
                setExcelFile(null); // Remove chosen file
            } else {
                setApiSuccess(true);
                setApiMessage(data.message || "Upload successful!");
                setExcelFile(null);
                setScanStatus('idle');
            }
        } catch {
            setApiSuccess(false);
            setApiMessage("Network error or unable to connect to server.");
            setScanStatus('error');
            setExcelFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    // Custom DropZone for Excel files only
    const CustomDropZone = () => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop: handleDrop,
            accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
                "application/vnd.ms-excel": [],
            },
            multiple: false,
        });
        return (
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${isDragActive ? "border-brand-500 bg-gray-100 dark:bg-gray-800" : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}>
                <input {...getInputProps()} />
                <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                    {isDragActive ? "Drop Excel File Here" : "Drag & Drop Excel File Here"}
                </h4>
                <span className="block text-sm text-gray-700 dark:text-gray-400 mb-2">
                    Only .xlsx or .xls files are accepted
                </span>
                <span className="font-medium underline text-theme-sm text-brand-500">
                    Browse File
                </span>
                {excelFile && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-full">
                        Selected: {excelFile.name}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Upload Customers" />
            <div className="flex justify-end w-full mb-6">
                <a
                    href="/upload_customer_sample_file.xlsx"
                    download
                    className="inline-flex items-center px-5 py-3 justify-center gap-1 rounded-full font-medium text-sm bg-blue-light-100 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500"
                >
                    <ArrowDownIcon className="w-5 " />
                    Download Sample Excel
                </a>

            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
                {/* Left: DropZone Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col min-h-[340px] p-8 w-full h-full relative">
                    <CustomDropZone />

                    <div className="absolute bottom-6 right-6">
                        <Button
                            onClick={handleUpload}
                            disabled={isUploading || !excelFile || scanStatus !== 'success'}
                            className="px-5 py-2 bg-brand-500 text-white rounded-lg shadow hover:bg-brand-600 transition text-base font-medium text-center"
                        >
                            <ArrowUpIcon />
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </div>

                {/* Right: Scan/Validation Card */}
                {/* {alert("hi")} */}

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col items-center justify-center min-h-[340px] p-8 w-full h-full relative overflow-hidden">
                    {/* API compliment or error message */}

                    {apiSuccess === true && apiMessage && (
                        <div className="text-emerald-500 font-bold text-lg flex flex-col items-center justify-center h-full">
                            {<StatusIcon type="pass" className="w-24 h-24  mx-auto relative z-10" />}<br></br>
                            <span className="text-3xl mb-2">🎉</span>
                            {apiMessage}
                        </div>
                    )}
                    {apiSuccess === false && apiMessage && (
                        <div className="text-red-500 font-semibold text-center flex flex-col items-center gap-2">
                            <div>{<StatusIcon type="fail" className="w-24 h-24  mx-auto relative z-10" />}<br></br>{apiMessage}</div>
                            {missingHeaders.length > 0 && (
                                <div className="mt-2 text-xs text-red-400">Missing: {missingHeaders.join(', ')}</div>
                            )}
                        </div>
                    )}
                    {/* Default scanning/validation UI if no API result */}
                    {apiSuccess === null && (
                        <>
                            {isUploading ? (
                                <PageLoader />
                            ) : (
                                <>
                                    {scanStatus === 'idle' && (
                                        <span className="text-gray-400 text-lg font-medium">Waiting for file...</span>
                                    )}
                                    {scanStatus === 'scanning' && (
                                        <div className="relative flex flex-col items-center justify-center w-full h-full">
                                            <div className="relative">
                                                <div className="w-[250px] h-[250px] my-5 outline-offset-[10px]">
                                                    {/* Corner borders */}
                                                    <div className="absolute left-0 top-0 w-[45px] h-[46px] border-l-[5px] border-t-[5px] border-emerald-400 rounded-tl-[5px]" />
                                                    <div className="absolute right-0 top-0 w-[45px] h-[46px] border-r-[5px] border-t-[5px] border-emerald-400 rounded-tr-[5px]" />
                                                    <div className="absolute left-0 bottom-0 w-[45px] h-[46px] border-l-[5px] border-b-[5px] border-emerald-400 rounded-bl-[5px]" />
                                                    <div className="absolute right-0 bottom-0 w-[45px] h-[46px] border-r-[5px] border-b-[5px] border-emerald-400 rounded-br-[5px]" />

                                                    {/* Scanning text */}
                                                    <p className="text-emerald-400 absolute bottom-[-30px] left-[38%] text-base font-semibold animate-[blinker_1s_linear_infinite] uppercase font-sans">
                                                        <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 relative right-1" />
                                                        Scanning
                                                    </p>

                                                    {/* Animated bar */}
                                                    <span className="absolute top-[5%] left-[4%] w-2.5 h-[90%] bg-emerald-400 shadow-[0_0_50px_10px_#18c89b] clip-path-[inset(0)] animate-[x_1s_ease-in-out_infinite_alternate,y_1s_ease-in-out_infinite]" />
                                                </div>

                                                <style jsx global>{`
                @keyframes move {
                  0%,
                  100% {
                    transform: translateY(190px);
                  }
                  50% {
                    transform: translateY(0%);
                  }
                  75% {
                    transform: translateY(160px);
                  }
                }

                @keyframes blinker {
                  50% {
                    opacity: 0;
                  }
                }

                @keyframes x {
                  to {
                    transform: translateX(-100%);
                    left: 100%;
                  }
                }

                @keyframes y {
                  33% {
                    clip-path: inset(0 0 0 -100px);
                  }
                  50% {
                    clip-path: inset(0 0 0 0);
                  }
                  83% {
                    clip-path: inset(0 -100px 0 0);
                  }
                }
              `}</style>
                                            </div>
                                        </div>
                                    )}
                                    {scanStatus === 'success' && (
                                        <span className="text-emerald-500 font-semibold text-lg">{<StatusIcon type="success" className="w-24 h-24  mx-auto relative z-10" />}<br></br>Excel headers are valid!</span>
                                    )}
                                    {scanStatus === 'error' && (
                                        <div className="text-red-500 font-semibold text-center flex flex-col items-center gap-2">
                                            <div>{<StatusIcon type="fail" className="w-24 h-24  mx-auto relative z-10" />}<br></br>Excel header validation failed.</div>
                                            {scanError && <div>{scanError}</div>}
                                            {missingHeaders.length > 0 && (
                                                <div className="mt-2 text-xs text-red-400">Missing: {missingHeaders.join(', ')}</div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 