"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColorColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ColorColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Color ID copied to clipboard", {
      position: "top-right",
    });
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
      router.refresh();
      toast.success("Color deleted!", { position: "top-right" });
    } catch (err) {
      toast.error(
        "Make sure you removed all products using this Color first!",
        { position: "top-right" }
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        title={`Delete ${data.name}?`}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-8 p-0 active:scale-100"
          >
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="mr-2 size-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/${params.storeId}/colors/${data.id}`);
            }}
          >
            <Edit className="mr-2 size-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
