type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`
        w-full
        max-w-lg
        bg-surface
        p-6
        rounded-xl
        border border-gray-200
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
