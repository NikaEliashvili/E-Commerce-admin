"use client";

import { cn } from "@/lib/utils";
import { MouseEventHandler, forwardRef } from "react";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  icon: React.ReactElement;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ onClick, className, icon, ...props }, ref) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full flex items-center justify-center bg-white/60 border shadow-md p-2 hover:scale-110 transition dark:bg-slate-900 dark:text-slate-300",
          className
        )}
        ref={ref}
        {...props} // Forward any additional props
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
