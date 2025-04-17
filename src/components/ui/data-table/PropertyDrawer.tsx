"use client"

import { Badge, BadgeProps } from "@/components/Badge"
import { Button } from "@/components/Button"
import { cities, propertyTypes } from "@/components/data/data"
import { Usage } from "@/components/data/schema"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { formatters } from "@/lib/utils"

interface PropertyDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Usage | undefined
}

export function PropertyDrawer({
  open,
  onOpenChange,
  property,
}: PropertyDrawerProps) {
  if (!property) return null

  // Find the property type and city for display
  const type = propertyTypes.find((item) => item.value === property.type)

  const city = cities.find((item) => item.value === property.by)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-x-hidden sm:max-w-xl dark:bg-warm-grey">
        <DrawerHeader className="w-full">
          <DrawerTitle className="flex w-full items-center justify-between">
            <span className="text-xl font-semibold">
              {property.eiendomsnavn}
            </span>
            <Badge variant={type?.variant as BadgeProps["variant"]}>
              {type?.label || property.type}
            </Badge>
          </DrawerTitle>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-left text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {city?.label || property.by}, Byggeår: {property.byggeaar}
            </span>
            <span className="font-medium">{formatters.sqm(property.bta)}</span>
          </div>
        </DrawerHeader>
        <DrawerBody className="overflow-y-auto">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details" className="px-4">
                Detaljer
              </TabsTrigger>
              <TabsTrigger value="economy" className="px-4">
                Økonomi
              </TabsTrigger>
              <TabsTrigger value="tenants" className="px-4">
                Leietakere
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md bg-warm-white/50 p-4 shadow-sm ring-1 ring-warm-grey-2/20 dark:bg-warm-grey-3 dark:ring-warm-grey-1/20">
                  <h3 className="mb-2 font-medium">Eiendomsinformasjon</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-warm-grey-2 dark:text-warm-grey-1">
                      Type:
                    </div>
                    <div>{type?.label || property.type}</div>
                    <div className="text-warm-grey-2 dark:text-warm-grey-1">
                      By:
                    </div>
                    <div>{city?.label || property.by}</div>
                    <div className="text-warm-grey-2 dark:text-warm-grey-1">
                      Byggeår:
                    </div>
                    <div>{property.byggeaar}</div>
                    <div className="text-warm-grey-2 dark:text-warm-grey-1">
                      BTA:
                    </div>
                    <div>{formatters.sqm(property.bta)}</div>
                  </div>
                </div>

                <div className="rounded-md bg-warm-white/50 p-4 shadow-sm ring-1 ring-warm-grey-2/20 dark:bg-warm-grey-3 dark:ring-warm-grey-1/20">
                  <h3 className="mb-2 font-medium">Nøkkeltall</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-warm-grey-2 dark:text-warm-grey-1">
                      Yield:
                    </div>
                    <div>{formatters.yield(property.yield)}</div>
                    <div className="text-warm-grey-2 dark:text-warm-grey-1">
                      Leiepris pr kvm:
                    </div>
                    <div>
                      {formatters.leieprisPerKvm(property.leieprisPerKvm)} pr m²
                    </div>
                    <div className="text-warm-grey-2 dark:text-warm-grey-1">
                      Leietakere:
                    </div>
                    <div>{formatters.integer(property.antallLeietakere)}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="economy" className="space-y-6">
              <div className="rounded-md bg-warm-white/50 p-4 shadow-sm ring-1 ring-warm-grey-2/20 dark:bg-warm-grey-3 dark:ring-warm-grey-1/20">
                <h3 className="mb-2 font-medium">Økonomiske detaljer</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    Inntekter:
                  </div>
                  <div>{formatters.nokCurrency(property.inntekter)}</div>
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    Kostnader:
                  </div>
                  <div>{formatters.nokCurrency(property.kostnader)}</div>
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    Netto:
                  </div>
                  <div>
                    {formatters.nokCurrency(
                      property.inntekter - property.kostnader,
                    )}
                  </div>
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    Yield:
                  </div>
                  <div>{formatters.yield(property.yield)}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tenants" className="space-y-6">
              <div className="rounded-md bg-warm-white/50 p-4 shadow-sm ring-1 ring-warm-grey-2/20 dark:bg-warm-grey-3 dark:ring-warm-grey-1/20">
                <h3 className="mb-2 font-medium">Leietakeroversikt</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    Antall leietakere:
                  </div>
                  <div>{formatters.integer(property.antallLeietakere)}</div>
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    Tidligere antall:
                  </div>
                  <div>
                    {formatters.integer(property.antallLeietakereTidligere)}
                  </div>
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    Trend:
                  </div>
                  <div>
                    {property.antallLeietakere >
                    property.antallLeietakereTidligere
                      ? "Økende +" +
                        (property.antallLeietakere -
                          property.antallLeietakereTidligere)
                      : property.antallLeietakere <
                          property.antallLeietakereTidligere
                        ? "Synkende -" +
                          (property.antallLeietakereTidligere -
                            property.antallLeietakere)
                        : "Stabil"}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DrawerBody>
        <DrawerFooter className="gap-2">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full">
              Lukk
            </Button>
          </DrawerClose>
          <Button className="w-full">Rediger</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
