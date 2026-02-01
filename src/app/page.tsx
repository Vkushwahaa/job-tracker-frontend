"use client";
import Image from "next/image";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  function handleDashboard() {
    router.replace("/dashboard");
  }
  function handleRegister() {
    router.replace("/register");
  }
  function handleLogin() {
    router.replace("/login");
  }
  return (
    <main className="min-h-screen bg-white text-slate-800 antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-gradient-to-r from-indigo-600 to-sky-500 w-20 h-20 flex items-center justify-center text-white font-bold text-xl">
              <img
                src="https://res.cloudinary.com/ddwinmcui/image/upload/v1769954914/Jobsync_b9bl8m.png"
                alt="Job page"
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold">JobSync</h1>
              <p className="text-xs text-slate-500 -mt-0.5">
                Smart job application tracking
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <a
              href="#how"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#security"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Security
            </a>

            {loading ? (
              <div>Loading...</div>
            ) : user ? (
              <Button onClick={handleDashboard}>dashboard</Button>
            ) : (
              <nav>
                <Button
                  onClick={handleLogin}
                  className="ml-2 px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-sm"
                >
                  Log in
                </Button>
                <a
                  href="/register"
                  className="ml-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm shadow-sm hover:opacity-95"
                >
                  Get started
                </a>
              </nav>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Stay on top of your job hunt automatically.
            </h2>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Connect your Gmail, let smart heuristics + optional AI extract
              applications, and keep a single, searchable timeline of every job
              you applied to. Less busywork, more interviews.
            </p>

            <div className="mt-8 flex gap-3">
              <Button
                onClick={handleRegister}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow"
              >
                Create account
              </Button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-slate-200"
              >
                See features
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-slate-500">
              <div className="p-3 border rounded">Gmail sync • auto-detect</div>
              <div className="p-3 border rounded">AI parsing (optional)</div>
              <div className="p-3 border rounded">Export / Import</div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl shadow-lg overflow-hidden border border-slate-100">
              <img
                src="https://res.cloudinary.com/ddwinmcui/image/upload/v1769959787/image2_cie1sr.png"
                alt="Job page"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="absolute -bottom-12 left-4 w-55 rounded-lg bg-white p-2 border shadow-md">
              <div className="text-xs text-slate-500">Auto-detected</div>
              <div className="mt-1 font-medium">
                Python Developer — Maker Lab
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Confidence: <strong>90%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-semibold">How it works</h3>
        <p className="text-slate-600 mt-2 max-w-2xl">
          A few simple steps — set up once, then focus on interviews.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 border rounded shadow-sm bg-white">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
              1
            </div>
            <h4 className="mt-3 font-medium">Connect Gmail</h4>
            <p className="mt-2 text-sm text-slate-500">
              OAuth-based connection. We request read-only access to detect job
              emails.
            </p>
          </div>

          <div className="p-6 border rounded shadow-sm bg-white">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
              2
            </div>
            <h4 className="mt-3 font-medium">Heuristics & parsing</h4>
            <p className="mt-2 text-sm text-slate-500">
              Site-specific parsers (Indeed/Naukri/Internshala) plus generic
              rules extract title/company fast.
            </p>
          </div>

          <div className="p-6 border rounded shadow-sm bg-white">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
              3
            </div>
            <h4 className="mt-3 font-medium">AI fallback (optional)</h4>
            <p className="mt-2 text-sm text-slate-500">
              If heuristics are uncertain we call the AI parser (budget-limited)
              for better extraction and notes.
            </p>
          </div>

          <div className="p-6 border rounded shadow-sm bg-white">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
              4
            </div>
            <h4 className="mt-3 font-medium">Review & manage</h4>
            <p className="mt-2 text-sm text-slate-500">
              Approve or edit detected jobs in a single view. Archive, add notes
              or track interviews.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-semibold">Key features</h3>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Reliable Parsers"
              text="Custom heuristics for top job sites reduce false positives and maximize precision."
            />
            <FeatureCard
              title="AI Notes"
              text="Optional AI-generated notes explain why an email was labeled applied / interview."
            />
            <FeatureCard
              title="Central Timeline"
              text="All applications in one place with history, notes and source metadata."
            />
            <FeatureCard
              title="Privacy-first"
              text="Read-only Gmail access, tokens stored securely, option to disconnect anytime."
            />
            <FeatureCard
              title="Auto-match"
              text="New emails are matched to existing applications; confidence scores drive suggested actions."
            />
            <FeatureCard
              title="Exportable"
              text="Export your data as CSV or JSON for backup and analytics."
            />
          </div>
        </div>
      </section>

      {/* AI + Limits */}
      <section id="security" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-semibold">AI, budget & privacy</h3>
        <p className="mt-2 text-slate-600 max-w-2xl">
          AI parsing is optional and budgeted we run only a small number of
          calls per sync to avoid running out of quota. Heuristics handle most
          cases. Tokens and user data are stored server-side and never shared.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded bg-white">
            <h4 className="font-medium">Notes & provenance</h4>
            <p className="mt-2 text-sm text-slate-500">
              When AI parses a message we store a concise note explaining the
              extraction (e.g. &quot Detected via Indeed: Application submitted
              job title &quot). These notes are visible in the single job view.
            </p>
          </div>

          <div className="p-6 border rounded bg-white">
            <h4 className="font-medium">Quota control</h4>
            <p className="mt-2 text-sm text-slate-500">
              You can set how many AI calls are allowed per manual sync or per
              cron run to control cost.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 mt-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold">JobTracker</h4>
            <p className="text-sm text-slate-500 mt-2">
              Built for job seekers who want to stay organized. GDPR-friendly,
              privacy-first.
            </p>
          </div>

          {/* <div>
            <h5 className="font-medium">Resources</h5>
            <ul className="mt-2 text-sm text-slate-600 space-y-2">
              <li>
                <a href="/docs" className="hover:underline">
                  Docs
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:underline">
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@jobtracker.local"
                  className="hover:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} JobTracker — made with care.
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-6 border rounded bg-white shadow-sm">
      <h4 className="font-medium">{title}</h4>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}
