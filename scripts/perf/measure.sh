#!/usr/bin/env bash
# Measure server-response latency (TTFB) for every page in urls.txt against an
# already-running server. Repeatable test conditions: fixed warmup + sample
# counts, median of N samples, same URL inventory every run.
#
# Usage:
#   BASE=http://localhost:3210 ./measure.sh [label]
# Env:
#   BASE        base url (default http://localhost:3210)
#   WARMUP      warmup requests per url, discarded (default 3)
#   SAMPLES     measured requests per url (default 10)
#   THRESHOLD   pass/fail threshold in ms (default 50)
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="${BASE:-http://localhost:3210}"
WARMUP="${WARMUP:-3}"
SAMPLES="${SAMPLES:-10}"
THRESHOLD="${THRESHOLD:-50}"
LABEL="${1:-$(date +%Y%m%d-%H%M%S)}"
URLS_FILE="$DIR/urls.txt"
RESULTS_CSV="$DIR/results.csv"

median() { sort -n | awk '{a[NR]=$1} END{ if(NR==0){print "NA"; exit} m=int((NR+1)/2); if(NR%2){print a[m]} else {printf "%.1f", (a[m]+a[m+1])/2} }'; }
p95()    { sort -n | awk '{a[NR]=$1} END{ if(NR==0){print "NA"; exit} i=int(NR*0.95); if(i<1)i=1; print a[i] }'; }

URLS=()
while IFS= read -r line; do URLS+=("$line"); done < <(grep -vE '^[[:space:]]*#|^[[:space:]]*$' "$URLS_FILE")

printf "\n  Perf measure — %s  (median TTFB of %d samples, threshold %dms)\n" "$LABEL" "$SAMPLES" "$THRESHOLD"
printf "  base=%s  warmup=%d  pages=%d\n\n" "$BASE" "$WARMUP" "${#URLS[@]}"

rows=""
slowest=0
fail=0
total_med=0
count=0
for path in "${URLS[@]}"; do
  url="$BASE$path"
  # warmup (discarded) — triggers on-demand generation / module load
  for ((i=0;i<WARMUP;i++)); do curl -s -o /dev/null "$url" || true; done
  # measure
  samples=""
  code=000
  for ((i=0;i<SAMPLES;i++)); do
    read -r ttfb http < <(curl -s -o /dev/null -w "%{time_starttransfer} %{http_code}"$'\n' "$url" || echo "9.999 000") || true
    ms=$(awk -v t="$ttfb" 'BEGIN{printf "%.1f", t*1000}')
    samples+="$ms"$'\n'
    code="$http"
  done
  med=$(printf "%s" "$samples" | median)
  pp=$(printf "%s" "$samples" | p95)
  total_med=$(awk -v a="$total_med" -v b="$med" 'BEGIN{printf "%.1f", a+b}')
  count=$((count+1))
  # track slowest
  if awk -v m="$med" -v s="$slowest" 'BEGIN{exit !(m>s)}'; then slowest="$med"; fi
  flag="ok "
  if awk -v m="$med" -v t="$THRESHOLD" 'BEGIN{exit !(m>t)}'; then flag="SLOW"; fail=$((fail+1)); fi
  if [ "$code" != "200" ]; then flag="HTTP$code"; fi
  rows+="$(printf "%9.1f %6s  %-3s  %s\n" "$med" "$pp" "$flag" "$path")"$'\n'
  echo "$LABEL,$path,$med,$pp,$code,$THRESHOLD" >> "$RESULTS_CSV"
done

# print sorted slowest-first
printf "  %9s %6s  %-3s  %s\n" "med(ms)" "p95" "st" "page"
printf "  %s\n" "-------------------------------------------------------------"
printf "%s" "$rows" | sort -rn | sed 's/^/  /'

avg=$(awk -v t="$total_med" -v c="$count" 'BEGIN{ if(c==0){print "NA"; exit} printf "%.1f", t/c }')
printf "\n  pages=%d  over-%dms=%d  slowest=%.1fms  mean-of-medians=%sms\n\n" "$count" "$THRESHOLD" "$fail" "$slowest" "$avg"

if [ "$fail" -gt 0 ]; then exit 1; fi
