# Admin Dura Tenera

Web admin internal ringan tanpa login, cocok untuk static hosting seperti Vercel.

## File
- `index.html` → struktur halaman
- `styles.css` → tampilan
- `app.js` → logika transaksi, rekap, supplier, filter, validasi
- `apps-script.gs` → backend opsional untuk koneksi Google Spreadsheet

## Fitur utama
- Dashboard hari ini: Total → Persentase → Kesimpulan
- Input transaksi dengan validasi wajib `Tenera + Dura = 100`
- ID transaksi otomatis: `TRX-YYYYMMDD-001`
- Simpan jam input otomatis
- Hapus transaksi aktif
- Rekap harian, mingguan, bulanan
- Spreadsheet view dengan search dan filter
- Master supplier CRUD
- Responsif untuk HP dan laptop

## Cara pakai cepat
1. Upload `index.html`, `styles.css`, dan `app.js` ke repo GitHub.
2. Deploy repo ke Vercel.
3. Untuk versi local-only, kosongkan `APPS_SCRIPT_URL` di `app.js`.
4. Untuk sinkron ke Google Spreadsheet, deploy `apps-script.gs` sebagai Web App lalu tempel URL-nya ke `APPS_SCRIPT_URL`.

## Catatan integrasi Google Spreadsheet
Static website di Vercel tidak bisa menulis langsung ke spreadsheet private hanya dengan HTML/CSS/JS frontend.
Karena itu saya siapkan `apps-script.gs` sebagai jembatan ringan.

## Struktur sheet yang dipakai
### Transactions
`id, date, time, supplier, driver, plate, tenera, dura, total, percentTenera, percentDura, createdAt`

### Suppliers
`id, name, wa, active`
