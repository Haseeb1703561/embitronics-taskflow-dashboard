import { AppLogo } from "@/components/app-logo";
import { Card } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(180deg,_#020617,_#0f172a)] px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[32px] border border-slate-800 bg-slate-950/50 p-10 lg:block">
          <AppLogo />
          <div className="mt-16 max-w-xl space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              Software Engineer Assessment
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Build, track, and deliver work with clarity.
            </h1>
            <p className="text-lg leading-8 text-slate-300">
              Manage projects, prioritize tasks, monitor deadlines, and keep
              execution focused from a single dashboard.
            </p>
          </div>
        </section>

        <Card className="border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
          <div className="space-y-2">
            <AppLogo />
            <h2 className="pt-6 text-3xl font-semibold text-white">{title}</h2>
            <p className="text-sm leading-6 text-slate-400">{description}</p>
          </div>
          <div className="mt-8">{children}</div>
        </Card>
      </div>
    </main>
  );
}
