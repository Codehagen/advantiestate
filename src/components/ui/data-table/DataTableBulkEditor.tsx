"use client"

import { Usage } from "@/components/data/schema"
import { RowSelectionState, Table } from "@tanstack/react-table"
import { useState } from "react"
import {
  CommandBar,
  CommandBarBar,
  CommandBarCommand,
  CommandBarSeperator,
  CommandBarValue,
} from "../CommandBar"
import { PropertyComparisonDrawer } from "./PropertyComparisonDrawer"

type DataTableBulkEditorProps<TData> = {
  table: Table<TData>
  rowSelection: RowSelectionState
}

function DataTableBulkEditor<TData>({
  table,
  rowSelection,
}: DataTableBulkEditorProps<TData>) {
  const hasSelectedRows = Object.keys(rowSelection).length > 0
  const [comparisonOpen, setComparisonOpen] = useState(false)

  // Get selected rows for comparison
  const selectedRows = Object.keys(rowSelection)
    .map((key) => table.getRowModel().rows[parseInt(key)]?.original)
    .filter(Boolean) as unknown as Usage[]

  return (
    <>
      <PropertyComparisonDrawer
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        properties={selectedRows}
      />

      <CommandBar open={hasSelectedRows}>
        <CommandBarBar>
          <CommandBarValue>
            {Object.keys(rowSelection).length} selected
          </CommandBarValue>
          <CommandBarSeperator />
          <CommandBarCommand
            label="Compare"
            action={() => {
              setComparisonOpen(true)
            }}
            shortcut={{ shortcut: "e" }}
          />
          <CommandBarSeperator />
          <CommandBarCommand
            label="Delete"
            action={() => {
              console.log("Delete")
            }}
            shortcut={{ shortcut: "d" }}
          />
          <CommandBarSeperator />
          <CommandBarCommand
            label="Reset"
            action={() => {
              table.resetRowSelection()
            }}
            shortcut={{ shortcut: "Escape", label: "esc" }}
            // don't disable this command
          />
        </CommandBarBar>
      </CommandBar>
    </>
  )
}

export { DataTableBulkEditor }
