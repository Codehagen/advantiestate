"use client"

import { Button } from "@/components/Button"
import { RiMoreFill } from "@remixicon/react"
import { Row } from "@tanstack/react-table"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { PropertyDrawer } from "./PropertyDrawer"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <PropertyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        property={row.original as any}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group aspect-square p-1.5 hover:border hover:border-warm-grey-2/30 data-[state=open]:border-warm-grey-2/30 data-[state=open]:bg-warm-white/80 hover:dark:border-warm-grey-1/30 data-[state=open]:dark:border-warm-grey-1/30 data-[state=open]:dark:bg-warm-grey/60"
          >
            <RiMoreFill
              className="size-4 shrink-0 text-warm-grey-2 group-hover:text-warm-grey group-data-[state=open]:text-warm-grey group-hover:dark:text-warm-grey-1 group-data-[state=open]:dark:text-warm-white"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={() => setDrawerOpen(true)}>
            Detaljer
          </DropdownMenuItem>
          <DropdownMenuItem>Rediger</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 dark:text-red-500">
            Slett
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
