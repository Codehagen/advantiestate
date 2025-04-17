"use client"

import { Badge, BadgeProps } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import {
  cities,
  leieprisVariants,
  propertyTypes,
  yieldVariants,
} from "@/components/data/data"
import { Usage } from "@/components/data/schema"
import { formatters } from "@/lib/utils"
import { RiArrowDownSLine, RiArrowUpSLine, RiEqualLine } from "@remixicon/react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { ConditionFilter } from "./DataTableFilter"
import { DataTableRowActions } from "./DataTableRowActions"

const columnHelper = createColumnHelper<Usage>()

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Select",
    },
  }),
  columnHelper.accessor("eiendomsnavn", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Eiendomsnavn" />
    ),
    cell: ({ row, getValue }) => {
      const propertyName = getValue()
      // We're using stopPropagation to prevent the row selection when clicking the link
      return (
        <Link
          href={`/propdock/eiendom?name=${encodeURIComponent(String(propertyName))}`}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {propertyName}
        </Link>
      )
    },
    enableSorting: true,
    enableHiding: false,
    meta: {
      className: "text-left",
      displayName: "Eiendomsnavn",
    },
  }),
  columnHelper.accessor("type", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    enableSorting: true,
    meta: {
      className: "text-left",
      displayName: "Type",
    },
    cell: ({ row }) => {
      const type = propertyTypes.find(
        (item) => item.value === row.getValue("type"),
      )

      if (!type) {
        return row.getValue("type")
      }

      return (
        <Badge variant={type.variant as BadgeProps["variant"]} size="table">
          {type.label}
        </Badge>
      )
    },
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("by", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="By" />
    ),
    enableSorting: true,
    meta: {
      className: "text-left",
      displayName: "By",
    },
    cell: ({ row }) => {
      const cityValue = row.getValue("by") as string
      const city = cities.find((item) => item.value === cityValue)

      if (!city) {
        return cityValue
      }

      return <span className="font-medium">{city.label}</span>
    },
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("byggeaar", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Byggeår" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Byggeår",
    },
    cell: ({ getValue }) => {
      return (
        <span className="font-medium">{formatters.integer(getValue())}</span>
      )
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number
      const [min, max] = filterValue.value as [number, number]

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min
        case "is-between":
          return value >= min && value <= max
        case "is-greater-than":
          return value > min
        case "is-less-than":
          return value < min
        default:
          return true
      }
    },
  }),
  columnHelper.accessor("bta", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="BTA" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "BTA",
    },
    cell: ({ getValue }) => {
      return <span className="font-medium">{formatters.sqm(getValue())}</span>
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number
      const [min, max] = filterValue.value as [number, number]

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min
        case "is-between":
          return value >= min && value <= max
        case "is-greater-than":
          return value > min
        case "is-less-than":
          return value < min
        default:
          return true
      }
    },
  }),
  columnHelper.accessor("leieprisPerKvm", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leiepris pr kvm" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Leiepris pr kvm",
    },
    cell: ({ row }) => {
      const value = row.getValue("leieprisPerKvm") as number
      const leieprisVariant = leieprisVariants.find(
        (item) => value >= item.min && value <= item.max,
      )

      if (!leieprisVariant) {
        return (
          <span className="font-medium">
            {formatters.leieprisPerKvm(value)}{" "}
            <span className="text-muted-foreground text-xs font-normal">
              pr m²
            </span>
          </span>
        )
      }

      return (
        <div className="flex items-center justify-end gap-1">
          <Badge
            variant={leieprisVariant.variant as BadgeProps["variant"]}
            size="table"
          >
            {formatters.leieprisPerKvm(value)}
          </Badge>
          <span className="text-muted-foreground text-xs font-normal">
            pr m²
          </span>
        </div>
      )
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number
      const [min, max] = filterValue.value as [number, number]

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min
        case "is-between":
          return value >= min && value <= max
        case "is-greater-than":
          return value > min
        case "is-less-than":
          return value < min
        default:
          return true
      }
    },
  }),
  columnHelper.accessor("yield", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yield" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Yield",
    },
    cell: ({ row }) => {
      const value = row.getValue("yield") as number
      const yieldVariant = yieldVariants.find(
        (item) => value >= item.min && value <= item.max,
      )

      if (!yieldVariant) {
        return <span className="font-medium">{formatters.yield(value)}</span>
      }

      return (
        <Badge
          variant={yieldVariant.variant as BadgeProps["variant"]}
          size="table"
        >
          {formatters.yield(value)}
        </Badge>
      )
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number
      const [min, max] = filterValue.value as [number, number]

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min
        case "is-between":
          return value >= min && value <= max
        case "is-greater-than":
          return value > min
        case "is-less-than":
          return value < min
        default:
          return true
      }
    },
  }),
  columnHelper.accessor("inntekter", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inntekter" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Inntekter",
    },
    cell: ({ getValue }) => {
      return (
        <span className="font-medium">
          {formatters.nokCurrency(getValue())}
        </span>
      )
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number
      const [min, max] = filterValue.value as [number, number]

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min
        case "is-between":
          return value >= min && value <= max
        case "is-greater-than":
          return value > min
        case "is-less-than":
          return value < min
        default:
          return true
      }
    },
  }),
  columnHelper.accessor("kostnader", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kostnader" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Kostnader",
    },
    cell: ({ getValue }) => {
      return (
        <span className="font-medium">
          {formatters.nokCurrency(getValue())}
        </span>
      )
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number
      const [min, max] = filterValue.value as [number, number]

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min
        case "is-between":
          return value >= min && value <= max
        case "is-greater-than":
          return value > min
        case "is-less-than":
          return value < min
        default:
          return true
      }
    },
  }),
  columnHelper.accessor("antallLeietakere", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leietakere" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Leietakere",
    },
    cell: ({ row }) => {
      const currentCount = row.getValue("antallLeietakere") as number
      const previousCount = row.original.antallLeietakereTidligere

      const trend = currentCount - previousCount

      return (
        <div className="flex items-center justify-end space-x-1">
          <span className="font-medium">
            {formatters.integer(currentCount)}
          </span>
          {trend > 0 && (
            <span className="text-emerald-500">
              <RiArrowUpSLine className="size-4" />
            </span>
          )}
          {trend < 0 && (
            <span className="text-red-500">
              <RiArrowDownSLine className="size-4" />
            </span>
          )}
          {trend === 0 && (
            <span className="text-amber-500">
              <RiEqualLine className="size-4" />
            </span>
          )}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const value = row.getValue(columnId) as number
      const [min, max] = filterValue.value as [number, number]

      switch (filterValue.condition) {
        case "is-equal-to":
          return value == min
        case "is-between":
          return value >= min && value <= max
        case "is-greater-than":
          return value > min
        case "is-less-than":
          return value < min
        case "is-greater-than-or-equal":
          // Special case for tenant stability filter
          // Check if current tenants >= previous tenants (stable or growing)
          const previousCount = row.original.antallLeietakereTidligere
          return value >= previousCount
        default:
          return true
      }
    },
  }),
  columnHelper.display({
    id: "edit",
    header: "Rediger",
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "text-right",
      displayName: "Rediger",
    },
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }),
] as ColumnDef<Usage>[]
