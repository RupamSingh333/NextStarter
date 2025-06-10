import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RepayKaro - Admin Login",
  keywords: "RepayKaro, Admin Login, Admin Dashboard",
  description: "RepayKaro admin panel login page for managing the platform.",
};

export default function AdminLogin() {
  return <AdminLoginForm />;
} 