#!/usr/bin/env python3
"""
generate.py - bikin index.html statis dari daftar subfolder.

Cara pakai:
  1. Taruh file ini di dalam folder Web-interaktif (sejajar dengan index.html)
  2. Jalankan:  python3 generate.py
  3. Commit & push index.html hasilnya ke GitHub

Tidak ada panggilan GitHub API, jadi tidak ada limit.
"""
import html
import sys
from pathlib import Path
from urllib.parse import quote

# ---------- KONFIGURASI ----------
BASE_URL = "https://iforeman-rich.github.io/core/Web-interaktif/"
HIDE = []                 # nama folder yang mau disembunyikan, contoh: ["draft"]
ONLY_WITH_INDEX = True    # True = hanya folder yang berisi index.html
# ---------------------------------

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "index.html"


def judul(nama: str) -> str:
    """'penjual-jamu_yang-menunda' -> 'Penjual Jamu Yang Menunda'"""
    kata = nama.replace("-", " ").replace("_", " ").split()
    return " ".join(k[:1].upper() + k[1:] for k in kata)


def cari_folder():
    hasil = []
    for p in ROOT.iterdir():
        if not p.is_dir() or p.name.startswith(".") or p.name in HIDE:
            continue
        if ONLY_WITH_INDEX and not (p / "index.html").exists():
            continue
        hasil.append(p.name)
    return sorted(hasil, key=str.lower)


TEMPLATE = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Web Interaktif</title>
<style>
  :root { --bg:#0b0b0f; --card:#14141b; --border:#23232e; --text:#e8e8ee; --muted:#8a8a9a; --accent:#c9a96e; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif; min-height: 100vh; padding: 48px 20px; }
  .wrap { max-width: 880px; margin: 0 auto; }
  h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; }
  .sub { color: var(--muted); margin-top: 6px; }
  .search { width: 100%; margin: 28px 0 20px; padding: 12px 16px; background: var(--card);
    border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 1rem; outline: none; }
  .search:focus { border-color: var(--accent); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
  a.card { display: block; padding: 18px; background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; text-decoration: none; color: inherit; transition: transform .15s, border-color .15s; }
  a.card:hover { transform: translateY(-3px); border-color: var(--accent); }
  .card .name { font-weight: 600; font-size: 1.05rem; }
  .card .go { color: var(--accent); font-size: .85rem; margin-top: 12px; }
  .msg { color: var(--muted); padding: 24px 0; display: none; }
  .count { color: var(--muted); font-size: .85rem; margin-bottom: 14px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Web Interaktif</h1>
  <p class="sub">Kumpulan halaman interaktif.</p>
  <input id="q" class="search" type="search" placeholder="Cari halaman...">
  <div id="count" class="count">__TOTAL__ halaman</div>
  <div id="list" class="grid">
__CARDS__
  </div>
  <div id="msg" class="msg">Tidak ada yang cocok.</div>
</div>
<script>
const q = document.getElementById("q");
const cards = [...document.querySelectorAll("a.card")];
const count = document.getElementById("count");
const msg = document.getElementById("msg");
q.addEventListener("input", () => {
  const t = q.value.trim().toLowerCase();
  let n = 0;
  cards.forEach(c => {
    const ok = c.dataset.title.includes(t);
    c.style.display = ok ? "" : "none";
    if (ok) n++;
  });
  count.textContent = n + " dari " + cards.length + " halaman";
  msg.style.display = n ? "none" : "block";
});
</script>
</body>
</html>
"""

CARD = (
    '    <a class="card" href="{href}" data-title="{data}">\n'
    '      <div class="name">{title}</div>\n'
    '      <div class="go">Buka &rarr;</div>\n'
    "    </a>"
)


def main():
    folder = cari_folder()
    if not folder:
        print("Tidak ada subfolder yang cocok. Pastikan script ada di dalam Web-interaktif.")
        sys.exit(1)

    base = BASE_URL if BASE_URL.endswith("/") else BASE_URL + "/"
    cards = []
    for nama in folder:
        t = judul(nama)
        cards.append(CARD.format(
            href=html.escape(base + quote(nama) + "/", quote=True),
            data=html.escape(t.lower(), quote=True),
            title=html.escape(t),
        ))

    hasil = TEMPLATE.replace("__CARDS__", "\n".join(cards)).replace("__TOTAL__", str(len(folder)))
    OUT.write_text(hasil, encoding="utf-8")

    print(f"Selesai: {len(folder)} halaman ditulis ke {OUT}")
    for nama in folder:
        print(f"  - {judul(nama)}  ->  {base}{quote(nama)}/")


if __name__ == "__main__":
    main()
