"use client"

import { cx } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"

interface TenantData {
  name: string
  orgNr: string
  moveInDate: string
  revenue: number | null
  operatingResult: number | null
  equity: number | null
  employeeCount: number | null
  status: "Aktiv" | "Oppsagt" | "Ukjent"
  endDate: string | null
  tenancyYears: number
  industry: string
  creditScore: number | null
}

const data: TenantData[] = [
  {
    name: "Advanti Technology AS",
    orgNr: "919 415 754",
    moveInDate: "01.01.2023",
    revenue: 95000000,
    operatingResult: 45000000,
    equity: 68000000,
    employeeCount: 42,
    status: "Aktiv",
    endDate: null,
    tenancyYears: 1,
    industry: "IT-Konsulent",
    creditScore: 85,
  },
  {
    name: "Digital Consulting AS",
    orgNr: "921 345 678",
    moveInDate: "01.03.2018",
    revenue: 45000000,
    operatingResult: -2000000,
    equity: -1500000,
    employeeCount: 15,
    status: "Aktiv",
    endDate: null,
    tenancyYears: 6,
    industry: "IT-Konsulent",
    creditScore: 45,
  },
  {
    name: "Nordic Software Solutions AS",
    orgNr: "923 456 789",
    moveInDate: "01.06.2023",
    revenue: 75000000,
    operatingResult: null,
    equity: null,
    employeeCount: null,
    status: "Ukjent",
    endDate: null,
    tenancyYears: 0.8,
    industry: "Programvare",
    creditScore: null,
  },
  {
    name: "Innovate Finance AS",
    orgNr: "924 567 890",
    moveInDate: "01.09.2022",
    revenue: 120000000,
    operatingResult: 15000000,
    equity: 25000000,
    employeeCount: 28,
    status: "Aktiv",
    endDate: null,
    tenancyYears: 1.4,
    industry: "Fintech",
    creditScore: 92,
  },
  {
    name: "Cloud Systems Norge AS",
    orgNr: "925 678 901",
    moveInDate: "01.04.2023",
    revenue: 85000000,
    operatingResult: 8000000,
    equity: 12000000,
    employeeCount: 35,
    status: "Aktiv",
    endDate: null,
    tenancyYears: 0.9,
    industry: "Cloud Computing",
    creditScore: 78,
  },
]

function getTenantHealthStatus(tenant: TenantData) {
  if (!tenant.operatingResult || !tenant.equity || !tenant.creditScore)
    return "unknown"

  // Composite health score based on multiple factors
  let score = 0

  // Operating result factor
  if (tenant.operatingResult > 0) score += 40
  else if (tenant.operatingResult < -5000000) score -= 40

  // Equity factor
  if (tenant.equity > 0) score += 30
  else score -= 30

  // Credit score factor
  if (tenant.creditScore >= 80) score += 30
  else if (tenant.creditScore >= 60) score += 15
  else score -= 15

  if (score >= 60) return "good"
  if (score >= 30) return "medium"
  return "poor"
}

function getTenancyStatus(years: number) {
  if (years >= 5) return "review"
  if (years >= 1) return "established"
  return "new"
}

function getYearsRented(moveInDate: string): number {
  const [day, month, year] = moveInDate.split(".").map(Number)
  const startDate = new Date(year, month - 1, day)
  const currentDate = new Date()
  const diffInYears =
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  return Math.ceil(diffInYears)
}

export default function TableLeietakere() {
  const activeTenantsCount = data.filter(
    (item) => item.status === "Aktiv",
  ).length

  return (
    <>
      <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Totalt antall leietakere
            </p>
            <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
              {activeTenantsCount} aktive leietakere
            </p>
          </div>
          <div>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Gjennomsnittlig driftsinntekt
            </p>
            <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
              {(
                data.reduce((sum, item) => sum + (item.revenue || 0), 0) /
                activeTenantsCount /
                1000000
              ).toFixed(1)}{" "}
              MNOK
            </p>
          </div>
          <div>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Gjennomsnittlig antall ansatte
            </p>
            <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
              {Math.round(
                data.reduce((sum, item) => sum + (item.employeeCount || 0), 0) /
                  activeTenantsCount,
              )}{" "}
              ansatte
            </p>
          </div>
        </div>
      </div>

      <TableRoot className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Leietaker</TableHeaderCell>
              <TableHeaderCell>Org.nr</TableHeaderCell>
              <TableHeaderCell>Innflyttingsdato</TableHeaderCell>
              <TableHeaderCell className="text-right">År leid</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Driftsinntekter
              </TableHeaderCell>
              <TableHeaderCell>Bransje</TableHeaderCell>
              <TableHeaderCell>Leietaker-status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.orgNr}>
                <TableCell className="font-medium text-warm-grey dark:text-warm-white">
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    {getTenancyStatus(item.tenancyYears) === "review" && (
                      <span
                        className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10 dark:bg-orange-500/20 dark:text-orange-400 dark:ring-orange-400/20"
                        title="Leieforhold over 5 år - bør gjennomgås"
                      >
                        Gjennomgang
                      </span>
                    )}
                    {item.creditScore && item.creditScore < 50 && (
                      <span
                        className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-500/20 dark:text-red-400 dark:ring-red-400/20"
                        title="Lav kreditt-score"
                      >
                        Kredittrisiko
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-warm-grey-2 dark:text-warm-grey-1">
                  {item.orgNr}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-warm-grey-2 dark:text-warm-grey-1">
                      {item.moveInDate}
                    </span>
                    {getTenancyStatus(item.tenancyYears) === "new" && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-500/20 dark:text-blue-400 dark:ring-blue-400/20">
                        Ny
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums text-warm-grey-2 dark:text-warm-grey-1">
                  {getYearsRented(item.moveInDate)} år
                </TableCell>
                <TableCell className="text-right tabular-nums text-warm-grey-2 dark:text-warm-grey-1">
                  {item.revenue
                    ? `${(item.revenue / 1000000).toFixed(1)} MNOK`
                    : "−"}
                  {item.employeeCount && (
                    <div className="text-xs text-warm-grey-2/80 dark:text-warm-grey-1/80">
                      {item.employeeCount} ansatte
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-warm-grey-2 dark:text-warm-grey-1">
                  {item.industry}
                </TableCell>
                <TableCell>
                  <span
                    className={cx(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      getTenantHealthStatus(item) === "good"
                        ? "bg-emerald-100 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-400/20"
                        : getTenantHealthStatus(item) === "medium"
                          ? "bg-yellow-100 text-yellow-700 ring-yellow-600/10 dark:bg-yellow-500/20 dark:text-yellow-400 dark:ring-yellow-400/20"
                          : getTenantHealthStatus(item) === "poor"
                            ? "bg-red-100 text-red-700 ring-red-600/10 dark:bg-red-500/20 dark:text-red-400 dark:ring-red-400/20"
                            : "bg-warm-grey-2/20 text-warm-grey-2 ring-warm-grey-2/10 dark:bg-warm-grey-1/20 dark:text-warm-grey-1 dark:ring-warm-grey-1/10",
                    )}
                  >
                    {getTenantHealthStatus(item) === "good"
                      ? "God"
                      : getTenantHealthStatus(item) === "medium"
                        ? "Middels"
                        : getTenantHealthStatus(item) === "poor"
                          ? "Svak"
                          : "Ukjent"}
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
