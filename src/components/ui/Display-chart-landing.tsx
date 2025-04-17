"use client"

import { cx } from "@/lib/utils"

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

const data = [
  {
    date: "Aug 01",
    Bodø: 1850,
    Tromsø: 2434,
    Oslo: 2943,
  },
  {
    date: "Aug 02",
    Bodø: 1943,
    Tromsø: 2554,
    Oslo: 3154,
  },
  {
    date: "Aug 03",
    Bodø: 4889.5,
    Tromsø: 6100.2,
    Oslo: 9123.7,
  },
  {
    date: "Aug 04",
    Bodø: 3909.8,
    Tromsø: 4909.7,
    Oslo: 7478.4,
  },
  {
    date: "Aug 05",
    Bodø: 5778.7,
    Tromsø: 7103.1,
    Oslo: 9504.3,
  },
  {
    date: "Aug 06",
    Bodø: 5900.9,
    Tromsø: 7534.3,
    Oslo: 9943.4,
  },
  {
    date: "Aug 07",
    Bodø: 4129.4,
    Tromsø: 7412.1,
    Oslo: 10112.2,
  },
  {
    date: "Aug 08",
    Bodø: 6021.2,
    Tromsø: 7834.4,
    Oslo: 10290.2,
  },
  {
    date: "Aug 09",
    Bodø: 6279.8,
    Tromsø: 8159.1,
    Oslo: 10349.6,
  },
  {
    date: "Aug 10",
    Bodø: 6224.5,
    Tromsø: 8260.6,
    Oslo: 10415.4,
  },
  {
    date: "Aug 11",
    Bodø: 6380.6,
    Tromsø: 8965.3,
    Oslo: 10636.3,
  },
  {
    date: "Aug 12",
    Bodø: 6414.4,
    Tromsø: 7989.3,
    Oslo: 10900.5,
  },
  {
    date: "Aug 13",
    Bodø: 6540.1,
    Tromsø: 7839.6,
    Oslo: 11040.4,
  },
  {
    date: "Aug 14",
    Bodø: 6634.4,
    Tromsø: 7343.8,
    Oslo: 11390.5,
  },
  {
    date: "Aug 15",
    Bodø: 7124.6,
    Tromsø: 6903.7,
    Oslo: 11423.1,
  },
  {
    date: "Aug 16",
    Bodø: 7934.5,
    Tromsø: 6273.6,
    Oslo: 12134.4,
  },
  {
    date: "Aug 17",
    Bodø: 10287.8,
    Tromsø: 5900.3,
    Oslo: 12034.4,
  },
  {
    date: "Aug 18",
    Bodø: 10323.2,
    Tromsø: 5732.1,
    Oslo: 11011.7,
  },
  {
    date: "Aug 19",
    Bodø: 10511.4,
    Tromsø: 5523.1,
    Oslo: 11834.8,
  },
  {
    date: "Aug 20",
    Bodø: 11043.9,
    Tromsø: 5422.3,
    Oslo: 12387.1,
  },
  {
    date: "Aug 21",
    Bodø: 6700.7,
    Tromsø: 5334.2,
    Oslo: 11032.2,
  },
  {
    date: "Aug 22",
    Bodø: 6900.8,
    Tromsø: 4943.4,
    Oslo: 10134.2,
  },
  {
    date: "Aug 23",
    Bodø: 7934.5,
    Tromsø: 4812.1,
    Oslo: 9921.2,
  },
  {
    date: "Aug 24",
    Bodø: 9021.0,
    Tromsø: 2729.1,
    Oslo: 10549.8,
  },
  {
    date: "Aug 25",
    Bodø: 9198.2,
    Tromsø: 2178.0,
    Oslo: 10968.4,
  },
  {
    date: "Aug 26",
    Bodø: 9557.1,
    Tromsø: 2158.3,
    Oslo: 11059.1,
  },
  {
    date: "Aug 27",
    Bodø: 9959.8,
    Tromsø: 2100.8,
    Oslo: 11903.6,
  },
  {
    date: "Aug 28",
    Bodø: 10034.6,
    Tromsø: 2934.4,
    Oslo: 12143.3,
  },
  {
    date: "Aug 29",
    Bodø: 10243.8,
    Tromsø: 3223.4,
    Oslo: 12930.1,
  },
  {
    date: "Aug 30",
    Bodø: 10078.5,
    Tromsø: 3779.1,
    Oslo: 13420.5,
  },
  {
    date: "Aug 31",
    Bodø: 11134.6,
    Tromsø: 4190.3,
    Oslo: 14443.2,
  },
  {
    date: "Sep 01",
    Bodø: 12347.2,
    Tromsø: 4839.1,
    Oslo: 14532.1,
  },
  {
    date: "Sep 02",
    Bodø: 12593.8,
    Tromsø: 5153.3,
    Oslo: 14283.5,
  },
  {
    date: "Sep 03",
    Bodø: 12043.4,
    Tromsø: 5234.8,
    Oslo: 14078.9,
  },
  {
    date: "Sep 04",
    Bodø: 12144.9,
    Tromsø: 5478.4,
    Oslo: 13859.7,
  },
  {
    date: "Sep 05",
    Bodø: 12489.5,
    Tromsø: 5741.1,
    Oslo: 13539.2,
  },
  {
    date: "Sep 06",
    Bodø: 12748.7,
    Tromsø: 6743.9,
    Oslo: 13643.2,
  },
  {
    date: "Sep 07",
    Bodø: 12933.2,
    Tromsø: 7832.8,
    Oslo: 14629.2,
  },
  {
    date: "Sep 08",
    Bodø: 13028.8,
    Tromsø: 8943.2,
    Oslo: 13611.2,
  },
  {
    date: "Sep 09",
    Bodø: 13412.4,
    Tromsø: 9932.2,
    Oslo: 12515.2,
  },
  {
    date: "Sep 10",
    Bodø: 13649.0,
    Tromsø: 10139.2,
    Oslo: 11143.8,
  },
  {
    date: "Sep 11",
    Bodø: 13748.5,
    Tromsø: 10441.2,
    Oslo: 8929.2,
  },
  {
    date: "Sep 12",
    Bodø: 13148.1,
    Tromsø: 10933.8,
    Oslo: 8943.2,
  },
  {
    date: "Sep 13",
    Bodø: 12839.6,
    Tromsø: 11073.4,
    Oslo: 7938.3,
  },
  {
    date: "Sep 14",
    Bodø: 12428.2,
    Tromsø: 11128.3,
    Oslo: 7533.4,
  },
  {
    date: "Sep 15",
    Bodø: 12012.8,
    Tromsø: 11412.3,
    Oslo: 7100.4,
  },
  {
    date: "Sep 16",
    Bodø: 11801.3,
    Tromsø: 10501.1,
    Oslo: 6532.1,
  },
  {
    date: "Sep 17",
    Bodø: 10102.9,
    Tromsø: 8923.3,
    Oslo: 4332.8,
  },
  {
    date: "Sep 18",
    Bodø: 12132.5,
    Tromsø: 10212.1,
    Oslo: 7847.4,
  },
  {
    date: "Sep 19",
    Bodø: 12901.1,
    Tromsø: 10101.7,
    Oslo: 7223.3,
  },
  {
    date: "Sep 20",
    Bodø: 13132.6,
    Tromsø: 12132.3,
    Oslo: 6900.2,
  },
  {
    date: "Sep 21",
    Bodø: 14132.2,
    Tromsø: 13212.5,
    Oslo: 5932.2,
  },
  {
    date: "Sep 22",
    Bodø: 14245.8,
    Tromsø: 12163.4,
    Oslo: 5577.1,
  },
  {
    date: "Sep 23",
    Bodø: 14328.3,
    Tromsø: 10036.1,
    Oslo: 5439.2,
  },
  {
    date: "Sep 24",
    Bodø: 14949.9,
    Tromsø: 8985.1,
    Oslo: 4463.1,
  },
  {
    date: "Sep 25",
    Bodø: 15967.5,
    Tromsø: 9700.1,
    Oslo: 4123.2,
  },
  {
    date: "Sep 26",
    Bodø: 17349.3,
    Tromsø: 10943.4,
    Oslo: 3935.1,
  },
]

