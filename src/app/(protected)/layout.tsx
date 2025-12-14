// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.replace("/login");
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return <p>Checking authentication...</p>;
//   }

//   if (!user) {
//     return null;
//   }

//   return <>{children}</>;
// }

// src/app/(protected)/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProtectedHeader from "@/components/layout/ProtectedHeader";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Checking authentication...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <ProtectedHeader />
      <main className="flex-1">
        {children}
        <Toaster
          richColors
          theme="light"
          toastOptions={{}}
          position="top-right"
        />
      </main>
    </div>
  );
}
