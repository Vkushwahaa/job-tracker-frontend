// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { api } from "@/services/api";

// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { ArrowBigLeft } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// type Job = {
//   _id: string;
//   company: { name: string };
//   job: { title: string };
//   status: string;
//   source: string;
//   notes?: string;
//   autoFetched: boolean;
//   confidence?: {
//     score: number;
//     level: "high" | "medium" | "low";
//     reasons: string[];
//     needsReview: boolean;
//   };
// };

// const STATUS_OPTIONS = ["applied", "interview", "rejected", "selected"];

// const SOURCE_OPTIONS = [
//   "linkedin",
//   "indeed",
//   "naukri",
//   "internshala",
//   "gmail",
//   "other",
// ];

// export default function JobDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const jobId = params.id as string;

//   const [job, setJob] = useState<Job | null>(null);
//   const [originalJob, setOriginalJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   function hasChanges() {
//     if (!job || !originalJob) return false;

//     return (
//       job.company.name !== originalJob.company.name ||
//       job.job.title !== originalJob.job.title ||
//       job.status !== originalJob.status ||
//       job.source !== originalJob.source ||
//       job.notes !== originalJob.notes
//     );
//   }

//   useEffect(() => {
//     async function fetchJob() {
//       try {
//         const res = await api.get(`/jobs/${jobId}`);
//         setJob(res.data.job);
//         setOriginalJob(res.data.job);
//         console.log(res);
//       } catch {
//         router.push("/dashboard");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchJob();
//   }, [jobId, router]);

//   useEffect(() => {
//     function handleBeforeUnload(e: BeforeUnloadEvent) {
//       if (!hasChanges()) return;

//       e.preventDefault();
//       e.returnValue = "";
//     }

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [job, originalJob]);

//   function handleBack() {
//     if (!hasChanges()) {
//       router.back();
//       return;
//     }

//     const confirmLeave = window.confirm(
//       "You have unsaved changes. Are you sure you want to leave?"
//     );

//     if (confirmLeave) {
//       router.back();
//     }
//   }

//   async function handleSave() {
//     if (!job) return;

//     setSaving(true);
//     try {
//       await api.put(`/jobs/${job._id}`, {
//         company: job.company,
//         job: job.job,
//         status: job.status,
//         source: job.source,
//         notes: job.notes,
//       });

//       setOriginalJob(job);

