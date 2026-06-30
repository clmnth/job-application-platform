"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import { getInsforgeClient } from "@/lib/insforge";

type JobApplication = {
  id: string;
  title: string;
  company: string;
  status: string;
  notes: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const insforge = useMemo(() => getInsforgeClient(), []);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("interested");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<JobApplication[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    const loadRecords = async () => {
      if (!user) return;
      const { data, error } = await insforge.database
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) {
        setRecords((data ?? []) as JobApplication[]);
      }
    };

    void loadRecords();
  }, [insforge, user]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      const { error } = await insforge.database
        .from("job_applications")
        .insert([
          {
            title,
            company,
            status,
            notes,
          },
        ]);

      if (error) {
        throw new Error(error.message ?? "Your job could not be saved.");
      }

      setTitle("");
      setCompany("");
      setStatus("interested");
      setNotes("");
      const { data } = await insforge.database
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });
      setRecords((data ?? []) as JobApplication[]);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Your job could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto flex max-w-6xl flex-1 items-center justify-center px-6 py-16 text-sm text-text-secondary">
          Loading your workspace…
        </main>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8 lg:px-8">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-accent">
                Private workspace
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-text-primary">
                Welcome back, {user.email ?? "there"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Only you can see and manage the jobs you track here. Each record
                is protected by InsForge row level security.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                void signOut();
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-border bg-surface p-6 shadow-card"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Track a new application
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Create a private record that stays tied to your account.
                </p>
              </div>
            </div>

            {formError ? (
              <p className="mt-4 rounded-md border border-error/20 bg-error/10 p-3 text-sm text-error">
                {formError}
              </p>
            ) : null}

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-text-primary">
                <span className="mb-1 block">Role title</span>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                  placeholder="Senior Frontend Engineer"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-text-primary">
                <span className="mb-1 block">Company</span>
                <input
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                  placeholder="Northstar Labs"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-text-primary">
                <span className="mb-1 block">Status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                >
                  <option value="interested">Interested</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="closed">Closed</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-text-primary">
                <span className="mb-1 block">Notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                  placeholder="Add context about the company, your fit, or follow-up."
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-6 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving…" : "Save application"}
            </button>
          </form>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Your saved applications
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  These records belong to your account only.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {records.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-5 text-sm text-text-secondary">
                  No private records yet. Create your first application to get
                  started.
                </div>
              ) : (
                records.map((record) => (
                  <article
                    key={record.id}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-text-primary">
                          {record.title}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {record.company}
                        </p>
                      </div>
                      <span className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
                        {record.status}
                      </span>
                    </div>
                    {record.notes ? (
                      <p className="mt-3 text-sm text-text-secondary">
                        {record.notes}
                      </p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
