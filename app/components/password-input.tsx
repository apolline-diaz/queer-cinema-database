"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  "data-testid"?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, "data-testid": dataTestId, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="w-full">
        {label && <label className="block mb-2">{label}</label>}
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            data-testid={dataTestId}
            ref={ref}
            className={cn(
              "appearance-none text-sm font-light border-black block w-full border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black pr-10",
              error && "border-red-500",
              className
            )}
            {...props}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setVisible(!visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-rose-500"
            data-testid={`${dataTestId}-toggle`}
          >
            {visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
        {error && (
          <span
            className="text-rose-500 text-xs"
            data-testid={`${dataTestId}-error`}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
