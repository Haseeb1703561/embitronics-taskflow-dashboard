export function AppLogo() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-bold text-slate-950">
        ET
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          EmbiTronics
        </p>
        <p className="text-lg font-semibold text-white">TaskFlow Dashboard</p>
      </div>
    </div>
  );
}
