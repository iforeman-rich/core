# Graph Report - iforeman-rich  (2026-10-01)

## Corpus Check
- 7 files · ~9,163 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 46 nodes · 76 edges · 9 communities (6 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29021c4c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- script.js
- Tiga Kisah dari Babylon
- renderKisah
- el
- iforeman-story/apps-script/code.gs.js
- Quesioner/apps-script/code.gs.js
- iforeman.sh
- iforeman-push.sh
- README.md

## God Nodes (most connected - your core abstractions)
1. `el()` - 7 edges
2. `renderKisah()` - 7 edges
3. `render()` - 7 edges
4. `renderKomentarItem()` - 6 edges
5. `renderBenangMerah()` - 5 edges
6. `assembleContent()` - 5 edges
7. `Tiga Kisah dari Babylon` - 5 edges
8. `ensureSheet_()` - 4 edges
9. `doPost()` - 4 edges
10. `renderInline()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `renderBenangMerah()` --calls--> `renderInline()`  [EXTRACTED]
  iforeman-story/Kisah-Babylon/script.js → iforeman-story/Kisah-Babylon/script.js  _Bridges community 2 → community 3_
- `gagal()` --calls--> `el()`  [EXTRACTED]
  iforeman-story/Kisah-Babylon/script.js → iforeman-story/Kisah-Babylon/script.js  _Bridges community 3 → community 0_
- `render()` --calls--> `renderKisah()`  [EXTRACTED]
  iforeman-story/Kisah-Babylon/script.js → iforeman-story/Kisah-Babylon/script.js  _Bridges community 2 → community 0_

## Import Cycles
- None detected.

## Communities (9 total, 3 thin omitted)

### Community 0 - "script.js"
Cohesion: 0.60
Nodes (5): gagal(), initAnimObserver(), muat(), render(), renderNav()

### Community 1 - "Tiga Kisah dari Babylon"
Cohesion: 0.33
Nodes (5): Benang Merah dari Tiga Kisah, Kisah Kedua: Idin, Sang Guru Tua, dan Bel yang Tidak Peduli, Kisah Ketiga: Ur-Nanshe dan Kebun yang Tak Pernah Dilihat, Kisah Pertama: Naran dan Sungai yang Tidak Peduli, Tiga Kisah dari Babylon

### Community 2 - "renderKisah"
Cohesion: 0.60
Nodes (5): formatTimestamp(), handleKomentarSubmit(), renderInline(), renderKisah(), renderKomentarItem()

### Community 3 - "el"
Cohesion: 0.67
Nodes (4): el(), observeAnim(), ornament(), renderBenangMerah()

### Community 4 - "iforeman-story/apps-script/code.gs.js"
Cohesion: 0.33
Nodes (8): assembleContent(), doGet(), getBenangMerah_(), getKisah_(), getKomentarUntukKisah_(), getMeta_(), parseJSON_(), splitParagraf_()

### Community 5 - "Quesioner/apps-script/code.gs.js"
Cohesion: 0.57
Nodes (6): doGet(), doPost(), ensureSheet_(), guard_(), json_(), setup_()

## Knowledge Gaps
- **8 isolated node(s):** `iforeman-push.sh script`, `iforeman.sh script`, `core`, `core`, `Kisah Pertama: Naran dan Sungai yang Tidak Peduli` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `render()` connect `script.js` to `renderKisah`, `el`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `el()` connect `el` to `script.js`, `renderKisah`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `iforeman-push.sh script`, `iforeman.sh script`, `core` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._