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
  function handleSettings() {
    router.replace("/settings");
  }
  function handlehome() {
    router.push("/");
  }
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1
            className="font-semibold cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <div className="rounded-md bg-gradient-to-r from-indigo-600 to-sky-500 w-14 h-14 flex items-center justify-center text-white font-bold text-xl">
              <img
                src="https://res.cloudinary.com/ddwinmcui/image/upload/v1769959590/J_ixl4f6.png"
                alt="Job page"
                className="w-full h-auto object-cover"
              />
            </div>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.name}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="bg-indigo-600 text-white"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button variant="outline" size="sm" onClick={handleSettings}>
            settings
          </Button>
          <Button variant="outline" size="sm" onClick={handlehome}>
            learn how it works
          </Button>
        </div>
      </div>
    </header>
  );
}
