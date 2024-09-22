"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "./button";
import CustomTooltip from "./custom-tooltip";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route Copied to the clipboard.", {
      position: "top-right",
    });
  };

  return (
    <Alert>
      <AlertTitle className="flex items-center gap-x-2">
        <Server className="size-4" />
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-start justify-between gap-x-4">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold dark:bg-muted/30">
          {description}
        </code>
        <CustomTooltip content="Copy to Clipboard">
          <Button
            variant="outline"
            size="icon"
            onClick={onCopy}
            className="shrink-0"
          >
            <Copy className="size-4" />
          </Button>
        </CustomTooltip>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
