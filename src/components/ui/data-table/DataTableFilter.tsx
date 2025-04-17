"use client"

import {
  RiAddLine,
  RiArrowDownSLine,
  RiCornerDownRightLine,
} from "@remixicon/react"
import { Column } from "@tanstack/react-table"

import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Checkbox"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { cx, focusRing } from "@/lib/utils"
import React from "react"
import { useDebouncedCallback } from "use-debounce"

export type ConditionFilter = {
  condition: string
  value: [number | string, number | string]
}

type FilterType = "select" | "checkbox" | "number"

interface DataTableFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined
  title?: string
  options?: {
    label: string
    value: string
  }[]
  type?: FilterType
  formatter?: (value: any) => string
}

const ColumnFiltersLabel = ({
  columnFilterLabels,
  className,
}: {
  columnFilterLabels: string[] | undefined
  className?: string
}) => {
  if (!columnFilterLabels) return null

  if (columnFilterLabels.length < 3) {
    return (
      <span className={cx("truncate", className)}>
        {columnFilterLabels.map((value, index) => (
          <span
            key={value}
            className={cx("font-semibold text-amber-700 dark:text-amber-500")}
          >
            {value}
            {index < columnFilterLabels.length - 1 && ", "}
          </span>
        ))}
      </span>
    )
  }

  return (
    <>
      <span
        className={cx(
          "font-semibold text-amber-700 dark:text-amber-500",
          className,
        )}
      >
        {columnFilterLabels[0]} and {columnFilterLabels.length - 1} more
      </span>
    </>
  )
}

type FilterValues = string | string[] | ConditionFilter | undefined

