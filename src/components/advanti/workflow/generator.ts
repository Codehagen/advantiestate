import { fakerDE_CH as faker } from "@faker-js/faker"
import fs from "fs"
import path from "path"
import { propertyTypes } from "./schema"

const generatePropertyStats = (totalSqft: number) => {
  // Distribute total square footage across property types with some randomization
  const propertyData = propertyTypes.map((prop) => {
    // Allocate a portion of total square footage to each property type
    const propTotalSqft = Math.round(
      totalSqft * faker.number.float({ min: 0.1, max: 0.25 }),
    )

    const rentedSqft = Math.round(
      propTotalSqft *
        faker.number.float({
          min: 0.65,
          max: 0.95,
        }),
    )

    const vacantSqft = propTotalSqft - rentedSqft

    const stableIncomeSqft = Math.round(
      rentedSqft *
        faker.number.float({
          min: 0.7,
          max: 0.9,
        }),
    )

    const variableIncomeSqft = rentedSqft - stableIncomeSqft

    return {
      property_type: prop.value,
      property_label: prop.label,
      total_sqft: propTotalSqft,
      rented_sqft: rentedSqft,
      vacant_sqft: vacantSqft,
      stable_income_sqft: stableIncomeSqft,
      variable_income_sqft: variableIncomeSqft,
    }
  })

  return propertyData
}

const propertyStats = Array.from({ length: 1 }, () => {
  const totalSqft = faker.number.int({ min: 500000, max: 1000000 })

  return {
    id: faker.string.uuid(),
    total_sqft: totalSqft,
    property_stats: generatePropertyStats(totalSqft),
  }
})

fs.writeFileSync(
  path.join(__dirname, "workflow-data.ts"),
  `import { PropertyStats } from "./schema";\n\nexport const propertyStats: PropertyStats[] = ${JSON.stringify(
    propertyStats,
    null,
    2,
  )};`,
)

console.log("Data generated")
