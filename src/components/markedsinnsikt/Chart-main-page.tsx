"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { cx } from "@/lib/utils"

const data = [
  {
    date: "Jan 23",
    Kontor: 45000,
    Handel: 38000,
    Lager: 28000,
  },
  {
    date: "Feb 23",
    Kontor: 46200,
    Handel: 37500,
    Lager: 28500,
  },
  {
    date: "Mar 23",
    Kontor: 46800,
    Handel: 37800,
    Lager: 29000,
  },
  {
    date: "Apr 23",
    Kontor: 47100,
    Handel: 38200,
    Lager: 29200,
  },
  {
    date: "Mai 23",
    Kontor: 47500,
    Handel: 38600,
    Lager: 29500,
  },
  {
    date: "Jun 23",
    Kontor: 48000,
    Handel: 39000,
    Lager: 30000,
  },
  {
    date: "Jul 23",
    Kontor: 48500,
    Handel: 39400,
    Lager: 30200,
  },
  {
    date: "Aug 23",
    Kontor: 49000,
    Handel: 39800,
    Lager: 30500,
  },
  {
    date: "Sep 23",
    Kontor: 49500,
    Handel: 40200,
    Lager: 30800,
  },
  {
    date: "Okt 23",
    Kontor: 50000,
    Handel: 40600,
    Lager: 31000,
  },
  {
    date: "Nov 23",
    Kontor: 50500,
    Handel: 41000,
    Lager: 31200,
  },
  {
    date: "Des 23",
    Kontor: 51000,
    Handel: 41400,
    Lager: 31500,
  },
]

const summary = [
  {
    name: "Kontor",
    value: "51 000 kr/m²",
    endring: "+13.3%",
    omsetning: "1.2 mrd NOK",
    yield: "4.8%",
    areal: "45 000 m²",
    ledighet: "4.2%",
    bgColor: "bg-light-blue",
    changeType: "positive",
  },
  {
    name: "Handel",
    value: "41 400 kr/m²",
    endring: "+8.9%",
    omsetning: "890 mill NOK",
    yield: "5.2%",
    areal: "32 000 m²",
    ledighet: "3.8%",
    bgColor: "bg-warm-grey-2",
    changeType: "positive",
  },
  {
    name: "Lager",
    value: "31 500 kr/m²",
    endring: "+12.5%",
    omsetning: "650 mill NOK",
    yield: "5.5%",
    areal: "28 000 m²",
    ledighet: "2.5%",
    bgColor: "bg-warm-grey-1",
    changeType: "positive",
  },
]

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("no").format(number)} kr/m²`

export default function MarkedsData() {
  return (
    <Card className="mt-4">
      <div className="mt-2">
        <h3 className="text-warm-grey dark:text-warm-grey-1 text-sm">
          Prisutvikling næringseiendom i Nord-Norge
        </h3>
        <p className="text-warm-grey dark:text-warm-white mt-1 text-3xl font-semibold">
          41 300 kr/m²
        </p>
        <p className="mt-1 text-sm font-medium">
          <span className="text-emerald-700 dark:text-emerald-500">
            +11.6% årlig vekst
          </span>{" "}
          <span className="text-warm-grey-2 dark:text-warm-grey-1 font-normal">
            Gjennomsnitt alle segmenter
          </span>
        </p>
        <LineChart
          data={data}
          index="date"
          categories={["Kontor", "Handel", "Lager"]}
          colors={["light-blue", "warm-grey-2", "warm-grey-1"]}
          valueFormatter={valueFormatter}
          yAxisWidth={80}
          onValueChange={() => {}}
          className="mt-6 hidden h-96 sm:block"
        />
        <LineChart
          data={data}
          index="date"
          categories={["Kontor", "Handel", "Lager"]}
          colors={["light-blue", "warm-grey-2", "warm-grey-1"]}
          valueFormatter={valueFormatter}
          showYAxis={false}
          showLegend={false}
          startEndOnly={true}
          className="mt-6 h-72 sm:hidden"
        />
        <TableRoot className="mt-8">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="text-warm-grey dark:text-warm-grey-1">
                  Segment
                </TableHeaderCell>
                <TableHeaderCell className="text-warm-grey dark:text-warm-grey-1 text-right">
                  Pris/m²
                </TableHeaderCell>
                <TableHeaderCell className="text-warm-grey dark:text-warm-grey-1 text-right">
                  12m endring
                </TableHeaderCell>
                <TableHeaderCell className="text-warm-grey dark:text-warm-grey-1 text-right">
                  Omsetning
                </TableHeaderCell>
                <TableHeaderCell className="text-warm-grey dark:text-warm-grey-1 text-right">
                  Yield
                </TableHeaderCell>
                <TableHeaderCell className="text-warm-grey dark:text-warm-grey-1 text-right">
                  Areal
                </TableHeaderCell>
                <TableHeaderCell className="text-warm-grey dark:text-warm-grey-1 text-right">
                  Ledighet
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="text-warm-grey dark:text-warm-white font-medium">
                    <div className="flex space-x-3">
                      <span
                        className={cx(item.bgColor, "w-1 shrink-0 rounded")}
                        aria-hidden={true}
                      />
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-warm-grey dark:text-warm-white text-right">
                    {item.value}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-emerald-700 dark:text-emerald-500">
                      {item.endring}
                    </span>
                  </TableCell>
                  <TableCell className="text-warm-grey dark:text-warm-white text-right">
                    {item.omsetning}
                  </TableCell>
                  <TableCell className="text-warm-grey dark:text-warm-white text-right">
                    {item.yield}
                  </TableCell>
                  <TableCell className="text-warm-grey dark:text-warm-white text-right">
                    {item.areal}
                  </TableCell>
                  <TableCell className="text-warm-grey dark:text-warm-white text-right">
                    {item.ledighet}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
    </Card>
  )
}
