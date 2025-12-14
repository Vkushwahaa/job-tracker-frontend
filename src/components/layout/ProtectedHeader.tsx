"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function ProtectedHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="h-14 border-b px-6 flex items-center justify-between">
      <h1
        className="font-semibold cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        JobSync
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Welcome, {user?.name}
        </span>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
