import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RepayKaro - Sign In",
  keywords: "RepayKaro, Sign In, Loan Repayment Management, Dashboard",
  description: "RepayKaro, Sign In, Loan Repayment Management, Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
