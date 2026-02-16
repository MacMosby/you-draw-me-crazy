import type { ReactNode } from "react";

type OrnamentedFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function OrnamentedFrame({
  children,
  className,
  ...props
}: OrnamentedFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-10 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.8)] ${className || ""}`}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-14 h-36 w-36 rounded-full bg-primary opacity-25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-20 h-48 w-48 rounded-full bg-textMuted opacity-10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 right-6 h-16 w-16 rotate-12 rounded-2xl border border-white/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 -rotate-12 rounded-full border border-white/10"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
