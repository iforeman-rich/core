// ============================================================
// config.js — konfigurasi halaman kuesioner "Menerka Masa Depan".
//
// Isi APPS_SCRIPT_URL dengan URL /exec hasil deploy Web app Apps Script
// "Komentar iforeman-rich" (Extensions → Apps Script → Deploy → New
// deployment → Web app, Execute as: Me, Who has access: Anyone).
//
// URL ini BUKAN rahasia — dipanggil langsung dari browser pengunjung,
// jadi aman ditulis di file statis yang bisa dibuka siapa saja.
//
// Biarkan '' selama belum di-deploy: bagian komentar menampilkan pesan
// ramah "Komentar belum diaktifkan", tombol kirim nonaktif, dan TIDAK
// melakukan fetch apa pun — kuesioner tetap jalan normal.
// ============================================================
window.APP_CONFIG = { APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyNAu7MD040DxlUvnX0Bb25vtQpbqLPzrsqp8YFSU30VBdVAmF8hm9ls_s2c-iGbhlj/exec' };
