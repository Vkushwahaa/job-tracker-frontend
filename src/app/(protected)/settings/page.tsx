"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getGmailStatus, connectGmail, syncGmail } from "@/services/gmail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowBigLeft } from "lucide-react";

type GmailStatus = {
  connected: boolean;
  expired?: boolean;
  email: string | null;
  lastSyncedAt: string | null;
};

export default function SettingsPage() {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getGmailStatus();

        if (data.expired) {
          setStatus({
            connected: false,
            email: data.email,
            lastSyncedAt: data.lastSyncedAt,
          });
          return;
        }

        setStatus(data);
      } catch {
        toast.error("Failed to load Gmail status");
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, []);

  const handleConnect = async () => {
    try {
      const { url } = await connectGmail();
      window.location.href = url;
    } catch {
      toast.error("Unable to start Gmail connection");
    }
  };

  const handleSync = async () => {
    setSyncing(true);

    try {
      const res = await syncGmail();
      const { created, updated } = res.result;

      if (created === 0 && updated === 0) {
        toast.message("No new job emails found");
      } else {
        toast.success("Gmail synced successfully", {
          description: `${created} new jobs, ${updated} updated`,
        });
      }

      const updatedStatus = await getGmailStatus();
      setStatus(updatedStatus);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const code = err.response?.data?.code;

        if (code === "GMAIL_RECONNECT_REQUIRED") {
          toast.error("Gmail access expired", {
            description: "Please reconnect your Gmail account.",
          });

          setStatus({
            connected: false,
            email: status?.email ?? null,
            lastSyncedAt: status?.lastSyncedAt ?? null,
          });

          return;
        }

        toast.error("Gmail sync failed", {
          description: err.response?.data?.message || "Please try again later",
        });
      } else {
        toast.error("Unexpected error during Gmail sync");
      }
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-muted-foreground">
        Loading Gmail settings…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background ">
      <div className="max-w-2xl mx-auto py-10 space-y-8">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0"
          onClick={() => router.push("/dashboard")}
          aria-label="Go back"
        >
          <ArrowBigLeft className="size-5" />
        </Button>
        <div className="w-full px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage integrations and application preferences
            </p>
          </div>

          {/* Gmail Section */}
          <div className="max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Gmail Integration</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {!status?.connected && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Connect your Gmail account to automatically detect and
                      track job application emails.
                    </p>

                    <Button onClick={handleConnect}>Connect Gmail</Button>
                  </>
                )}

                {status?.connected && (
                  <>
                    {syncing && (
                      <p className="text-sm text-blue-600">
                        Syncing Gmail… this may take a few seconds.
                      </p>
                    )}

                    <div className="rounded-md border p-4 space-y-1">
                      <p>
                        Connected as <strong>{status.email}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last synced:{" "}
                        {status.lastSyncedAt
                          ? new Date(status.lastSyncedAt).toLocaleString()
                          : "Never"}
                      </p>
                    </div>

                    <Button onClick={handleSync} disabled={syncing}>
                      {syncing ? "Syncing…" : "Sync Gmail"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
