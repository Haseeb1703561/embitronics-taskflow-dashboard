"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { DASHBOARD_NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DashboardLayout({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_25%),linear-gradient(180deg,_#020617,_#0f172a)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-80 border-r border-slate-800 bg-slate-950/95 px-6 py-8 backdrop-blur transition md:static md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <AppLogo />
            <button
              aria-label="Close navigation"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              type="button"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Signed in as
            </p>
            <p className="mt-2 truncate text-sm font-medium text-slate-200">
              {email}
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {DASHBOARD_NAVIGATION.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white",
                  )}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button
            className="mt-8 w-full"
            variant="secondary"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
            <button
              aria-label="Open navigation"
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-200 transition hover:border-slate-700 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Task Management API with Dashboard
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white">
                Execution overview
              </h1>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            {children}
          </div>
        </div>
      </div>

      {isSidebarOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      ) : null}
    </div>
  );
}
