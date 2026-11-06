#!/bin/bash
# iforeman.sh — Update graphify, commit & push iforeman-rich ke GitHub
# Simpan ke: ~/iforeman-rich/iforeman.sh
# chmod +x iforeman-push.sh
#
# Mengikuti Delegate Model (lihat instruksi proyek Bagian 9.5): script ini
# adalah pemilik tunggal alur graphify+push untuk scope ini, supaya push
# manual (langsung jalanin script ini di terminal, bukan lewat
# freebuff-closer-iforeman-rich.sh) tetap bikin graph ter-update.
#
# Exit codes (dipakai freebuff-closer-iforeman-rich.sh untuk membedakan
# langkah mana yang gagal saat di-delegate):
#   0  sukses (atau tidak ada perubahan)
#   1  syntax/precondition error umum
#   4  graphify update gagal
#   5  manifest.json tidak ada setelah graphify update
#   6  gen-folder-tree.py gagal
#   7  git push gagal
#   8  generate.py (index Web-interaktif) gagal / tidak ditemukan

PROJECT_DIR="$HOME/iforeman-rich"
LOG="$PROJECT_DIR/push.log"
WEB_DIR="$PROJECT_DIR/Web-interaktif"

cd "$PROJECT_DIR" || exit 1

# ── Cari SSH agent yang aktif (kalau key iforeman pakai passphrase) ──────
if [ -z "$SSH_AUTH_SOCK" ] || [ ! -S "$SSH_AUTH_SOCK" ]; then
    SSH_AGENT_SOCK=$(ls "$HOME"/.ssh/agent/s.*.agent.* 2>/dev/null | head -1)
    if [ -n "$SSH_AGENT_SOCK" ]; then
        export SSH_AUTH_SOCK="$SSH_AGENT_SOCK"
    fi
fi

# ── [Web-interaktif] Generate index.html dari daftar subfolder ───────────
# Dijalankan SEBELUM graphify supaya index.html terbaru ikut terbaca graph
# dan ikut ter-commit di push ini.
if [ ! -f "$WEB_DIR/generate.py" ]; then
    echo "$(date '+%H:%M') [Web] ERROR: generate.py tidak ada: $WEB_DIR/generate.py" >> "$LOG"
    echo "❌ generate.py tidak ditemukan di $WEB_DIR — push dibatalkan."
    exit 8
fi

echo "$(date '+%H:%M') [Web] generate.py ..." >> "$LOG"
if ! python3 "$WEB_DIR/generate.py" >> "$LOG" 2>&1; then
    echo "$(date '+%H:%M') [Web] ERROR: generate.py gagal." >> "$LOG"
    echo "❌ generate.py GAGAL — push dibatalkan. Cek $LOG"
    exit 8
fi
echo "$(date '+%H:%M') [Web] generate.py OK." >> "$LOG"

# ── [Graphify] Update graph sebelum commit/push ──────────────────────────
# Urutan: graphify update → cek manifest → gen-folder-tree → (git add kalau tracked).
# Kalau graphify-out/ ter-track git, perubahannya ikut di-commit & di-push.
if ! command -v graphify >/dev/null 2>&1; then
    echo "$(date '+%H:%M') [Graphify] ERROR: command graphify tidak ditemukan." >> "$LOG"
    echo "❌ graphify tidak ditemukan — push dibatalkan."
    exit 4
fi

echo "$(date '+%H:%M') [Graphify] graphify update . ..." >> "$LOG"
if ! graphify update .; then
    echo "$(date '+%H:%M') [Graphify] ERROR: graphify update gagal." >> "$LOG"
    echo "❌ graphify update GAGAL — push dibatalkan."
    exit 4
fi
echo "$(date '+%H:%M') [Graphify] graphify update OK." >> "$LOG"

MANIFEST="$PROJECT_DIR/graphify-out/manifest.json"
if [ ! -f "$MANIFEST" ]; then
    echo "$(date '+%H:%M') [Graphify] ERROR: manifest.json tidak ada: $MANIFEST" >> "$LOG"
    echo "❌ manifest.json tidak ditemukan setelah graphify update — push dibatalkan."
    exit 5
fi

echo "$(date '+%H:%M') [Graphify] gen-folder-tree.py ..." >> "$LOG"
if ! python3 ~/.local/bin/gen-folder-tree.py "$MANIFEST"; then
    echo "$(date '+%H:%M') [Graphify] ERROR: gen-folder-tree.py gagal." >> "$LOG"
    echo "❌ gen-folder-tree.py GAGAL — push dibatalkan."
    exit 6
fi

# Kalau graphify-out/ ter-track git (belum di-ignore) → stage perubahannya (ikut commit push ini)
if ! git check-ignore -q graphify-out; then
    echo "$(date '+%H:%M') [Graphify] graphify-out tracked — git add." >> "$LOG"
    git add graphify-out/
fi

echo "$(date '+%H:%M') [Graphify] selesai." >> "$LOG"

# ── Cek apakah ada perubahan ──────────────────────────────────────────────
if [ -z "$(git status --porcelain)" ]; then
    echo "$(date '+%H:%M') [Git] Tidak ada perubahan, skip." >> "$LOG"
    echo "ℹ️  Tidak ada perubahan."
    notify-send "iforeman-rich" "Tidak ada perubahan" --urgency=low 2>/dev/null
    exit 0
fi

# ── Commit & push ─────────────────────────────────────────────────────────
git add -A
COMMIT_MSG="${1:-auto: $(date '+%Y-%m-%d %H:%M')}"
git commit -m "$COMMIT_MSG"

PUSH_OUTPUT=$(git push origin main 2>&1)
PUSH_STATUS=$?
echo "$PUSH_OUTPUT" >> "$LOG"

if [ $PUSH_STATUS -eq 0 ]; then
    echo "$(date '+%H:%M') [Git] Push berhasil: $COMMIT_MSG" >> "$LOG"
    echo "✅ Push berhasil: $COMMIT_MSG"
    notify-send "iforeman-rich" "📤 rich di-push ke GitHub" --urgency=low 2>/dev/null
else
    echo "$(date '+%H:%M') [Git] Push GAGAL:" >> "$LOG"
    echo "$PUSH_OUTPUT" >> "$LOG"
    echo ""
    echo "❌ Push GAGAL:"
    echo "$PUSH_OUTPUT"
    notify-send "iforeman-rich" "❌ Push gagal! $PUSH_OUTPUT" --urgency=critical 2>/dev/null
    exit 7
fi

exit 0