export function DataTableFilter<TData, TValue>({
  column,
  title,
  options,
  type = "select",
  formatter = (value) => value.toString(),
}: DataTableFilterProps<TData, TValue>) {
  const columnFilters = column?.getFilterValue() as FilterValues

  const [selectedValues, setSelectedValues] =
    React.useState<FilterValues>(columnFilters)

  // Check if this is a yield column to handle percentage conversion
  const isYieldColumn = title?.toLowerCase() === "yield"

  // Store display values for yield inputs (showing percentages instead of decimals)
  const [displayValues, setDisplayValues] = React.useState<[string, string]>([
    "",
    "",
  ])

  // Debounce the filter changes for yield inputs so they update while typing
  const debouncedSetFilterValue = useDebouncedCallback(
    (value: FilterValues) => {
      if (isYieldColumn) {
        column?.setFilterValue(value)
      }
    },
    300,
  )

  // Check if this is a select filter that needs array handling
  const isSelectType = type === "select"

  // Initialize display values when filter values change
  React.useEffect(() => {
    if (
      isYieldColumn &&
      selectedValues &&
      typeof selectedValues === "object" &&
      "value" in selectedValues
    ) {
      const val0 = selectedValues.value[0]
        ? (parseFloat(selectedValues.value[0] as string) * 100).toString()
        : ""
      const val1 = selectedValues.value[1]
        ? (parseFloat(selectedValues.value[1] as string) * 100).toString()
        : ""
      setDisplayValues([val0, val1])
    }
  }, [isYieldColumn, selectedValues])

  const columnFilterLabels = React.useMemo(() => {
    if (!selectedValues) return undefined

    if (Array.isArray(selectedValues)) {
      return selectedValues.map((value) => formatter(value))
    }

    if (typeof selectedValues === "string") {
      return [formatter(selectedValues)]
    }

    if (typeof selectedValues === "object" && "condition" in selectedValues) {
      const condition = options?.find(
        (option) => option.value === selectedValues.condition,
      )?.label
      if (!condition) return undefined
      if (!selectedValues.value?.[0] && !selectedValues.value?.[1])
        return [`${condition}`]
      if (!selectedValues.value?.[1])
        return [`${condition} ${formatter(selectedValues.value?.[0])}`]
      return [
        `${condition} ${formatter(selectedValues.value?.[0])} and ${formatter(
          selectedValues.value?.[1],
        )}`,
      ]
    }

    return undefined
  }, [selectedValues, options, formatter])

  const getDisplayedFilter = () => {
    switch (type) {
      case "select":
        // For select filters, we store values as arrays but display single value in select
        const selectedValue =
          Array.isArray(selectedValues) && selectedValues.length > 0
            ? selectedValues[0]
            : ""

        return (
          <Select
            value={selectedValue}
            onValueChange={(value) => {
              // Convert single string value to array for "arrIncludesSome" filter compatibility
              const newValue = value ? [value] : []
              setSelectedValues(newValue)

              // Apply filter immediately
              column?.setFilterValue(newValue)
            }}
          >
            <SelectTrigger className="mt-2 sm:py-1">
              <SelectValue placeholder="Velg" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return (
          <div className="mt-2 space-y-2 overflow-y-auto sm:max-h-36">
            {options?.map((option) => {
              return (
                <div key={option.label} className="flex items-center gap-2">
                  <Checkbox
                    id={option.value}
                    checked={(selectedValues as string[])?.includes(
                      option.value,
                    )}
                    onCheckedChange={(checked) => {
                      setSelectedValues((prev) => {
                        if (checked) {
                          return prev
                            ? [...(prev as string[]), option.value]
                            : [option.value]
                        } else {
                          return (prev as string[]).filter(
                            (value) => value !== option.value,
                          )
                        }
                      })
                    }}
                  />
                  <Label
                    htmlFor={option.value}
                    className="text-base sm:text-sm"
                  >
                    {option.label}
                  </Label>
                </div>
              )
            })}
          </div>
        )
      case "number":
        const isBetween =
          (selectedValues as ConditionFilter)?.condition === "is-between"

        // If this is a yield filter and being called from the special yield case,
        // only return the input fields without the condition select
        if (isYieldColumn) {
          return (
            <div className="flex w-full items-center gap-2">
              <RiCornerDownRightLine
                className="size-4 shrink-0 text-warm-grey-2 dark:text-warm-grey-1"
                aria-hidden="true"
              />
              <Input
                disabled={!(selectedValues as ConditionFilter)?.condition}
                type="number"
                placeholder={isYieldColumn ? "0 %" : "0"}
                className="sm:[&>input]:py-1"
                value={
                  isYieldColumn
                    ? displayValues[0]
                    : (selectedValues as ConditionFilter)?.value?.[0]
                }
                onChange={(e) => {
                  let inputValue = e.target.value

                  if (isYieldColumn) {
                    // Update display value
                    setDisplayValues([inputValue, displayValues[1]])

                    // Convert percentage to decimal for internal value
                    if (inputValue) {
                      inputValue = (parseFloat(inputValue) / 100).toString()
                    }
                  }

                  const newValues: ConditionFilter = {
                    condition: (selectedValues as ConditionFilter)?.condition,
                    value: [
                      inputValue,
                      isBetween
                        ? (selectedValues as ConditionFilter)?.value?.[1]
                        : "",
                    ] as [string | number, string | number],
                  }

                  setSelectedValues(newValues)

                  // Apply filter immediately for yield values
                  if (isYieldColumn) {
                    debouncedSetFilterValue(newValues)
                  }
                }}
              />
              {(selectedValues as ConditionFilter)?.condition ===
                "is-between" && (
                <>
                  <span className="text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    og
                  </span>
                  <Input
                    disabled={!(selectedValues as ConditionFilter)?.condition}
                    type="number"
                    placeholder={isYieldColumn ? "0 %" : "0"}
                    className="sm:[&>input]:py-1"
                    value={
                      isYieldColumn
                        ? displayValues[1]
                        : (selectedValues as ConditionFilter)?.value?.[1]
                    }
                    onChange={(e) => {
                      let inputValue = e.target.value

                      if (isYieldColumn) {
                        // Update display value
                        setDisplayValues([displayValues[0], inputValue])

                        // Convert percentage to decimal for internal value
                        if (inputValue) {
                          inputValue = (parseFloat(inputValue) / 100).toString()
                        }
                      }

                      const newValues: ConditionFilter = {
                        condition: (selectedValues as ConditionFilter)
                          ?.condition,
                        value: [
                          (selectedValues as ConditionFilter)?.value?.[0],
                          inputValue,
                        ] as [string | number, string | number],
                      }

                      setSelectedValues(newValues)

                      // Apply filter immediately for yield values
                      if (isYieldColumn) {
                        debouncedSetFilterValue(newValues)
                      }
                    }}
                  />
                </>
              )}
            </div>
          )
        }

        // For non-yield number filters, show the full UI with condition select
        return (
          <div className="space-y-2">
            <Select
              value={(selectedValues as ConditionFilter)?.condition}
              onValueChange={(value) => {
                setSelectedValues((prev) => {
                  return {
                    condition: value,
                    value: [
                      value !== "" ? (prev as ConditionFilter)?.value?.[0] : "",
                      "",
                    ],
                  }
                })

                if (isYieldColumn) {
                  setDisplayValues(["", ""])
                }
              }}
            >
              <SelectTrigger className="mt-2 sm:py-1">
                <SelectValue placeholder="Velg betingelse" />
              </SelectTrigger>
              <SelectContent>
                {options?.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex w-full items-center gap-2">
              <RiCornerDownRightLine
                className="size-4 shrink-0 text-warm-grey-2 dark:text-warm-grey-1"
                aria-hidden="true"
              />
              <Input
                disabled={!(selectedValues as ConditionFilter)?.condition}
                type="number"
                placeholder="0"
                className="sm:[&>input]:py-1"
                value={(selectedValues as ConditionFilter)?.value?.[0]}
                onChange={(e) => {
                  const inputValue = e.target.value

                  const newValues: ConditionFilter = {
                    condition: (selectedValues as ConditionFilter)?.condition,
                    value: [
                      inputValue,
                      isBetween
                        ? (selectedValues as ConditionFilter)?.value?.[1]
                        : "",
                    ] as [string | number, string | number],
                  }

                  setSelectedValues(newValues)
                }}
              />
              {(selectedValues as ConditionFilter)?.condition ===
                "is-between" && (
                <>
                  <span className="text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    og
                  </span>
                  <Input
                    disabled={!(selectedValues as ConditionFilter)?.condition}
                    type="number"
                    placeholder="0"
                    className="sm:[&>input]:py-1"
                    value={(selectedValues as ConditionFilter)?.value?.[1]}
                    onChange={(e) => {
                      const inputValue = e.target.value

                      const newValues: ConditionFilter = {
                        condition: (selectedValues as ConditionFilter)
                          ?.condition,
                        value: [
                          (selectedValues as ConditionFilter)?.value?.[0],
                          inputValue,
                        ] as [string | number, string | number],
                      }

                      setSelectedValues(newValues)
                    }}
                  />
                </>
              )}
            </div>
          </div>
        )
    }
  }

  // Also update the condition selection to apply filter immediately
  const handleConditionChange = (value: string) => {
    const newValues: ConditionFilter = {
      condition: value,
      value: [
        value !== "" ? (selectedValues as ConditionFilter)?.value?.[0] : "",
        "",
      ] as [string | number, string | number],
    }

    setSelectedValues(newValues)

    if (isYieldColumn) {
      setDisplayValues(["", ""])
      debouncedSetFilterValue(newValues)
    }
  }

  React.useEffect(() => {
    setSelectedValues(columnFilters)
  }, [columnFilters])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cx(
            "flex w-full items-center gap-x-1.5 whitespace-nowrap rounded-md border border-warm-grey-2/20 px-2 py-1.5 font-medium text-warm-grey hover:bg-warm-white/80 sm:w-fit sm:text-xs dark:border-warm-grey-1/20 dark:text-warm-grey-1 hover:dark:bg-warm-grey/60",
            selectedValues &&
              ((typeof selectedValues === "object" &&
                "condition" in selectedValues &&
                selectedValues.condition !== "") ||
                (typeof selectedValues === "string" && selectedValues !== "") ||
                (Array.isArray(selectedValues) && selectedValues.length > 0))
              ? ""
              : "border-dashed",
            focusRing,
          )}
        >
          <span
            aria-hidden="true"
            onClick={(e) => {
              if (selectedValues) {
                e.stopPropagation()
                column?.setFilterValue("")
                setSelectedValues("")
              }
            }}
          >
            <RiAddLine
              className={cx(
                "-ml-px size-5 shrink-0 transition sm:size-4",
                selectedValues && "rotate-45 hover:text-red-500",
              )}
              aria-hidden="true"
            />
          </span>
          {/* differentiation below for better mobile view */}
          {columnFilterLabels && columnFilterLabels.length > 0 ? (
            <span>{title}</span>
          ) : (
            <span className="w-full text-left sm:w-fit">{title}</span>
          )}
          {columnFilterLabels && columnFilterLabels.length > 0 && (
            <span
              className="h-4 w-px bg-warm-grey-2/20 dark:bg-warm-grey-1/20"
              aria-hidden="true"
            />
          )}
          <ColumnFiltersLabel
            columnFilterLabels={columnFilterLabels}
            className="w-full text-left sm:w-fit"
          />
          <RiArrowDownSLine
            className="size-5 shrink-0 text-warm-grey-2 dark:text-warm-grey-1"
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={7}
        className="min-w-[calc(var(--radix-popover-trigger-width))] max-w-[calc(var(--radix-popover-trigger-width))] sm:min-w-56 sm:max-w-56"
        onInteractOutside={() => {
          if (
            !columnFilters ||
            (typeof columnFilters === "string" && columnFilters === "") ||
            (Array.isArray(columnFilters) && columnFilters.length === 0) ||
            (typeof columnFilters === "object" &&
              "condition" in columnFilters &&
              columnFilters.condition === "")
          ) {
            column?.setFilterValue("")
            setSelectedValues("")
          }
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            column?.setFilterValue(selectedValues)
          }}
        >
          <div className="space-y-2">
            <div>
              <Label className="text-base font-medium sm:text-sm">
                Filtrer etter {title}
              </Label>
              {type === "number" && isYieldColumn ? (
                // For yield numbers, replace the entire filter display with one that updates immediately
                <div className="space-y-2">
                  <Select
                    value={(selectedValues as ConditionFilter)?.condition}
                    onValueChange={handleConditionChange}
                  >
                    <SelectTrigger className="mt-2 sm:py-1">
                      <SelectValue placeholder="Velg betingelse" />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getDisplayedFilter()}
                </div>
              ) : (
                getDisplayedFilter()
              )}
            </div>

            {/* Only show buttons for non-yield numeric filters */}
            {(!isYieldColumn || type !== "number") && (
              <PopoverClose className="w-full" asChild>
                <Button type="submit" className="w-full sm:py-1">
                  Bruk
                </Button>
              </PopoverClose>
            )}

            {columnFilterLabels && columnFilterLabels.length > 0 && (
              <Button
                variant="secondary"
                className="w-full sm:py-1"
                type="button"
                onClick={() => {
                  column?.setFilterValue("")
                  setSelectedValues(
                    type === "checkbox"
                      ? []
                      : type === "number"
                        ? { condition: "", value: ["", ""] }
                        : type === "select"
                          ? []
                          : "",
                  )

                  if (isYieldColumn) {
                    setDisplayValues(["", ""])
                  }
                }}
              >
                Nullstill
              </Button>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
