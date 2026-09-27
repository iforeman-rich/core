# Graph Report - iforeman-rich  (2026-09-27)

## Corpus Check
- 6 files · ~6,109 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 39 nodes · 64 edges · 11 communities (7 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a340176`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- script.js
- Tiga Kisah dari Babylon
- renderKisah
- el
- assembleContent
- splitParagraf_
- iforeman.sh
- getKisah_
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
8. `renderInline()` - 4 edges
9. `observeAnim()` - 4 edges
10. `ornament()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `renderBenangMerah()` --calls--> `renderInline()`  [EXTRACTED]
  iforeman-story/Kisah-Babylon/script.js → iforeman-story/Kisah-Babylon/script.js  _Bridges community 2 → community 3_
- `gagal()` --calls--> `el()`  [EXTRACTED]
  iforeman-story/Kisah-Babylon/script.js → iforeman-story/Kisah-Babylon/script.js  _Bridges community 3 → community 0_
- `render()` --calls--> `renderKisah()`  [EXTRACTED]
  iforeman-story/Kisah-Babylon/script.js → iforeman-story/Kisah-Babylon/script.js  _Bridges community 2 → community 0_
- `assembleContent()` --calls--> `getKisah_()`  [EXTRACTED]
  iforeman-story/apps-script/code.gs.js → iforeman-story/apps-script/code.gs.js  _Bridges community 8 → community 5_
- `getKisah_()` --calls--> `splitParagraf_()`  [EXTRACTED]
  iforeman-story/apps-script/code.gs.js → iforeman-story/apps-script/code.gs.js  _Bridges community 8 → community 6_

## Import Cycles
- None detected.

## Communities (11 total, 4 thin omitted)

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

### Community 5 - "assembleContent"
Cohesion: 0.67
Nodes (3): assembleContent(), doGet(), getMeta_()

### Community 6 - "splitParagraf_"
Cohesion: 0.67
Nodes (3): getBenangMerah_(), parseJSON_(), splitParagraf_()

## Knowledge Gaps
- **8 isolated node(s):** `iforeman-push.sh script`, `iforeman.sh script`, `core`, `core`, `Kisah Pertama: Naran dan Sungai yang Tidak Peduli` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `render()` connect `script.js` to `renderKisah`, `el`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `el()` connect `el` to `script.js`, `renderKisah`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `iforeman-push.sh script`, `iforeman.sh script`, `core` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._