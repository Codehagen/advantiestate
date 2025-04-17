"use client"

import { Badge, BadgeProps } from "@/components/Badge"
import { Button } from "@/components/Button"
import { cities, propertyTypes } from "@/components/data/data"
import { Usage } from "@/components/data/schema"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { formatters } from "@/lib/utils"
import {
  RiArrowDownLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiBuildingLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTeamLine,
} from "@remixicon/react"

interface PropertyComparisonDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  properties: Usage[] | undefined
}

// Get variant for comparisons based on relative value
function getComparisonVariant(
  value: number,
  avg: number,
  isHigherBetter: boolean = true,
): BadgeProps["variant"] {
  const percentDiff = ((value - avg) / avg) * 100

  if (Math.abs(percentDiff) < 5) return "default" // Within 5% of average

  if (isHigherBetter) {
    return percentDiff > 15
      ? "success"
      : percentDiff < -15
        ? "error"
        : "default"
  } else {
    return percentDiff < -15
      ? "success"
      : percentDiff > 15
        ? "error"
        : "default"
  }
}

// Get icon for trend indicators
function getTrendIcon(
  value: number,
  avg: number,
  isHigherBetter: boolean = true,
) {
  const percentDiff = ((value - avg) / avg) * 100

  if (Math.abs(percentDiff) < 5) return <RiArrowRightLine className="size-4" /> // Within 5% of average

  if (isHigherBetter) {
    return percentDiff > 0 ? (
      <RiArrowUpLine className="size-4 text-green-600 dark:text-green-500" />
    ) : (
      <RiArrowDownLine className="size-4 text-red-600 dark:text-red-500" />
    )
  } else {
    return percentDiff < 0 ? (
      <RiArrowUpLine className="size-4 text-green-600 dark:text-green-500" />
    ) : (
      <RiArrowDownLine className="size-4 text-red-600 dark:text-red-500" />
    )
  }
}

