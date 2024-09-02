"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import toast from "react-hot-toast";
import CustomTooltip from "@/components/ui/custom-tooltip";

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <CustomTooltip content="Copy">
        <div
          className="flex items-center justify-between gap-x-2 cursor-pointer hover:bg-slate-100 py-2 px-1 rounded-md active:scale-95 uppercase"
          style={{ color: row.original.value }}
          onClick={() => {
            navigator.clipboard.writeText(row.original.value);
            toast.success("Color copied.");
          }}
        >
          {row.original.value}
          <div
            className="size-4 rounded-full border-2 border-muted "
            style={{ backgroundColor: row.original.value }}
          />
        </div>
      </CustomTooltip>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
