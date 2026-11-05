"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/features/auth/hooks/use-auth";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: user, isPending, isError } = useCurrentUser();

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isPending || isError || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
