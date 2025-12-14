"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// shadcn/ui
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/* ---------------- Types ---------------- */

type Job = {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  source: string;
  applyDate: string;
};

/* ---------------- Page ---------------- */

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0); // 👈 added
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // UI-only filters
  const [draftFilters, setDraftFilters] = useState({
    q: "",
    status: "",
    source: "",
    sort: "-createdAt",
  });

  // Applied filters (used for API)
  const [filters, setFilters] = useState(draftFilters);

  /* ---------------- Fetch jobs ---------------- */

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const res = await api.get("/jobs", {
          params: {
            page,
            limit: 10,
            q: filters.q || undefined,
            status: filters.status,
            source: filters.source,
            sort: filters.sort,
          },
        });
        console.log("res", res.data);

        setJobs(res.data.data);
        setPages(res.data.meta.pages);
        setTotal(res.data.meta.total); // 👈 assuming meta.total exists
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [page, filters]);

  /* ---------------- Handlers ---------------- */

  function applyFilters() {
    setPage(1); // important
    setFilters(draftFilters);
  }

  function clearFilters() {
    const reset = {
      q: "",
      status: "",
      source: "",
      sort: "-createdAt",
    };
    setDraftFilters(reset);
    setPage(1);
    setFilters(reset);
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* -------- Filters -------- */}
        <div className="flex flex-wrap gap-4 items-end mb-2">
          <Input
            placeholder="Search company or role..."
            value={draftFilters.q}
            onChange={(e) =>
              setDraftFilters((prev) => ({ ...prev, q: e.target.value }))
            }
            className="w-[280px]"
          />

          <Select
            value={draftFilters.status}
            onValueChange={(value) =>
              setDraftFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-[160px]">
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
            value={draftFilters.source}
            onValueChange={(value) =>
              setDraftFilters((prev) => ({ ...prev, source: value }))
            }
          >
            <SelectTrigger className="w-[160px]">
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

          <Button onClick={applyFilters}>Apply</Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
          <Button className="text-xl" onClick={() => router.push("/jobs/new")}>
            +
          </Button>
        </div>

        {/* -------- Job List -------- */}
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 && total === 0 ? (
          // GLOBAL EMPTY STATE
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-lg">
            <h2 className="text-xl font-semibold">No job applications yet</h2>
            <p className="text-muted-foreground max-w-sm">
              Start tracking your applications by adding your first job.
            </p>
            <Button onClick={() => router.push("/jobs/new")}>
              Add your first job
            </Button>
          </div>
        ) : jobs.length === 0 && total > 0 ? (
          // FILTER EMPTY STATE
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-lg">
            <h2 className="text-lg font-semibold">No results found</h2>
            <p className="text-muted-foreground max-w-sm">
              No jobs match your current filters or search query.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li
                key={job._id}
                onClick={() => router.push(`/jobs/${job._id}`)}
                className="border rounded-md p-4 flex justify-between hover:cursor-pointer hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{job.companyName}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.jobTitle}
                  </p>
                </div>
                <div className="text-sm text-right">
                  <p>{job.status}</p>
                  <p className="text-muted-foreground">{job.source}</p>
                  <p className="text-muted-foreground">
                    {job.applyDate.split("T")[0]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* -------- Pagination -------- */}
        {jobs.length > 0 && (
          <div className="flex items-center gap-4 pt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span>
              Page {page} of {pages}
            </span>

            <Button
              variant="outline"
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
