"use client";

import React from "react";
import type { ComponentPropsWithoutRef } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";

interface TooltipProviderProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const CustomTooltip: React.FC<TooltipProviderProps> = ({
  children,
  content,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
