import { Usage } from "./schema"

export const roles: { value: string; label: string }[] = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "member",
    label: "Member",
  },
  {
    value: "viewer",
    label: "Viewer",
  },
  {
    value: "contributor",
    label: "Contributor",
  },
]

export const statuses: { value: string; label: string; variant: string }[] = [
  {
    value: "live",
    label: "Live",
    variant: "success",
  },
  {
    value: "inactive",
    label: "Inactive",
    variant: "neutral",
  },
  {
    value: "archived",
    label: "Archived",
    variant: "warning",
  },
]

export const regions: { value: string; label: string }[] = [
  {
    value: "US-West 1",
    label: "US-West 1",
  },
  {
    value: "US-West 2",
    label: "US-West 2",
  },
  {
    value: "US-East 1",
    label: "US-East 1",
  },
  {
    value: "US-East 2",
    label: "US-East 2",
  },
  {
    value: "EU-West 1",
    label: "EU-West 1",
  },
  {
    value: "EU-North 1",
    label: "EU-North 1",
  },
  {
    value: "EU-Central 1",
    label: "EU-Central 1",
  },
]

export const conditions: { value: string; label: string }[] = [
  {
    value: "is-equal-to",
    label: "er lik",
  },
  {
    value: "is-between",
    label: "er mellom",
  },
  {
    value: "is-greater-than",
    label: "er større enn",
  },
  {
    value: "is-less-than",
    label: "er mindre enn",
  },
]

export const propertyTypes: {
  value: string
  label: string
  variant: string
}[] = [
  {
    value: "kontor",
    label: "Kontor",
    variant: "default",
  },
  {
    value: "logistikk",
    label: "Logistikk",
    variant: "outline",
  },
  {
    value: "handel",
    label: "Handel",
    variant: "secondary",
  },
  {
    value: "kombinasjonsbygg",
    label: "Kombinasjonsbygg",
    variant: "neutral",
  },
  {
    value: "bolig",
    label: "Bolig",
    variant: "outline",
  },
  {
    value: "annet",
    label: "Annet",
    variant: "neutral",
  },
]

export const yieldVariants: { min: number; max: number; variant: string }[] = [
  {
    min: 0,
    max: 0.04,
    variant: "success",
  },
  {
    min: 0.04,
    max: 0.055,
    variant: "warning",
  },
  {
    min: 0.055,
    max: 1,
    variant: "neutral",
  },
]

export const leieprisVariants: { min: number; max: number; variant: string }[] =
  [
    {
      min: 0,
      max: 1500,
      variant: "neutral",
    },
    {
      min: 1500,
      max: 2500,
      variant: "warning",
    },
    {
      min: 2500,
      max: 100000,
      variant: "success",
    },
  ]

export const risikoCategories: {
  min: number
  max: number
  label: string
  variant: string
}[] = [
  {
    min: 0,
    max: 0.33,
    label: "Lav risiko",
    variant: "success",
  },
  {
    min: 0.33,
    max: 0.66,
    label: "Middels risiko",
    variant: "warning",
  },
  {
    min: 0.66,
    max: 1,
    label: "Høy risiko",
    variant: "destructive",
  },
]

export const users: {
  name: string
  initials: string
  email: string
  role: string
}[] = [
  {
    name: "Emma Stone",
    initials: "ES",
    email: "a.stone@gmail.com",
    role: "viewer",
  },
  {
    name: "Alissia McCalister",
    initials: "AM",
    email: "a.stone@gmail.com",
    role: "viewer",
  },
  {
    name: "Emily Luisa Bernacle",
    initials: "EB",
    email: "e.luis.bernacle@gmail.com",
    role: "member",
  },
  {
    name: "Aaron Wave",
    initials: "AW",
    email: "a.flow@acme.com",
    role: "contributor",
  },
  {
    name: "Thomas Palstein",
    initials: "TP",
    email: "t.palstein@acme.com",
    role: "viewer",
  },
  {
    name: "Sarah Johnson",
    initials: "SJ",
    email: "s.johnson@gmail.com",
    role: "admin",
  },
  {
    name: "Megan Katherina Brown",
    initials: "MB",
    email: "m.lovelybrown@gmail.com",
    role: "contributor",
  },
]

export const invitedUsers: {
  initials: string
  email: string
  role: string
  expires: number
}[] = [
  {
    initials: "LP",
    email: "lydia.posh@gmail.com",
    role: "viewer",
    expires: 12,
  },
  {
    initials: "AW",
    email: "awidburg@bluewin.ch",
    role: "viewer",
    expires: 8,
  },
]

