"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/services/api";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowBigLeft } from "lucide-react";

type Job = {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  source: string;
  appliedDate?: string;
  notes?: string;
};

const STATUS_OPTIONS = ["applied", "interview", "rejected", "selected"];

const SOURCE_OPTIONS = ["linkedin", "indeed", "naukri", "internshala", "other"];

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [originalJob, setOriginalJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function hasChanges() {
    if (!job || !originalJob) return false;

    return (
      job.companyName !== originalJob.companyName ||
      job.jobTitle !== originalJob.jobTitle ||
      job.status !== originalJob.status ||
      job.source !== originalJob.source ||
      job.notes !== originalJob.notes
    );
  }

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data.job);
        setOriginalJob(res.data.job);
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId, router]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!hasChanges()) return;

      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [job, originalJob]);

  function handleBack() {
    if (!hasChanges()) {
      router.back();
      return;
    }

    const confirmLeave = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );

    if (confirmLeave) {
      router.back();
    }
  }

  async function handleSave() {
    if (!job) return;

    setSaving(true);
    try {
      await api.put(`/jobs/${job._id}`, job);
      setOriginalJob(job);

      router.refresh();
      toast.success("Job updated", {
        description: "Your changes have been saved.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob() {
    if (!job) return;
    await api.delete(`/jobs/${job._id}`);
    toast.error("Job deleted", {
      description: "The job application has been removed.",
    });
    router.replace("/dashboard");
  }

  if (loading) return <p>Loading job...</p>;
  if (!job) return null;

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
      <div className="max-w-2xl mx-auto py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Input
            className="text-2xl font-semibold"
            placeholder="Company name"
            value={job.companyName}
            onChange={(e) => setJob({ ...job, companyName: e.target.value })}
          />

          <Input
            className="text-muted-foreground"
            placeholder="Job title"
            value={job.jobTitle}
            onChange={(e) => setJob({ ...job, jobTitle: e.target.value })}
          />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Status</Label>
            <p className="text-xs text-muted-foreground">
              Update status as your application progresses
            </p>

            <Select
              value={job.status}
              onValueChange={(value) => setJob({ ...job, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Source</Label>
            <Select
              value={job.source}
              onValueChange={(value) => setJob({ ...job, source: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <Label>Notes</Label>
          <Textarea
            placeholder="No notes yet. Add recruiter feedback, interview experience, or
              follow-ups."
            rows={6}
            value={job.notes || ""}
            onChange={(e) => setJob({ ...job, notes: e.target.value })}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving || !hasChanges()}>
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          </div>
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete this job application?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The job application and all
                    its notes will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={deleteJob}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
