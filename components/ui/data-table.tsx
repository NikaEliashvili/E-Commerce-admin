"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { LoaderCircle, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IconButton from "@/components/ui/icon-button";
import CustomTooltip from "./custom-tooltip";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const ref = useRef(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  }, [data, isLoading]);

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <CustomTooltip content={`Refresh Content`}>
          <IconButton
            ref={ref}
            className="shadow-none rounded-sm p-1"
            icon={<RotateCw className="text-slate-500 dark:text-slate-400" />}
            onClick={() => {
              console.log("Clicked");
              setIsLoading(true);
              router.refresh();
            }}
          />
        </CustomTooltip>
      </div>
      <div className={cn("relative rounded-md border")}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <LoaderCircle className="animate-spin inline-block size-10 text-slate-400 " />
          </div>
        )}
        <Table className={cn(isLoading ? "opacity-35" : "")}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
