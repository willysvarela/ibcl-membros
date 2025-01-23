"use client";

import { LoginForm } from "@/components/blocks/login";
import { useEffect, useState } from "react";
import { submitLogin } from "./actions/submit";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<"invalid" | "loading" | null>(null);

    

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    setStatus("loading");
    const result = await submitLogin(email, password);
    if(result) {
      setIsAuthenticated(true);
    } else {
      setStatus("invalid");
    }
  };

  useEffect(() => {
    if(status === "loading") {
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  }, [status]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoginForm className="w-full max-w-md" onLogin={handleSubmit} status={status} />
      </div>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
};

export default DashboardLayout;
