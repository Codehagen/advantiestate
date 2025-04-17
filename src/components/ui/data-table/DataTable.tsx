"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/Table"
import { cx } from "@/lib/utils"
import * as React from "react"

import { Button } from "@/components/Button"
import { RiScales3Line } from "@remixicon/react"
import { DataTableBulkEditor } from "./DataTableBulkEditor"
import { Filterbar } from "./DataTableFilterbar"
import { DataTablePagination } from "./DataTablePagination"
import { PropertyComparisonDrawer } from "./PropertyComparisonDrawer"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const pageSize = 20
  const [rowSelection, setRowSelection] = React.useState({})
  const [comparisonOpen, setComparisonOpen] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Get selected rows for comparison
  const selectedRows = React.useMemo(() => {
    return Object.keys(rowSelection)
      .map((key) => table.getRowModel().rows[parseInt(key)]?.original)
      .filter(Boolean)
  }, [rowSelection, table])

  // Check if we have 2 or more properties selected for comparison
  const canCompare = selectedRows.length >= 2

  return (
    <>
      <PropertyComparisonDrawer
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        properties={selectedRows}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Filterbar table={table} />

          {/* Comparison button */}
          {canCompare && (
            <Button
              className="ml-4 flex items-center gap-2"
              onClick={() => setComparisonOpen(true)}
            >
              <RiScales3Line className="size-4" />
              <span>Sammenlign {selectedRows.length} eiendommer</span>
            </Button>
          )}
        </div>

        <div className="relative overflow-hidden overflow-x-auto">
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-y border-warm-grey-2/20 dark:border-warm-grey-1/20"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHeaderCell
                      key={header.id}
                      className={cx(
                        "whitespace-nowrap py-1 text-sm sm:text-xs",
                        header.column.columnDef.meta?.className,
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={(e) => {
                      // Don't toggle row selection when clicking links or other interactive elements
                      if (
                        e.target instanceof HTMLElement &&
                        (e.target.closest("a") ||
                          e.target.closest("button") ||
                          e.target.closest("input"))
                      ) {
                        return
                      }
                      row.toggleSelected(!row.getIsSelected())
                    }}
                    className="group select-none hover:bg-light-blue-1 hover:dark:bg-light-blue/20"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={cx(
                          row.getIsSelected()
                            ? "bg-light-blue-1 dark:bg-light-blue/20"
                            : "",
                          "relative whitespace-nowrap py-1 text-warm-grey-2 first:w-10 dark:text-warm-grey-1",
                          cell.column.columnDef.meta?.className,
                        )}
                      >
                        {index === 0 && row.getIsSelected() && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-amber-600 dark:bg-amber-500" />
                        )}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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
          <DataTableBulkEditor table={table} rowSelection={rowSelection} />
        </div>
        <DataTablePagination table={table} pageSize={pageSize} />
      </div>
    </>
  )
}
