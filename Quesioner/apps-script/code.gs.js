// ============================================================
// Komentar iforeman-rich — Apps Script Web App (bound ke Google Sheet)
//
// CARA PASANG (sekali saja):
//   1. Buka Google Sheet "Komentar iforeman-rich" → menu Extensions → Apps Script.
//   2. Paste isi file ini ke editor (ganti isi Code.gs bawaan).
//   3. Jalankan fungsi setup_() sekali dari editor untuk membuat tab "Komentar"
//      beserta baris header (tanpa itu pun doGet/doPost membuatnya otomatis).
//   4. Deploy → New deployment → Web app:
//        Execute as : Me
//        Who has access : Anyone
//      (URL /exec baru muncul setelah deploy; deploy ulang tiap kali kode diubah.)
//   5. Copy URL Web app itu ke Quesioner/Menerka-Masa-Depan/config.js, isi:
//        window.APP_CONFIG = { APPS_SCRIPT_URL: '...' };
//      (config.js dimuat index.html sebelum skrip utama)
//
// Catatan:
//   - Script ini BOUND ke spreadsheet, jadi memakai
//     SpreadsheetApp.getActiveSpreadsheet() — TANPA ID spreadsheet hardcode.
//   - doGet/doPost hanya pakai ContentService (tanpa header kustom),
//     sehingga tidak memicu preflight CORS dari halaman statis.
//   - TIDAK memakai ScriptApp.newTrigger (semua bersifat on-demand).
// ============================================================

/** Nama tab (sheet) tempat menyimpan komentar. */
var SHEET_NAME = "Komentar";

/** Baris header — urutannya sama persis dengan kolom yang ditulis doGet(). */
var HEADERS = ["timestamp", "nama", "komentar"];

/** Batas panjang (harus sama dengan maxlength form komentar di index.html). */
var MAX_NAMA = 60;
var MAX_KOMENTAR = 1000;

/** Menunggu lock paling lama 10 detik sebelum menulis. */
var LOCK_TIMEOUT_MS = 10000;

/**
 * setup_() — jalankan SATU KALI dari editor Apps Script.
 * Membuat tab "Komentar" + baris header bila belum ada.
 */
function setup_() {
  var sh = ensureSheet_();
  Logger.log('Tab "' + SHEET_NAME + '" siap. Baris header: ' + HEADERS.join(", "));
  Logger.log("Ukuran: " + sh.getLastRow() + " baris x " + sh.getLastColumn() + " kolom.");
}

/**
 * ensureSheet_() — helper internal: buat tab "Komentar" + header
 * kalau belum ada (dipanggil otomatis dari doGet/doPost).
 */
function ensureSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    return sh;
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
  }
  return sh;
}

/**
 * json_() — bungkus objek sebagai output JSON (tanpa header kustom).
 */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * guard_() — cegah formula injection di Google Sheets.
 * Kalau teks diawali = + - @ (atau tab/CR), awali dengan apostrof
 * supaya Sheets memperlakukannya sebagai teks, bukan formula.
 */
function guard_(text) {
  var s = String(text);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

/**
 * doGet() — kembalikan daftar komentar sebagai JSON, TERBARU DULU.
 * Format yang dibaca bagian komentar di index.html:
 *   { "komentar": [ { "nama": "...", "komentar": "...", "timestamp": "<ISO>" }, ... ] }
 * Baris pertama tab (header) dilewati.
 */
function doGet(e) {
  var sh = ensureSheet_();
  var data = sh.getDataRange().getValues();
  var komentar = [];
  // iterasi dari baris terakhir ke atas -> urut terbaru dulu
  for (var i = data.length - 1; i >= 1; i--) {
    var ts = data[i][0];
    komentar.push({
      nama: String(data[i][1] === null || data[i][1] === undefined ? "" : data[i][1]),
      komentar: String(data[i][2] === null || data[i][2] === undefined ? "" : data[i][2]),
      timestamp: (ts instanceof Date) ? ts.toISOString() : String(ts)
    });
  }
  return json_({ komentar: komentar });
}

/**
 * doPost() — simpan komentar baru.
 * Parameter form: nama, komentar (URLSearchParams dari form komentar index.html).
 * Validasi wajib + batas panjang, timestamp server, LockService untuk tulis,
 * dan guard_() anti formula-injection.
 */
function doPost(e) {
  var param = (e && e.parameter) ? e.parameter : {};
  var nama = String(param.nama === undefined || param.nama === null ? "" : param.nama).trim();
  var komentar = String(param.komentar === undefined || param.komentar === null ? "" : param.komentar).trim();

  if (!nama || !komentar) {
    return json_({ success: false, error: "Nama dan komentar wajib diisi." });
  }
  if (nama.length > MAX_NAMA) {
    return json_({ success: false, error: "Nama maksimal " + MAX_NAMA + " karakter." });
  }
  if (komentar.length > MAX_KOMENTAR) {
    return json_({ success: false, error: "Komentar maksimal " + MAX_KOMENTAR + " karakter." });
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(LOCK_TIMEOUT_MS);
  } catch (err) {
    return json_({ success: false, error: "Server sedang sibuk. Coba lagi sebentar." });
  }

  try {
    var sh = ensureSheet_();
    var now = new Date();
    sh.appendRow([now, guard_(nama), guard_(komentar)]);
    return json_({ success: true, timestamp: now.toISOString() });
  } catch (err2) {
    return json_({ success: false, error: "Gagal menyimpan komentar. Coba lagi nanti." });
  } finally {
    lock.releaseLock();
  }
}
