export default function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      {/* Code snippet */}
      <pre
        style={{ "--delay": "500ms" } as React.CSSProperties}
        className="animate-in absolute end-0 top-6 hidden text-left font-mono text-[13px] leading-6 text-muted-foreground/40 md:block"
      >
        <code dir="ltr" className="block">
          <span className="text-accent/50">const</span> developer = {"{"}
          {"\n"}  name: <span className="text-emerald-500/50">&quot;Yousef Abouteem&quot;</span>,
          {"\n"}  role: <span className="text-emerald-500/50">&quot;Frontend Developer&quot;</span>,
          {"\n"}  stack: [<span className="text-emerald-500/50">&quot;React&quot;</span>, <span className="text-emerald-500/50">&quot;Next.js&quot;</span>, <span className="text-emerald-500/50">&quot;TypeScript&quot;</span>],
          {"\n"}  languages: [<span className="text-emerald-500/50">&quot;ar&quot;</span>, <span className="text-emerald-500/50">&quot;en&quot;</span>, <span className="text-emerald-500/50">&quot;tr&quot;</span>],
          {"\n"}  location: <span className="text-emerald-500/50">&quot;Istanbul&quot;</span>,
          {"\n"}  openToWork: <span className="text-accent/50">true</span>,
          {"\n"}{"}"};
        </code>
      </pre>
    </div>
  );
}
