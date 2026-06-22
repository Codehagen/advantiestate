#!/usr/bin/env bash
# Repeatable end-to-end perf run: (optionally build) -> start prod server ->
# wait ready -> measure all pages -> stop server.
#
# Usage:
#   ./run.sh [label]            # build + measure
#   SKIP_BUILD=1 ./run.sh [label]   # measure against current build only
# Env: PORT (default 3210), plus measure.sh env (WARMUP/SAMPLES/THRESHOLD).
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
PORT="${PORT:-3210}"
LABEL="${1:-$(date +%Y%m%d-%H%M%S)}"
cd "$ROOT"

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  echo "  [run] building..."
  pnpm build > /tmp/advanti-perf-build.log 2>&1 || { echo "  [run] BUILD FAILED"; tail -30 /tmp/advanti-perf-build.log; exit 1; }
fi

echo "  [run] starting prod server on :$PORT ..."
PORT="$PORT" pnpm start > /tmp/advanti-perf-server.log 2>&1 &
SRV_PID=$!
cleanup() { kill "$SRV_PID" 2>/dev/null || true; wait "$SRV_PID" 2>/dev/null || true; }
trap cleanup EXIT

# wait until server answers
for i in $(seq 1 60); do
  if curl -s -o /dev/null "http://localhost:$PORT/"; then break; fi
  sleep 0.5
  if [ "$i" = "60" ]; then echo "  [run] server never came up"; tail -20 /tmp/advanti-perf-server.log; exit 1; fi
done

BASE="http://localhost:$PORT" bash "$DIR/measure.sh" "$LABEL"
