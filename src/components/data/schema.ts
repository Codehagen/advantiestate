export type Usage = {
  eiendomsnavn: string
  type: string
  byggeaar: number
  bta: number
  yield: number
  inntekter: number
  kostnader: number
  antallLeietakere: number
  antallLeietakereTidligere: number
  risikoScore: number
  by: string
  leieprisPerKvm: number
}

export type OverviewData = {
  date: string
  "Rows written": number
  "Rows read": number
  Queries: number
  "Payments completed": number
  "Sign ups": number
  Logins: number
  "Sign outs": number
  "Support calls": number
}