const summary = [
  {
    name: "Bodø",
    value: "2 349",
    invested: "45 000",
    cashflow: "1 890",
    gain: "4.8",
    realized: "96.5",
    dividends: "1 950",
    bgColor: "bg-light-blue",
    changeType: "positive",
  },
  {
    name: "Tromsø",
    value: "2 943",
    invested: "52 000",
    cashflow: "2 100",
    gain: "5.2",
    realized: "98.2",
    dividends: "2 290",
    bgColor: "bg-warm-grey-2",
    changeType: "positive",
  },
  {
    name: "Oslo",
    value: "3 443",
    invested: "65 000",
    cashflow: "2 450",
    gain: "4.5",
    realized: "94.8",
    dividends: "2 890",
    bgColor: "bg-warm-grey-1",
    changeType: "positive",
  },
]

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("no").format(number)} kr/m²`

export default function DisplayChartLanding() {
  return (
    <>
      <h3 className="text-sm text-gray-500 dark:text-gray-500">
        Leieprisutvikling
      </h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">
        2 750 kr/m²
      </p>
      <p className="mt-1 text-sm font-medium">
        <span className="text-emerald-700 dark:text-emerald-500">
          +150 kr/m² (5,8%)
        </span>{" "}
        <span className="font-normal text-gray-500 dark:text-gray-500">
          Siste kvartal
        </span>
      </p>
      <LineChart
        data={data}
        index="date"
        categories={["Bodø", "Tromsø", "Oslo"]}
        colors={["light-blue", "warm-grey-2", "warm-grey-1"]}
        valueFormatter={valueFormatter}
        yAxisWidth={80}
        onValueChange={() => {}}
        className="mt-6 hidden h-96 sm:block"
      />
      <LineChart
        data={data}
        index="date"
        categories={["Bodø", "Tromsø", "Oslo"]}
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
              <TableHeaderCell>By</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Utleiepris kr/m²
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Verdi kr/m²
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                NOI kr/m²
              </TableHeaderCell>
              <TableHeaderCell className="text-right">Yield %</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Utleiegrad %
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Leienivå kr/m²
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                  <div className="flex space-x-3">
                    <span
                      className={cx(item.bgColor, "w-1 shrink-0 rounded")}
                      aria-hidden={true}
                    />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.value} kr/m²</TableCell>
                <TableCell className="text-right">
                  {item.invested} kr/m²
                </TableCell>
                <TableCell className="text-right">
                  {item.cashflow} kr/m²
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cx(
                      item.changeType === "positive"
                        ? "text-emerald-700 dark:text-emerald-500"
                        : "text-red-700 dark:text-red-500",
                    )}
                  >
                    {item.gain}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cx(
                      item.changeType === "positive"
                        ? "text-emerald-700 dark:text-emerald-500"
                        : "text-red-700 dark:text-red-500",
                    )}
                  >
                    {item.realized}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cx(
                      item.changeType === "positive"
                        ? "text-emerald-700 dark:text-emerald-500"
                        : "text-red-700 dark:text-red-500",
                    )}
                  >
                    {item.dividends} kr/m²
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </>
  )
}
