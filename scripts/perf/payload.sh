#!/usr/bin/env bash
# Measure real first-load transfer (compressed HTML + all referenced JS chunks)
# per page against a running server. Approximates browser "page weight".
#   BASE=http://localhost:3210 ./payload.sh /path /path2 ...
set -uo pipefail
BASE="${BASE:-http://localhost:3210}"
hdr=$(printf "%-42s %10s %10s %6s" "page" "html(kB)" "js(kB)" "#js")
echo "$hdr"
echo "--------------------------------------------------------------------------"
for path in "$@"; do
  html=$(curl -s --compressed "$BASE$path")
  hbytes=$(printf "%s" "$html" | wc -c | tr -d ' ')
  # extract referenced static JS chunk urls
  urls=$(printf "%s" "$html" | grep -oE '/_next/static/[^"]+\.js' | sort -u)
  jsbytes=0; n=0
  for u in $urls; do
    b=$(curl -s --compressed -o /dev/null -w "%{size_download}" "$BASE$u" || echo 0)
    jsbytes=$((jsbytes + b)); n=$((n+1))
  done
  awk -v p="$path" -v h="$hbytes" -v j="$jsbytes" -v n="$n" \
    'BEGIN{printf "%-42s %10.1f %10.1f %6d\n", p, h/1024, j/1024, n}'
done
