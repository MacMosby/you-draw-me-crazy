import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-textPrimary">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full
            rounded-md
            border
            px-3
            py-2
            text-sm
            outline-none
            transition
            ${
              error
                ? "border-error focus:ring-error"
                : "border-surface focus:border-primary focus:ring-primary"
            }
            focus:ring-1
            ${className || ""}
          `}
          {...props}
        />

        {error && (
          <span className="text-xs text-error">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
