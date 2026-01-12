"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { getGmailStatus, connectGmail, syncGmail } from "@/services/gmail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// type GmailStatus = {
//   connected: boolean;
//   email: string | null;
//   lastSyncedAt: string | null;
// };

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

  /**
   * Initial load – fetch Gmail connection status
   */
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getGmailStatus();
        setStatus(data);
      } catch {
        toast.error("Failed to load Gmail status");
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, []);

  /**
   * Start OAuth flow
   */
  const handleConnect = async () => {
    try {
      const { url } = await connectGmail();
      window.location.href = url;
    } catch {
      toast.error("Unable to start Gmail connection");
    }
  };

  /**
   * Manual Gmail sync
   */
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

      // Refresh status after sync
      const updatedStatus = await getGmailStatus();
      setStatus(updatedStatus);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
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
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Gmail Integration</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* NOT CONNECTED */}
        {!status?.connected && (
          <>
            <p className="text-sm">
              Connect your Gmail account to automatically detect and track job
              application emails.
            </p>
            <Button onClick={handleConnect}>Connect Gmail</Button>
          </>
        )}

        {/* CONNECTED */}
        {status?.connected && (
          <>
            {syncing && (
              <p className="text-sm text-blue-600">
                Syncing your Gmail… this may take a few seconds.
              </p>
            )}

            <div className="space-y-1">
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
  );
}
