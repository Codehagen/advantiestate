#!/usr/bin/env bash

set -euo pipefail

HOST="${INDEXNOW_HOST:-www.advantiestate.no}"
KEY_FILE="${INDEXNOW_KEY_FILE:-public/e00d97943d5eefa07873e7c9448d2873.txt}"
API_ENDPOINT="${INDEXNOW_API_ENDPOINT:-https://api.indexnow.org/indexnow}"

if [[ ! -f "$KEY_FILE" ]]; then
  echo "IndexNow key file not found: $KEY_FILE" >&2
  exit 1
fi

if [[ "$#" -eq 0 ]]; then
  echo "Usage: pnpm indexnow:submit -- <url-or-path> [more urls/paths]" >&2
  echo "Example: pnpm indexnow:submit -- /kontakt /tjenester/salg" >&2
  exit 1
fi

KEY="$(tr -d '\r\n' < "$KEY_FILE")"
KEY_BASENAME="$(basename "$KEY_FILE")"

URL_JSON="["
for input in "$@"; do
  if [[ "$input" =~ ^https?:// ]]; then
    url="$input"
  else
    path="${input#/}"
    url="https://${HOST}/${path}"
  fi
  URL_JSON="${URL_JSON}\"${url}\","
done
URL_JSON="${URL_JSON%,}]"

PAYLOAD="{\"host\":\"${HOST}\",\"key\":\"${KEY}\",\"keyLocation\":\"https://${HOST}/${KEY_BASENAME}\",\"urlList\":${URL_JSON}}"

echo "Submitting $# URL(s) to IndexNow for ${HOST}..."
curl -sS -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${PAYLOAD}"
echo
echo "IndexNow submission complete."