export const cities: { value: string; label: string }[] = [
  { value: "oslo", label: "Oslo" },
  { value: "bergen", label: "Bergen" },
  { value: "trondheim", label: "Trondheim" },
  { value: "stavanger", label: "Stavanger" },
  { value: "tromsø", label: "Tromsø" },
  { value: "kristiansand", label: "Kristiansand" },
  { value: "drammen", label: "Drammen" },
  { value: "fredrikstad", label: "Fredrikstad" },
  { value: "sandnes", label: "Sandnes" },
  { value: "bodø", label: "Bodø" },
]

export const usage: Usage[] = [
  {
    eiendomsnavn: "Storgata 120",
    type: "kontor",
    byggeaar: 2005,
    bta: 12500,
    yield: 0.045,
    inntekter: 25000000,
    kostnader: 5000000,
    antallLeietakere: 8,
    antallLeietakereTidligere: 10,
    risikoScore: 0.25,
    by: "oslo",
    leieprisPerKvm: (25000000 - 5000000) / 12500,
  },
  {
    eiendomsnavn: "Sjøgata 45",
    type: "handel",
    byggeaar: 1998,
    bta: 8750,
    yield: 0.052,
    inntekter: 18500000,
    kostnader: 3700000,
    antallLeietakere: 12,
    antallLeietakereTidligere: 9,
    risikoScore: 0.4,
    by: "bergen",
    leieprisPerKvm: (18500000 - 3700000) / 8750,
  },
  {
    eiendomsnavn: "Næringsparken 10",
    type: "logistikk",
    byggeaar: 2015,
    bta: 22000,
    yield: 0.038,
    inntekter: 32000000,
    kostnader: 6400000,
    antallLeietakere: 3,
    antallLeietakereTidligere: 3,
    risikoScore: 0.28,
    by: "trondheim",
    leieprisPerKvm: (32000000 - 6400000) / 22000,
  },
  {
    eiendomsnavn: "Havnegata 87",
    type: "kombinasjonsbygg",
    byggeaar: 2010,
    bta: 15600,
    yield: 0.047,
    inntekter: 28000000,
    kostnader: 5600000,
    antallLeietakere: 6,
    antallLeietakereTidligere: 8,
    risikoScore: 0.52,
    by: "stavanger",
    leieprisPerKvm: (28000000 - 5600000) / 15600,
  },
  {
    eiendomsnavn: "Industriveien 22",
    type: "logistikk",
    byggeaar: 2018,
    bta: 31000,
    yield: 0.035,
    inntekter: 42000000,
    kostnader: 8400000,
    antallLeietakere: 2,
    antallLeietakereTidligere: 4,
    risikoScore: 0.35,
    by: "tromsø",
    leieprisPerKvm: (42000000 - 8400000) / 31000,
  },
  {
    eiendomsnavn: "Kirkegata 56",
    type: "kontor",
    byggeaar: 2001,
    bta: 9800,
    yield: 0.049,
    inntekter: 19000000,
    kostnader: 3800000,
    antallLeietakere: 5,
    antallLeietakereTidligere: 4,
    risikoScore: 0.38,
    by: "kristiansand",
    leieprisPerKvm: (19000000 - 3800000) / 9800,
  },
  {
    eiendomsnavn: "Torgveien 12",
    type: "handel",
    byggeaar: 1995,
    bta: 7200,
    yield: 0.058,
    inntekter: 14500000,
    kostnader: 2900000,
    antallLeietakere: 15,
    antallLeietakereTidligere: 12,
    risikoScore: 0.72,
    by: "drammen",
    leieprisPerKvm: (14500000 - 2900000) / 7200,
  },
  {
    eiendomsnavn: "Teknologiparken 5",
    type: "kontor",
    byggeaar: 2019,
    bta: 18500,
    yield: 0.032,
    inntekter: 36000000,
    kostnader: 7200000,
    antallLeietakere: 4,
    antallLeietakereTidligere: 4,
    risikoScore: 0.2,
    by: "fredrikstad",
    leieprisPerKvm: (36000000 - 7200000) / 18500,
  },
  {
    eiendomsnavn: "Fjordgata 34",
    type: "kombinasjonsbygg",
    byggeaar: 2008,
    bta: 14200,
    yield: 0.046,
    inntekter: 26500000,
    kostnader: 5300000,
    antallLeietakere: 7,
    antallLeietakereTidligere: 5,
    risikoScore: 0.45,
    by: "sandnes",
    leieprisPerKvm: (26500000 - 5300000) / 14200,
  },
  {
    eiendomsnavn: "Nytorget 78",
    type: "handel",
    byggeaar: 2000,
    bta: 6500,
    yield: 0.055,
    inntekter: 12800000,
    kostnader: 2560000,
    antallLeietakere: 9,
    antallLeietakereTidligere: 11,
    risikoScore: 0.68,
    by: "bodø",
    leieprisPerKvm: (12800000 - 2560000) / 6500,
  },
]