//       router.refresh();
//       toast.success("Job updated", {
//         description: "Your changes have been saved.",
//       });
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function deleteJob() {
//     if (!job) return;
//     await api.delete(`/jobs/${job._id}`);
//     toast.error("Job deleted", {
//       description: "The job application has been removed.",
//     });
//     router.replace("/dashboard");
//   }
//   async function approveJob() {
//     await api.post(`/jobs/${job!._id}/approve-gmail`);
//     toast.success("Job approved");
//     router.refresh();
//   }

//   if (loading) return <p>Loading job...</p>;
//   if (!job) return null;

//   return (
//     <div className="relative min-h-screen bg-background">
//       {job.autoFetched && job.source === "gmail" && (
//         <Badge variant="secondary">Updated via Gmail</Badge>
//       )}

//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute left-4 top-4"
//         onClick={() => router.back()}
//         aria-label="Go back"
//       >
//         <ArrowBigLeft className="size-5" />
//       </Button>
//       <div className="max-w-2xl mx-auto py-10 space-y-8">
//         {/* Header */}
//         <div className="space-y-2">
//           <Input
//             className="text-2xl font-semibold"
//             placeholder="Company name"
//             value={job.company.name}
//             onChange={(e) =>
//               setJob({
//                 ...job,
//                 company: { ...job.company, name: e.target.value },
//               })
//             }
//           />

//           <Input
//             className="text-muted-foreground"
//             placeholder="Job title"
//             value={job.job.title}
//             onChange={(e) =>
//               setJob({ ...job, job: { ...job.job, title: e.target.value } })
//             }
//           />
//         </div>
//         {job.autoFetched && (
//           <span
//             className={`text-xs px-2 py-1 rounded ${
//               job.confidence?.level === "high"
//                 ? "bg-green-100 text-green-700"
//                 : job.confidence?.level === "medium"
//                 ? "bg-yellow-100 text-yellow-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             Gmail · {job.confidence?.score}%
//           </span>
//         )}

//         {/* Meta */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-1">
//             <Label>Status</Label>
//             <p className="text-xs text-muted-foreground">
//               Update status as your application progresses
//             </p>

//             <Select
//               value={job.status}
//               onValueChange={(value) => setJob({ ...job, status: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {STATUS_OPTIONS.map((s) => (
//                   <SelectItem key={s} value={s}>
//                     {s}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-1">
//             <Label>Source</Label>
//             <Select
//               value={job.source}
//               onValueChange={(value) => setJob({ ...job, source: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select source" />
//               </SelectTrigger>
//               <SelectContent>
//                 {SOURCE_OPTIONS.map((s) => (
//                   <SelectItem key={s} value={s}>
//                     {s}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Notes */}
//         <div className="space-y-1">
//           <Label>Notes</Label>
//           <Textarea
//             placeholder="No notes yet. Add recruiter feedback, interview experience, or
//               follow-ups."
//             rows={6}
//             value={job.notes || ""}
//             onChange={(e) => setJob({ ...job, notes: e.target.value })}
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex justify-between">
//           <div className="flex gap-3">
//             <Button onClick={handleSave} disabled={saving || !hasChanges()}>
//               {saving ? "Saving..." : "Save"}
//             </Button>

//             <Button variant="outline" onClick={handleBack}>
//               Back
//             </Button>
//           </div>
//           <div>
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant="destructive">Delete</Button>
//               </AlertDialogTrigger>

//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>
//                     Delete this job application?
//                   </AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This action cannot be undone. The job application and all
//                     its notes will be permanently removed.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>

//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>

//                   <AlertDialogAction
//                     onClick={deleteJob}
//                     className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                   >
//                     Yes, delete
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//           {job.confidence?.needsReview && (
//             <div className="border border-yellow-300 bg-yellow-50 p-4 rounded space-y-2">
//               <p className="font-medium">
//                 We detected this job from Gmail with {job.confidence.score}%
//                 confidence
//               </p>

//               <ul className="text-sm list-disc pl-4">
//                 {job.confidence.reasons.map((r, i) => (
//                   <li key={i}>{r}</li>
//                 ))}
//               </ul>

//               <div className="flex gap-2 pt-2">
//                 <Button onClick={approveJob}>Looks correct</Button>

//                 <Button variant="destructive" onClick={deleteJob}>
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/(protected)/jobs/[id]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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
import { Badge } from "@/components/ui/badge";

type Job = {
  _id: string;
  company: { name: string };
  job: { title: string };
  status: string;
  source: string;
  notes?: string;
  autoFetched?: boolean;
  confidence?: {
    score?: number;
    level?: "high" | "medium" | "low";
    reasons?: string[];
    needsReview?: boolean;
  };
};

const STATUS_OPTIONS = ["applied", "interview", "rejected", "selected"];

const SOURCE_OPTIONS = [
  "linkedin",
  "indeed",
  "naukri",
  "internshala",
  "gmail",
  "other",
];

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [originalJob, setOriginalJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // refs used by "Edit" action (focus)
  const companyRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  function hasChanges() {
    if (!job || !originalJob) return false;

    return (
      job.company?.name !== originalJob.company?.name ||
      job.job?.title !== originalJob.job?.title ||
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
        console.log("Fetched job:", res.data.job);
      } catch (err) {
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
      await api.put(`/jobs/${job._id}`, {
        company: job.company,
        job: job.job,
        status: job.status,
        source: job.source,
        notes: job.notes,
      });

      setOriginalJob(job);

      router.refresh();
      toast.success("Job updated", {
        description: "Your changes have been saved.",
      });
    } catch (err) {
      toast.error("Failed to save job");
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob() {
    if (!job) return;
    try {
      await api.delete(`/jobs/${job._id}`);
      toast.error("Job deleted", {
        description: "The job application has been removed.",
      });
      router.replace("/dashboard");
    } catch {
      toast.error("Failed to delete job");
    }
  }

  async function approveJob() {
    if (!job) return;
    try {
      await api.post(`/jobs/${job._id}/approve-gmail`);
      toast.success("Job approved");
      router.refresh();
    } catch {
      toast.error("Approve failed");
    }
  }

  // Permanently ignore: archive the job (uses the existing update endpoint)
  async function ignorePermanently() {
    if (!job) return;
    try {
      await api.put(`/jobs/${job._id}`, { archived: true });
      toast.success("Job ignored (archived)");
      router.replace("/dashboard");
    } catch {
      toast.error("Failed to ignore job");
    }
  }

  // 'Edit' action: focus the company input (user can then Save)
  function startEditing() {
    // focus company if possible else title
    if (companyRef.current) {
      companyRef.current.focus();
      companyRef.current.select();
    } else if (titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }

  if (loading) return <p>Loading job...</p>;
  if (!job) return null;

  return (
    <div className="relative min-h-screen bg-background">
      {job.autoFetched && job.source === "gmail" && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Updated via Gmail</Badge>
          {/* show confidence score */}
          <span className="text-xs text-muted-foreground">
            {job.confidence?.score ? `${job.confidence.score}%` : null}{" "}
            {job.confidence?.needsReview ? "(Needs review)" : ""}
          </span>
        </div>
      )}

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
            ref={companyRef}
            className="text-2xl font-semibold"
            placeholder="Company name"
            value={job.company?.name || ""}
            onChange={(e) =>
              setJob({
                ...job,
                company: { ...job.company, name: e.target.value },
              })
            }
          />

          <Input
            ref={titleRef}
            className="text-muted-foreground"
            placeholder="Job title"
            value={job.job?.title || ""}
            onChange={(e) =>
              setJob({ ...job, job: { ...job.job, title: e.target.value } })
            }
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
            placeholder="No notes yet. Add recruiter feedback, interview experience, or follow-ups."
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

          <div className="flex items-center gap-2">
            {/* Delete */}
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

            {/* Review controls for auto-fetched + needsReview */}
            {job.autoFetched && job.confidence?.needsReview && (
              <div className="border border-yellow-300 bg-yellow-50 p-4 rounded space-y-2">
                <p className="font-medium">
                  We detected this job from Gmail with {job.confidence.score}%
                  confidence
                </p>

                <ul className="text-sm list-disc pl-4">
                  {(job.confidence.reasons || []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>

                <div className="flex gap-2 pt-2">
                  <Button onClick={approveJob}>Confirm (looks correct)</Button>
                  <Button variant="outline" onClick={startEditing}>
                    Edit details
                  </Button>
                  <Button variant="destructive" onClick={ignorePermanently}>
                    Permanently ignore
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
