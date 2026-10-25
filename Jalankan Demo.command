#!/bin/bash
cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  echo 'Node.js belum ditemukan. Install Node.js untuk menjalankan demo.'
  read -r -p 'Tekan Enter untuk menutup.'
  exit 1
fi
if curl -fsS http://localhost:4173/ 2>/dev/null | grep -q '<title>Sapago x Substories Demo</title>'; then
  open 'http://localhost:4173'
  exit 0
fi
(sleep 1; open 'http://localhost:4173') &
node scripts/server.mjs
read -r -p 'Tekan Enter untuk menutup.'
