"use client"

import { Card } from "@/components/Card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { cx } from "@/lib/utils"
import { RegnskapsAnalyse } from "./RegnskapsAnalyse"

type YearValue = string | number
type YearData = Record<string, YearValue>

interface FinancialData {
  item: string
  values: YearData
  isMainCategory?: boolean
  isSubCategory?: boolean
}

type Year = "2019-12" | "2020-12" | "2021-12" | "2022-12" | "2023-12"

interface KeyRatio {
  label: string
  values: Record<Year, number>
  format: "percent" | "decimal"
}

interface TableAccountingProps {
  data: FinancialData[]
}

export default function TableAccounting({ data }: TableAccountingProps) {
  const years: Year[] = ["2019-12", "2020-12", "2021-12", "2022-12", "2023-12"]

  // Helper function to determine if a row should be bold
  const shouldBeBold = (item: string) => {
    const boldRows = [
      "Sum driftsinntekter",
      "Driftsresultat",
      "Sum finansinntekter",
      "Sum finanskostnader",
      "Resultat før skatt",
      "Ordinært resultat",
      "Årsresultat",
      "Sum immaterielle midler",
      "Sum anleggsmidler",
      "Sum varige driftsmidler",
      "Sum finansielle anleggsmidler",
      "Sum fordringer",
      "Sum investeringer",
      "Sum Kasse/Bank/Post",
      "Sum omløpsmidler",
      "Sum eiendeler",
      "Sum innskutt egenkapital",
      "Sum opptjent egenkapital",
      "Sum egenkapital",
      "Sum avsetninger til forpliktelser",
      "Sum annen langsiktig gjeld",
      "Sum langsiktig gjeld",
      "Sum kortsiktig gjeld",
      "Sum gjeld",
      "SUM EGENKAPITAL OG GJELD",
    ]
    return boldRows.includes(item)
  }

  const balanceSheetData: FinancialData[] = [
    {
      item: "Valuta",
      values: {
        "2019-12": "NOK",
        "2020-12": "NOK",
        "2021-12": "NOK",
        "2022-12": "NOK",
        "2023-12": "NOK",
      },
      isMainCategory: true,
    },
    {
      item: "Goodwill",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum immaterielle midler",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum anleggsmidler",
      values: {
        "2019-12": 0,
        "2020-12": 0,
        "2021-12": 111,
        "2022-12": 111,
        "2023-12": 127,
      },
    },
    {
      item: "Tomter, bygninger og annen fast eiendom",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Maskiner/anlegg/biler",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Driftsløsøre/ inventar/ verktøy/ Biler",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum varige driftsmidler",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Aksjer/Investeringer i datterselskap",
      values: {
        "2019-12": 0,
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Endr. behold. varer under tilvirk./ferdige",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Investeringer i aksjer og andeler",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Andre finansielle fordringer",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum finansielle anleggsmidler",
      values: {
        "2019-12": 0,
        "2020-12": "-",
        "2021-12": 111,
        "2022-12": 111,
        "2023-12": 127,
      },
    },
    {
      item: "Sum varelager",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Kundefordringer",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": 36,
      },
    },
    {
      item: "Andre fordringer",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": 3,
        "2023-12": 4,
      },
    },
    {
      item: "Konsernfordringer",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum fordringer",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": 3,
        "2023-12": 40,
      },
    },
    {
      item: "Sum investeringer",
      values: {
        "2019-12": "-",
        "2020-12": 25,
        "2021-12": 1,
        "2022-12": 1,
        "2023-12": 1,
      },
    },
    {
      item: "Kasse/Bank/Post",
      values: {
        "2019-12": -2,
        "2020-12": 13,
        "2021-12": 16,
        "2022-12": 8,
        "2023-12": 20,
      },
    },
    {
      item: "Sum Kasse/Bank/Post",
      values: {
        "2019-12": -2,
        "2020-12": 13,
        "2021-12": 16,
        "2022-12": 8,
        "2023-12": 20,
      },
    },
    {
      item: "Sum omløpsmidler",
      values: {
        "2019-12": -2,
        "2020-12": 38,
        "2021-12": 17,
        "2022-12": 11,
        "2023-12": 61,
      },
    },
    {
      item: "Sum eiendeler",
      values: {
        "2019-12": -2,
        "2020-12": 38,
        "2021-12": 128,
        "2022-12": 122,
        "2023-12": 188,
      },
    },
    {
      item: "Aksje/Selskapskapital",
      values: {
        "2019-12": 30,
        "2020-12": 30,
        "2021-12": 100,
        "2022-12": 100,
        "2023-12": 100,
      },
    },
    {
      item: "Annen innskutt egenkapital",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum innskutt egenkapital",
      values: {
        "2019-12": 30,
        "2020-12": 30,
        "2021-12": 100,
        "2022-12": 100,
        "2023-12": 100,
      },
    },
    {
      item: "Sum opptjent egenkapital",
      values: {
        "2019-12": -58,
        "2020-12": -54,
        "2021-12": -34,
        "2022-12": -76,
        "2023-12": -32,
      },
    },
    {
      item: "Annen egenkapital",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum egenkapital",
      values: {
        "2019-12": -28,
        "2020-12": -24,
        "2021-12": 66,
        "2022-12": 24,
        "2023-12": 68,
      },
    },
    {
      item: "Sum avsetninger til forpliktelser",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Pant/gjeld til kredittinstitusjoner",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Langsiktig konserngjeld",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Ansvarlig lånekapital",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Sum annen langsiktig gjeld",
      values: {
        "2019-12": 26,
        "2020-12": 26,
        "2021-12": 26,
        "2022-12": 26,
        "2023-12": 26,
      },
    },
    {
      item: "Annen langsiktig gjeld",
      values: {
        "2019-12": 26,
        "2020-12": 26,
        "2021-12": 26,
        "2022-12": 26,
        "2023-12": 26,
      },
    },
    {
      item: "Sum langsiktig gjeld",
      values: {
        "2019-12": 26,
        "2020-12": 26,
        "2021-12": 26,
        "2022-12": 26,
        "2023-12": 26,
      },
    },
    {
      item: "Gjeld til kredittinstitusjoner",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Leverandørgjeld",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": 1,
        "2023-12": 0,
      },
    },
    {
      item: "Skyldig offentlige avgifter",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": -2,
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Kortsiktig konserngjeld",
      values: {
        "2019-12": "-",
        "2020-12": "-",
        "2021-12": "-",
        "2022-12": "-",
        "2023-12": "-",
      },
    },
    {
      item: "Annen kortsiktig gjeld",
      values: {
        "2019-12": "-",
        "2020-12": 37,
        "2021-12": 37,
        "2022-12": 71,
        "2023-12": 97,
      },
    },
    {
      item: "Sum kortsiktig gjeld",
      values: {
        "2019-12": "-",
        "2020-12": 37,
        "2021-12": 36,
        "2022-12": 72,
        "2023-12": 93,
      },
    },
    {
      item: "Sum gjeld",
      values: {
        "2019-12": 26,
        "2020-12": 63,
        "2021-12": 62,
        "2022-12": 98,
        "2023-12": 119,
      },
    },
    {
      item: "SUM EGENKAPITAL OG GJELD",
      values: {
        "2019-12": -2,
        "2020-12": 38,
        "2021-12": 128,
        "2022-12": 122,
        "2023-12": 188,
      },
    },
    {
      item: "Garantistillelser",
      values: {
        "2019-12": "-",
        "2020-12": 0,
        "2021-12": 0,
        "2022-12": 0,
        "2023-12": 0,
      },
    },
    {
      item: "Pantstillelser",
      values: {
        "2019-12": "-",
        "2020-12": 0,
        "2021-12": 0,
        "2022-12": 0,
        "2023-12": 0,
      },
    },
  ]

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="resultat">
              <TabsList className="border-b border-warm-grey-2/20 dark:border-warm-grey-1/20">
                <TabsTrigger
                  value="resultat"
                  className={cx(
                    "border-b-2 border-transparent px-3 pb-2 text-sm font-medium transition-all",
                    "text-warm-grey-2 dark:text-warm-grey-1",
                    "hover:border-warm-grey-2/30 hover:text-warm-grey dark:hover:border-warm-grey-1/30 dark:hover:text-warm-white",
                    "data-[state=active]:border-warm-grey data-[state=active]:text-warm-grey dark:data-[state=active]:border-warm-white dark:data-[state=active]:text-warm-white",
                  )}
                >
                  Resultatregnskap
                </TabsTrigger>
                <TabsTrigger
                  value="balanse"
                  className={cx(
                    "border-b-2 border-transparent px-3 pb-2 text-sm font-medium transition-all",
                    "text-warm-grey-2 dark:text-warm-grey-1",
                    "hover:border-warm-grey-2/30 hover:text-warm-grey dark:hover:border-warm-grey-1/30 dark:hover:text-warm-white",
                    "data-[state=active]:border-warm-grey data-[state=active]:text-warm-grey dark:data-[state=active]:border-warm-white dark:data-[state=active]:text-warm-white",
                  )}
                >
                  Balanseregnskap
                </TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <TabsContent value="resultat">
                  <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    Beløp i hele 1000
                  </p>
                  <TableRoot className="mt-4">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Post</TableHeaderCell>
                          {years.map((year) => (
                            <TableHeaderCell key={year} className="text-right">
                              {year.substring(0, 4)}
                            </TableHeaderCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <TableRow key={item.item}>
                            <TableCell
                              className={cx(
                                shouldBeBold(item.item) &&
                                  "font-medium text-warm-grey dark:text-warm-white",
                                !shouldBeBold(item.item) &&
                                  "text-warm-grey-2 dark:text-warm-grey-1",
                                item.isSubCategory && "pl-8",
                              )}
                            >
                              {item.item}
                            </TableCell>
                            {years.map((year) => (
                              <TableCell
                                key={year}
                                className={cx(
                                  "text-right tabular-nums",
                                  shouldBeBold(item.item) &&
                                    "font-medium text-warm-grey dark:text-warm-white",
                                  !shouldBeBold(item.item) &&
                                    "text-warm-grey-2 dark:text-warm-grey-1",
                                )}
                              >
                                {item.values[year] === "-"
                                  ? "−"
                                  : item.values[year] === 0
                                    ? "0"
                                    : item.values[year]
                                          ?.toString()
                                          .startsWith("-")
                                      ? `−${item.values[year]?.toString().substring(1)}`
                                      : item.values[year]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableRoot>
                </TabsContent>
                <TabsContent value="balanse">
                  <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    Beløp i hele 1000
                  </p>
                  <TableRoot className="mt-4">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Post</TableHeaderCell>
                          {years.map((year) => (
                            <TableHeaderCell key={year} className="text-right">
                              {year.substring(0, 4)}
                            </TableHeaderCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {balanceSheetData.map((item) => (
                          <TableRow key={item.item}>
                            <TableCell
                              className={cx(
                                shouldBeBold(item.item) &&
                                  "font-medium text-warm-grey dark:text-warm-white",
                                !shouldBeBold(item.item) &&
                                  "text-warm-grey-2 dark:text-warm-grey-1",
                                item.isSubCategory && "pl-8",
                              )}
                            >
                              {item.item}
                            </TableCell>
                            {years.map((year) => (
                              <TableCell
                                key={year}
                                className={cx(
                                  "text-right tabular-nums",
                                  shouldBeBold(item.item) &&
                                    "font-medium text-warm-grey dark:text-warm-white",
                                  !shouldBeBold(item.item) &&
                                    "text-warm-grey-2 dark:text-warm-grey-1",
                                )}
                              >
                                {item.values[year] === "-"
                                  ? "−"
                                  : item.values[year] === 0
                                    ? "0"
                                    : item.values[year]
                                          ?.toString()
                                          .startsWith("-")
                                      ? `−${item.values[year]?.toString().substring(1)}`
                                      : item.values[year]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableRoot>
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          <RegnskapsAnalyse
            data={[
              {
                year: "2023",
                trendRevenue: -41.2,
                trendGrossMargin: -37.6,
                grossMargin: 6.059,
                operatingResult: -2.537,
                operatingCashFlow: 0,
                profitBeforeTax: -981,
                subsidiaryValue: 34.101,
                equity: 83.628,
              },
              {
                year: "2022",
                trendRevenue: -35.8,
                trendGrossMargin: -32.4,
                grossMargin: 5.821,
                operatingResult: -1.937,
                operatingCashFlow: 0,
                profitBeforeTax: -781,
                subsidiaryValue: 32.101,
                equity: 81.628,
              },
              {
                year: "2021",
                trendRevenue: -28.5,
                trendGrossMargin: -25.2,
                grossMargin: 5.623,
                operatingResult: -1.437,
                operatingCashFlow: 0,
                profitBeforeTax: -581,
                subsidiaryValue: 30.101,
                equity: 79.628,
              },
            ]}
          />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Utvidet firma- og kredittinformasjon
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Vår Premium tjeneste Propdock Premium gir deg komplett oversikt
              over firmaer og roller i norsk næringsliv:
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "Rating, score og kredittvurdering",
                "Betalingsanmerkninger, panteheftelser og saker i domstolene",
                "Segmenteringsverktøy for å ta ut lister til markeds- og analyseformål",
                "Historisk firma- og rolleinformasjon",
                "E-postvarsling på endringer i selskaper du følger",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg
                    className="mt-1 size-4 shrink-0 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.75 12.75L10 15.25L16.25 8.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="mt-8">
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Nøkkeltall 2023
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Oversikt over selskapets økonomiske nøkkeltall
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4">
              {[
                {
                  label: "Totalrentabilitet",
                  value: -0.6,
                  format: "percent",
                  status: "poor",
                  description: "Avkastning på eiendelene",
                  target: "Bør være 10-15%",
                },
                {
                  label: "Likviditetsgrad",
                  value: 3.73,
                  format: "decimal",
                  status: "good",
                  description: "Betalingsevne",
                  target: "Bør være > 2.0",
                },
                {
                  label: "Egenkapitalandel",
                  value: 88.7,
                  format: "percent",
                  status: "good",
                  description: "Soliditet",
                  target: "Bør være > 30%",
                },
                {
                  label: "Gjeldsgrad",
                  value: 0.13,
                  format: "decimal",
                  status: "good",
                  description: "Forhold mellom gjeld og egenkapital",
                  target: "Bør være < 5.0",
                },
                {
                  label: "Resultatgrad",
                  value: -39.68,
                  format: "percent",
                  status: "poor",
                  description: "Lønnsomhet",
                  target: "Bør være > 10%",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className={cx(
                    "relative rounded-lg border p-4",
                    "border-warm-grey-2/20 dark:border-warm-grey-1/20",
                    "bg-warm-white/50 dark:bg-warm-grey/30",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-warm-grey dark:text-warm-white">
                        {metric.label}
                      </h4>
                      <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                        {metric.description}
                      </p>
                    </div>
                    <span
                      className={cx(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        metric.status === "good"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
                      )}
                    >
                      {metric.format === "percent"
                        ? `${metric.value.toFixed(1)}%`
                        : metric.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <svg
                      className={cx(
                        "size-4 shrink-0",
                        metric.status === "good"
                          ? "text-emerald-500"
                          : "text-red-500",
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {metric.status === "good" ? (
                        <path
                          d="M7.75 12.75L10 15.25L16.25 8.75"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <path
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                    <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                      {metric.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h4 className="font-medium text-warm-grey dark:text-warm-white">
                  Om nøkkeltallene
                </h4>
                <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Totalrentabiliteten i et foretak er et mål på avkastningen på
                  selve eiendelene. Et viktig nøkkeltall ved
                  lønnsomhetsberegning. Et rimelig nivå er 10 - 15%, men bør
                  ligge over det selskapet betaler for sine lån.
                </p>
                <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Likviditetsgraden er et mål på hvor mye kortsiktige midler
                  foretaket har i forhold til forpliktelsene selskapet har på
                  samme tidshorisont. Kortsiktig gjeld er forpliktelser som
                  forfaller innen ett år.
                </p>
                <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Egenkapitalandelen viser hvor stor andel av eiendelene som er
                  finansiert med egenkapitalen. Hvis sum egenkapital &lt; 100
                  000,- anses soliditeten uansett for å være svak.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
