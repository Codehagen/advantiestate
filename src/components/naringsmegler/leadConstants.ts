// Shared between CityLeadForm (renders the <select>) and the
// naringsmegler-lead server action (validates submissions) — one list, so the
// form and the server can never drift apart. Values feed mapPropertyType()
// in src/lib/supabase/leads.ts; keep prefixes compatible when editing.
export const PROPERTY_TYPES = [
  "Kontor",
  "Handel",
  "Logistikk / lager",
  "Kombinert bygg",
  "Annet",
] as const