export function PropertyComparisonDrawer({
  open,
  onOpenChange,
  properties = [],
}: PropertyComparisonDrawerProps) {
  if (!properties || properties.length < 2) return null

  // Calculate averages for key metrics
  const avgYield =
    properties.reduce((sum, prop) => sum + prop.yield, 0) / properties.length
  const avgRentPerSqm =
    properties.reduce((sum, prop) => sum + prop.leieprisPerKvm, 0) /
    properties.length
  const avgBta =
    properties.reduce((sum, prop) => sum + prop.bta, 0) / properties.length
  const avgNetIncome =
    properties.reduce(
      (sum, prop) => sum + (prop.inntekter - prop.kostnader),
      0,
    ) / properties.length
  const avgTenants =
    properties.reduce((sum, prop) => sum + prop.antallLeietakere, 0) /
    properties.length

  // Calculate tenant change trends
  const tenantTrends = properties.map((prop) => {
    const diff = prop.antallLeietakere - prop.antallLeietakereTidligere
    return {
      diff,
      percentChange: prop.antallLeietakereTidligere
        ? (diff / prop.antallLeietakereTidligere) * 100
        : 0,
    }
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-x-hidden sm:max-w-3xl dark:bg-warm-grey">
        <DrawerHeader className="sticky top-0 z-10 w-full bg-warm-white dark:bg-warm-grey">
          <DrawerTitle className="flex w-full items-center justify-between">
            <span className="text-xl font-semibold">
              Sammenligning av eiendommer
            </span>
            <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {properties.length} eiendommer valgt
            </span>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="overflow-x-auto overflow-y-auto">
          <Tabs defaultValue="summary">
            <TabsList className="sticky top-0 z-10 mb-4 bg-warm-white dark:bg-warm-grey">
              <TabsTrigger value="summary" className="px-4">
                Oppsummering
              </TabsTrigger>
              <TabsTrigger value="basic" className="px-4">
                Grunnleggende
              </TabsTrigger>
              <TabsTrigger value="economy" className="px-4">
                Økonomi
              </TabsTrigger>
              <TabsTrigger value="tenants" className="px-4">
                Leietakere
              </TabsTrigger>
            </TabsList>

            {/* New Summary Tab */}
            <TabsContent value="summary" className="min-w-max">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg border border-warm-grey-2/20 dark:border-warm-grey-1/20"
                  >
                    <div className="border-b border-warm-grey-2/20 bg-warm-white/50 p-3 dark:border-warm-grey-1/20 dark:bg-warm-grey-3/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="truncate font-semibold">
                            {property.eiendomsnavn}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-warm-grey-2 dark:text-warm-grey-1">
                            <RiMapPinLine className="mr-1 size-3.5 flex-shrink-0" />
                            <span>
                              {cities.find((c) => c.value === property.by)
                                ?.label || property.by}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            propertyTypes.find((t) => t.value === property.type)
                              ?.variant as BadgeProps["variant"]
                          }
                          size="table"
                        >
                          {propertyTypes.find((t) => t.value === property.type)
                            ?.label || property.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 p-3">
                      {/* Key metrics with comparison indicators */}
                      <div className="flex items-center justify-between border-b border-warm-grey-2/10 py-1 dark:border-warm-grey-1/10">
                        <div className="flex items-center">
                          <RiMoneyDollarCircleLine className="mr-2 size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                          <span className="text-sm">Yield</span>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            variant={getComparisonVariant(
                              property.yield,
                              avgYield,
                            )}
                            className="mr-2"
                          >
                            {formatters.yield(property.yield)}
                          </Badge>
                          {getTrendIcon(property.yield, avgYield)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-warm-grey-2/10 py-1 dark:border-warm-grey-1/10">
                        <div className="flex items-center">
                          <RiMoneyDollarCircleLine className="mr-2 size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                          <span className="text-sm">Leiepris pr kvm</span>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            variant={getComparisonVariant(
                              property.leieprisPerKvm,
                              avgRentPerSqm,
                            )}
                            className="mr-2"
                          >
                            {formatters.leieprisPerKvm(property.leieprisPerKvm)}
                          </Badge>
                          {getTrendIcon(property.leieprisPerKvm, avgRentPerSqm)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-warm-grey-2/10 py-1 dark:border-warm-grey-1/10">
                        <div className="flex items-center">
                          <RiBuildingLine className="mr-2 size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                          <span className="text-sm">BTA</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">
                            {formatters.sqm(property.bta)}
                          </span>
                          {getTrendIcon(property.bta, avgBta)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-warm-grey-2/10 py-1 dark:border-warm-grey-1/10">
                        <div className="flex items-center">
                          <RiMoneyDollarCircleLine className="mr-2 size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                          <span className="text-sm">Netto inntekt</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">
                            {formatters.nokCurrency(
                              property.inntekter - property.kostnader,
                            )}
                          </span>
                          {getTrendIcon(
                            property.inntekter - property.kostnader,
                            avgNetIncome,
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <RiTeamLine className="mr-2 size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                          <span className="text-sm">Leietakere</span>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            variant={
                              property.antallLeietakere >
                              property.antallLeietakereTidligere
                                ? "success"
                                : property.antallLeietakere <
                                    property.antallLeietakereTidligere
                                  ? "error"
                                  : "default"
                            }
                            className="mr-2"
                          >
                            {property.antallLeietakere}
                          </Badge>
                          {property.antallLeietakere >
                          property.antallLeietakereTidligere ? (
                            <RiArrowUpLine className="size-4 text-green-600 dark:text-green-500" />
                          ) : property.antallLeietakere <
                            property.antallLeietakereTidligere ? (
                            <RiArrowDownLine className="size-4 text-red-600 dark:text-red-500" />
                          ) : (
                            <RiArrowRightLine className="size-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-warm-grey-2/20 bg-warm-white/30 p-3 dark:border-warm-grey-1/20 dark:bg-warm-grey-3/20">
                      <Button
                        variant="secondary"
                        className="w-full justify-center text-sm"
                        onClick={() => {
                          // Future implementation: Navigate to property details
                          console.log(
                            `View details for ${property.eiendomsnavn}`,
                          )
                        }}
                      >
                        Se detaljer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="basic" className="min-w-max">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr className="bg-warm-white/30 dark:bg-warm-grey-3/50">
                      <th className="border-b border-warm-grey-2/20 p-2 text-left dark:border-warm-grey-1/20"></th>
                      {properties.map((property, index) => (
                        <th
                          key={index}
                          className="border-b border-warm-grey-2/20 p-2 text-left dark:border-warm-grey-1/20"
                        >
                          <div className="font-semibold">
                            {property.eiendomsnavn}
                          </div>
                          <div className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
                            {cities.find((c) => c.value === property.by)
                              ?.label || property.by}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Type
                      </td>
                      {properties.map((property, index) => {
                        const type = propertyTypes.find(
                          (t) => t.value === property.type,
                        )
                        return (
                          <td
                            key={index}
                            className="border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20"
                          >
                            <Badge
                              variant={type?.variant as BadgeProps["variant"]}
                              size="table"
                            >
                              {type?.label || property.type}
                            </Badge>
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Byggeår
                      </td>
                      {properties.map((property, index) => (
                        <td
                          key={index}
                          className="border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20"
                        >
                          {formatters.integer(property.byggeaar)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        BTA
                      </td>
                      {properties.map((property, index) => {
                        const isHigher = property.bta > avgBta
                        const isLower = property.bta < avgBta
                        const diffPercent = Math.abs(
                          ((property.bta - avgBta) / avgBta) * 100,
                        )
                        const showHighlight = diffPercent > 15

                        return (
                          <td
                            key={index}
                            className={`border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20 ${
                              showHighlight && isHigher
                                ? "bg-green-50/50 dark:bg-green-900/10"
                                : showHighlight && isLower
                                  ? "bg-red-50/50 dark:bg-red-900/10"
                                  : ""
                            }`}
                          >
                            {formatters.sqm(property.bta)}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="economy" className="min-w-max">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr className="bg-warm-white/30 dark:bg-warm-grey-3/50">
                      <th className="border-b border-warm-grey-2/20 p-2 text-left dark:border-warm-grey-1/20"></th>
                      {properties.map((property, index) => (
                        <th
                          key={index}
                          className="border-b border-warm-grey-2/20 p-2 text-left dark:border-warm-grey-1/20"
                        >
                          <div className="font-semibold">
                            {property.eiendomsnavn}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Inntekter
                      </td>
                      {properties.map((property, index) => {
                        const avgIncome =
                          properties.reduce(
                            (sum, prop) => sum + prop.inntekter,
                            0,
                          ) / properties.length
                        const isHigher = property.inntekter > avgIncome
                        const isLower = property.inntekter < avgIncome
                        const diffPercent = Math.abs(
                          ((property.inntekter - avgIncome) / avgIncome) * 100,
                        )
                        const showHighlight = diffPercent > 15

                        return (
                          <td
                            key={index}
                            className={`border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20 ${
                              showHighlight && isHigher
                                ? "bg-green-50/50 dark:bg-green-900/10"
                                : showHighlight && isLower
                                  ? "bg-red-50/50 dark:bg-red-900/10"
                                  : ""
                            }`}
                          >
                            {formatters.nokCurrency(property.inntekter)}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Kostnader
                      </td>
                      {properties.map((property, index) => {
                        const avgCosts =
                          properties.reduce(
                            (sum, prop) => sum + prop.kostnader,
                            0,
                          ) / properties.length
                        const isHigher = property.kostnader > avgCosts
                        const isLower = property.kostnader < avgCosts
                        const diffPercent = Math.abs(
                          ((property.kostnader - avgCosts) / avgCosts) * 100,
                        )
                        const showHighlight = diffPercent > 15

                        return (
                          <td
                            key={index}
                            className={`border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20 ${
                              showHighlight && isLower
                                ? "bg-green-50/50 dark:bg-green-900/10"
                                : showHighlight && isHigher
                                  ? "bg-red-50/50 dark:bg-red-900/10"
                                  : ""
                            }`}
                          >
                            {formatters.nokCurrency(property.kostnader)}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Netto
                      </td>
                      {properties.map((property, index) => {
                        const netIncome =
                          property.inntekter - property.kostnader
                        const isHigher = netIncome > avgNetIncome
                        const isLower = netIncome < avgNetIncome
                        const diffPercent = Math.abs(
                          ((netIncome - avgNetIncome) / avgNetIncome) * 100,
                        )
                        const showHighlight = diffPercent > 15

                        return (
                          <td
                            key={index}
                            className={`border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20 ${
                              showHighlight && isHigher
                                ? "bg-green-50/50 dark:bg-green-900/10"
                                : showHighlight && isLower
                                  ? "bg-red-50/50 dark:bg-red-900/10"
                                  : ""
                            }`}
                          >
                            {formatters.nokCurrency(netIncome)}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Yield
                      </td>
                      {properties.map((property, index) => {
                        const isHigher = property.yield > avgYield
                        const isLower = property.yield < avgYield
                        const diffPercent = Math.abs(
                          ((property.yield - avgYield) / avgYield) * 100,
                        )
                        const showHighlight = diffPercent > 15

                        return (
                          <td
                            key={index}
                            className={`border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20 ${
                              showHighlight && isHigher
                                ? "bg-green-50/50 dark:bg-green-900/10"
                                : showHighlight && isLower
                                  ? "bg-red-50/50 dark:bg-red-900/10"
                                  : ""
                            }`}
                          >
                            <Badge
                              variant={
                                isHigher && showHighlight
                                  ? "success"
                                  : isLower && showHighlight
                                    ? "error"
                                    : "default"
                              }
                            >
                              {formatters.yield(property.yield)}
                            </Badge>
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Leiepris pr kvm
                      </td>
                      {properties.map((property, index) => {
                        const isHigher = property.leieprisPerKvm > avgRentPerSqm
                        const isLower = property.leieprisPerKvm < avgRentPerSqm
                        const diffPercent = Math.abs(
                          ((property.leieprisPerKvm - avgRentPerSqm) /
                            avgRentPerSqm) *
                            100,
                        )
                        const showHighlight = diffPercent > 15

                        return (
                          <td
                            key={index}
                            className={`border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20 ${
                              showHighlight && isHigher
                                ? "bg-green-50/50 dark:bg-green-900/10"
                                : showHighlight && isLower
                                  ? "bg-red-50/50 dark:bg-red-900/10"
                                  : ""
                            }`}
                          >
                            <Badge
                              variant={
                                isHigher && showHighlight
                                  ? "success"
                                  : isLower && showHighlight
                                    ? "error"
                                    : "default"
                              }
                            >
                              {formatters.leieprisPerKvm(
                                property.leieprisPerKvm,
                              )}
                            </Badge>{" "}
                            <span className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
                              pr m²
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="tenants" className="min-w-max">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr className="bg-warm-white/30 dark:bg-warm-grey-3/50">
                      <th className="border-b border-warm-grey-2/20 p-2 text-left dark:border-warm-grey-1/20"></th>
                      {properties.map((property, index) => (
                        <th
                          key={index}
                          className="border-b border-warm-grey-2/20 p-2 text-left dark:border-warm-grey-1/20"
                        >
                          <div className="font-semibold">
                            {property.eiendomsnavn}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Antall leietakere
                      </td>
                      {properties.map((property, index) => {
                        const isHigher = property.antallLeietakere > avgTenants
                        const isLower = property.antallLeietakere < avgTenants
                        const diffPercent = Math.abs(
                          ((property.antallLeietakere - avgTenants) /
                            avgTenants) *
                            100,
                        )
                        const showHighlight = diffPercent > 15

                        return (
                          <td
                            key={index}
                            className={`border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20 ${
                              showHighlight && isHigher
                                ? "bg-green-50/50 dark:bg-green-900/10"
                                : showHighlight && isLower
                                  ? "bg-red-50/50 dark:bg-red-900/10"
                                  : ""
                            }`}
                          >
                            {property.antallLeietakere}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Tidligere antall
                      </td>
                      {properties.map((property, index) => (
                        <td
                          key={index}
                          className="border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20"
                        >
                          {property.antallLeietakereTidligere}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border-b border-warm-grey-2/20 p-2 text-left font-medium dark:border-warm-grey-1/20">
                        Endring
                      </td>
                      {properties.map((property, index) => {
                        const diff =
                          property.antallLeietakere -
                          property.antallLeietakereTidligere
                        const percentChange = property.antallLeietakereTidligere
                          ? (diff / property.antallLeietakereTidligere) * 100
                          : 0

                        return (
                          <td
                            key={index}
                            className="border-b border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20"
                          >
                            <div className="flex items-center">
                              <Badge
                                variant={
                                  diff > 0
                                    ? "success"
                                    : diff < 0
                                      ? "error"
                                      : "default"
                                }
                              >
                                {diff > 0 ? "+" : ""}
                                {diff} ({Math.round(percentChange)}%)
                              </Badge>
                              {diff > 0 ? (
                                <RiArrowUpLine className="ml-2 size-4 text-green-600 dark:text-green-500" />
                              ) : diff < 0 ? (
                                <RiArrowDownLine className="ml-2 size-4 text-red-600 dark:text-red-500" />
                              ) : (
                                <RiArrowRightLine className="ml-2 size-4" />
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </DrawerBody>
        <DrawerFooter className="flex justify-between">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Lukk
          </Button>
          <Button>Eksporter til PDF</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
