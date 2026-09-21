#!/bin/sh
# Doppelklick startet das Mockup und oeffnet es im Browser (macOS). Beim ersten Mal wird Bun installiert (falls noetig)
# und die Abhaengigkeiten werden geladen; das dauert ein bis zwei Minuten. Beenden: dieses Fenster schliessen.
cd "$(dirname "$0")" || exit 1
export PATH="$HOME/.bun/bin:$PATH"
if ! command -v bun >/dev/null 2>&1; then
  echo "Bun wird installiert ..."
  curl -fsSL https://bun.sh/install | bash || { echo "Bun konnte nicht installiert werden. Bitte https://bun.sh oeffnen."; read -r _; exit 1; }
  export PATH="$HOME/.bun/bin:$PATH"
fi
if [ ! -d node_modules ]; then
  echo "Abhaengigkeiten werden geladen ..."
  bun install || { echo "Installation fehlgeschlagen."; read -r _; exit 1; }
fi
echo
echo "Das Mockup laeuft gleich auf http://localhost:4321"
echo "Zum Beenden dieses Fenster schliessen."
echo
[ -z "$NO_OPEN" ] && (sleep 5; open "http://localhost:4321") &
exec bun run dev --port 4321 --host 127.0.0.1
