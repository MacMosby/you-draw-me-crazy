import type { ReactNode } from "react";
import rocket from "../assets/rocket.png";
import bee from "../assets/bee.png";
import cloud from "../assets/cloud.png";

type PageOrnamentsProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function PageOrnaments({
  children,
  className,
  ...props
}: PageOrnamentsProps) {
  const sideOffset = "clamp(30px, calc((100vw - 32rem) / 3), 500px)";

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-background ${className || ""}`}
      {...props}
    >
      <img
        src={rocket}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 w-32 -translate-y-1/2 opacity-90 sm:w-40 md:w-48"
        style={{ left: `calc(${sideOffset} - 120px)` }}
      />
      <img
        src={cloud}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute w-28 opacity-90 sm:w-36 md:w-44"
        style={{ right: sideOffset, top: "70%", transform: "translateY(-50%)" }}
      />
      <img
        src={bee}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute w-16 opacity-90 sm:w-20 md:w-24"
        style={{ right: sideOffset, top: "20%", transform: "translateY(-50%)" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
