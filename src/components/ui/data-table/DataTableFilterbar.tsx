"use client"

import { Button } from "@/components/Button"
import { cities, conditions, propertyTypes } from "@/components/data/data"
import { formatters } from "@/lib/utils"
import { RiDownloadLine } from "@remixicon/react"
import { Table } from "@tanstack/react-table"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Searchbar } from "../Searchbar"
import { DataTableFilter } from "./DataTableFilter"
import { ViewOptions } from "./DataTableViewOptions"

// Add imports for the combined filter
import { Checkbox } from "@/components/Checkbox"
import { Label } from "@/components/Label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { cx, focusRing } from "@/lib/utils"
import { RiArrowDownSLine, RiFilterLine } from "@remixicon/react"

// Add new type for combined filter options
type CombinedFilterOption = {
  id: string
  label: string
  description: string
  column: string
  condition: string
  value: any
}

// Add predefined combined filter options
const combinedFilterOptions: CombinedFilterOption[] = [
  {
    id: "high-yield",
    label: "Høy yield",
    description: "Eiendommer med yield over 5%",
    column: "yield",
    condition: "is-greater-than",
    value: 0.05,
  },
  {
    id: "prime-location",
    label: "Prime beliggenhet",
    description: "Eiendommer i Oslo og Bergen",
    column: "by",
    condition: "includes",
    value: ["oslo", "bergen"],
  },
  {
    id: "stable-tenants",
    label: "Stabile leietakere",
    description: "Eiendommer med uendret eller økende antall leietakere",
    column: "antallLeietakere",
    condition: "custom-tenant-stability",
    value: true,
  },
  {
    id: "high-rental-price",
    label: "Høy leiepris",
    description: "Eiendommer med leiepris over 2500 kr/m²",
    column: "leieprisPerKvm",
    condition: "is-greater-than",
    value: 2500,
  },
  {
    id: "office-properties",
    label: "Kontoreiendommer",
    description: "Viser kun kontoreiendommer",
    column: "type",
    condition: "includes",
    value: ["kontor"],
  },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function Filterbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [searchTerm, setSearchTerm] = useState<string>("")
  // Add state for combined filters
  const [selectedCombinedFilters, setSelectedCombinedFilters] = useState<
    string[]
  >([])

  const debouncedSetFilterValue = useDebouncedCallback((value) => {
    table.getColumn("eiendomsnavn")?.setFilterValue(value)
  }, 300)

  const handleSearchChange = (event: any) => {
    const value = event.target.value
    setSearchTerm(value)
    debouncedSetFilterValue(value)
  }

  // Add function to apply combined filters
  const applyCombinedFilters = () => {
    // Clear existing filters first
    table.resetColumnFilters()

    // For each selected combined filter option
    selectedCombinedFilters.forEach((filterId) => {
      const option = combinedFilterOptions.find((opt) => opt.id === filterId)
      if (!option) return

      const column = table.getColumn(option.column)
      if (!column) return

      // Handle different types of conditions
      if (option.condition === "includes") {
        column.setFilterValue(option.value)
      } else if (option.condition === "custom-tenant-stability") {
        // This is a special case for tenant stability that requires checking row data
        // We'll handle this by using a custom filter function already in the column definition
        column.setFilterValue({
          condition: "is-greater-than-or-equal",
          value: [0, ""],
        })
      } else {
        // For numeric conditions
        column.setFilterValue({
          condition: option.condition,
          value: [option.value, ""],
        })
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
      <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
        {/* Add Combined Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cx(
                "flex w-full items-center gap-x-1.5 whitespace-nowrap rounded-md border border-warm-grey-2/20 px-2 py-1.5 font-medium text-warm-grey hover:bg-warm-white/80 sm:w-fit sm:text-xs dark:border-warm-grey-1/20 dark:text-warm-grey-1 hover:dark:bg-warm-grey/60",
                selectedCombinedFilters.length > 0
                  ? "border-amber-500/50"
                  : "border-dashed",
                focusRing,
              )}
            >
              <RiFilterLine
                className="size-5 shrink-0 sm:size-4"
                aria-hidden="true"
              />
              <span className="w-full text-left sm:w-fit">
                Kombinert filter
              </span>
              {selectedCombinedFilters.length > 0 && (
                <>
                  <span
                    className="h-4 w-px bg-warm-grey-2/20 dark:bg-warm-grey-1/20"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-amber-700 dark:text-amber-500">
                    {selectedCombinedFilters.length} valgt
                  </span>
                </>
              )}
              <RiArrowDownSLine
                className="size-5 shrink-0 text-warm-grey-2 dark:text-warm-grey-1"
                aria-hidden="true"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={7}
            className="min-w-[calc(var(--radix-popover-trigger-width))] max-w-[calc(var(--radix-popover-trigger-width))] space-y-3 sm:min-w-72 sm:max-w-72"
          >
            <div>
              <Label className="text-base font-medium sm:text-sm">
                Filtrer etter flere kriterier samtidig
              </Label>
              <div className="mt-2 space-y-3 overflow-y-auto sm:max-h-56">
                {combinedFilterOptions.map((option) => (
                  <div key={option.id} className="flex items-start gap-2">
                    <Checkbox
                      id={`combined-${option.id}`}
                      checked={selectedCombinedFilters.includes(option.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCombinedFilters((prev) => {
                          if (checked) {
                            return [...prev, option.id]
                          } else {
                            return prev.filter((id) => id !== option.id)
                          }
                        })
                      }}
                      className="mt-0.5"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`combined-${option.id}`}
                        className="text-base font-medium sm:text-sm"
                      >
                        {option.label}
                      </Label>
                      <p className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full sm:py-1"
              onClick={() => {
                applyCombinedFilters()
              }}
            >
              Bruk filter
            </Button>

            {selectedCombinedFilters.length > 0 && (
              <Button
                variant="secondary"
                className="w-full sm:py-1"
                type="button"
                onClick={() => {
                  setSelectedCombinedFilters([])
                  table.resetColumnFilters()
                }}
              >
                Nullstill
              </Button>
            )}
          </PopoverContent>
        </Popover>

        {table.getColumn("type")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("type")}
            title="Type"
            options={propertyTypes}
            type="select"
          />
        )}
        {table.getColumn("by")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("by")}
            title="By"
            options={cities}
            type="select"
          />
        )}
        {table.getColumn("bta")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("bta")}
            title="BTA"
            type="number"
            options={conditions}
            formatter={formatters.sqm}
          />
        )}
        {table.getColumn("leieprisPerKvm")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("leieprisPerKvm")}
            title="Leiepris pr kvm"
            type="number"
            options={conditions}
            formatter={formatters.leieprisPerKvm}
          />
        )}
        {table.getColumn("yield")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("yield")}
            title="Yield"
            type="number"
            options={conditions}
            formatter={formatters.yield}
          />
        )}
        {table.getColumn("eiendomsnavn")?.getIsVisible() && (
          <Searchbar
            type="search"
            placeholder="Søk på eiendomsnavn..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:max-w-[250px] sm:[&>input]:h-[30px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="border border-warm-grey-2/20 px-2 font-semibold text-amber-700 sm:border-none sm:py-1 dark:border-warm-grey-1/20 dark:text-amber-500"
          >
            Tøm filter
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
        >
          <RiDownloadLine className="size-4 shrink-0" aria-hidden="true" />
          Eksporter
        </Button>
        <ViewOptions table={table} />
      </div>
    </div>
  )
}
