import { z } from "zod"

export const propertySchema = z.object({
  property_type: z.string(),
  property_label: z.string(),
  total_sqft: z.number().int().positive(),
  rented_sqft: z.number().int().nonnegative(),
  vacant_sqft: z.number().int().nonnegative(),
  stable_income_sqft: z.number().int().nonnegative(),
  variable_income_sqft: z.number().int().nonnegative(),
})

export const schemaPropertyStats = z.object({
  id: z.string().uuid(),
  total_sqft: z.number().int().positive(),
  property_stats: z.array(propertySchema),
})

export type PropertyStats = z.infer<typeof schemaPropertyStats>
export type PropertyTypeStats = z.infer<typeof propertySchema>

export const propertyTypes: { value: string; label: string }[] = [
  {
    value: "office",
    label: "Kontorlokaler",
  },
  {
    value: "retail",
    label: "Butikklokaler",
  },
  {
    value: "industrial",
    label: "Industrilokaler",
  },
  {
    value: "mixed-use",
    label: "Kombinasjonseiendom",
  },
  {
    value: "flex-space",
    label: "Fleksibelt areal",
  },
  {
    value: "warehouse",
    label: "Lager",
  },
]
