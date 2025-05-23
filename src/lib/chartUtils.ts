// Tremor chartColors [v0.1.0]

export type ColorUtility = "bg" | "stroke" | "fill" | "text"

export const chartColors = {
  "warm-grey": {
    bg: "bg-warm-grey",
    stroke: "stroke-warm-grey",
    fill: "fill-warm-grey",
    text: "text-warm-grey",
  },
  "warm-grey-3": {
    bg: "bg-warm-grey-3",
    stroke: "stroke-warm-grey-3",
    fill: "fill-warm-grey-3",
    text: "text-warm-grey-3",
  },
  "warm-grey-2": {
    bg: "bg-warm-grey-2",
    stroke: "stroke-warm-grey-2",
    fill: "fill-warm-grey-2",
    text: "text-warm-grey-2",
  },
  "warm-grey-1": {
    bg: "bg-warm-grey-1",
    stroke: "stroke-warm-grey-1",
    fill: "fill-warm-grey-1",
    text: "text-warm-grey-1",
  },
  "light-blue": {
    bg: "bg-light-blue",
    stroke: "stroke-light-blue",
    fill: "fill-light-blue",
    text: "text-light-blue",
  },
  "light-blue-2": {
    bg: "bg-light-blue-2",
    stroke: "stroke-light-blue-2",
    fill: "fill-light-blue-2",
    text: "text-light-blue-2",
  },
  "light-blue-1": {
    bg: "bg-light-blue-1",
    stroke: "stroke-light-blue-1",
    fill: "fill-light-blue-1",
    text: "text-light-blue-1",
  },
  emerald: {
    bg: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
  red: {
    bg: "bg-red-500",
    stroke: "stroke-red-500",
    fill: "fill-red-500",
    text: "text-red-500",
  },
  yellow: {
    bg: "bg-yellow-500",
    stroke: "stroke-yellow-500",
    fill: "fill-yellow-500",
    text: "text-yellow-500",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string
  }
}

export type AvailableChartColorsKeys = keyof typeof chartColors

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors,
) as Array<AvailableChartColorsKeys>

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>()
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length])
  })
  return categoryColors
}

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
) => {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0)
  const maxDomain = maxValue ?? "auto"
  return [minDomain, maxDomain]
}

export function hasOnlyOneValueForKey(
  array: any[],
  keyToCheck: string,
): boolean {
  const val: any[] = []

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck])
      if (val.length > 1) {
        return false
      }
    }
  }

  return true
}

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  const fallbackColor = {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  }
  return chartColors[color]?.[type] ?? fallbackColor[type]
}
