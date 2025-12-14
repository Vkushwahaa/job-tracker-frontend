"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import axios from "axios";

// shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBigLeft } from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    status: "applied",
    source: "linkedin",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/jobs", form);
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create job");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ArrowBigLeft className="size-5" />
      </Button>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl">
          {/* <div className="p-6 max-w-xl space-y-6"> */}
          <h1 className="text-2xl font-semibold">Add Job Application</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Company name"
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              required
            />

            <Input
              placeholder="Job title"
              value={form.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              required
            />

            <Select
              value={form.status}
              onValueChange={(v) => updateField("status", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.source}
              onValueChange={(v) => updateField("source", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="naukri">Naukri</SelectItem>
                <SelectItem value="internshala">Internshala</SelectItem>
                <SelectItem value="indeed">Indeed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Job"}
            </Button>
          </form>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
