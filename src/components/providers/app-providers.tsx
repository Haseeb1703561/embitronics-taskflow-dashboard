"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          className: "border border-slate-800 bg-slate-950 text-slate-100",
        }}
      />
    </SessionProvider>
  );
}
