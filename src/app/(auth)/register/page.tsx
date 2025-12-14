"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { toast } from "sonner";

// shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      toast.success("Account created", {
        description: "You can now login with your credentials.",
      });

      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-100 px-4">
      <div className="w-full max-w-sm space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Create your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="underline"
              >
                Login
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
