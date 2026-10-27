# Panduan Deploy ke Vercel - Sistem Informasi Pelayanan Desa Adimulya

Aplikasi ini telah dikonfigurasi secara optimal untuk di-deploy dan dipublikasikan langsung ke **Vercel** sebagai Single Page Application (SPA) berbasis React + Vite.

---

## 🚀 Konfigurasi yang Telah Disiapkan

1. **`vercel.json`**
   - Framework preset: `vite`
   - Build command: `npm run build`
   - Output directory: `dist`
   - SPA Rewrites: Mengarahkan semua rute `/(.*)` ke `/index.html` sehingga navigasi halaman tidak menghasilkan error 404 saat di-refresh.
   - Cache-Control header untuk static assets (`/assets/*`).

2. **`package.json`**
   - Nama proyek diperbarui menjadi `si-pelayanan-desa-adimulya`.
   - Script build siap produksi dengan Vite 6+.

3. **`vite.config.ts`**
   - Path resolving kompatibel penuh dengan standar ESM Node.js terbaru di server build Vercel.

---

## 📦 Cara Deploy ke Vercel

### Metode 1: Menggunakan Git / GitHub (Disarankan)

1. **Push Proyek ke GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "feat: setup vercel deployment"
   git remote add origin https://github.com/username-anda/si-desa-adimulya.git
   git branch -M main
   git push -u origin main
   ```

2. **Buka Vercel**:
   - Kunjungi [https://vercel.com](https://vercel.com) dan login / daftar akun.
   - Klik tombol **"Add New..."** lalu pilih **"Project"**.
   - Hubungkan repository GitHub Anda (`si-desa-adimulya`).

3. **Pengaturan Proyek di Dashboard Vercel**:
   - **Framework Preset**: Vercel akan otomatis mendeteksi **Vite**.
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (atau `vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Klik "Deploy"**:
   - Vercel akan memproses build secara otomatis dalam waktu ~1 menit.
   - Setelah selesai, Anda akan mendapatkan URL publik langsung (contoh: `https://si-desa-adimulya.vercel.app`).

---

### Metode 2: Menggunakan Vercel CLI (Langsung dari Terminal)

Jika Anda ingin deploy langsung lewat terminal tanpa Git:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Jalankan Perintah Deploy**:
   ```bash
   vercel
   ```
   Ikuti petunjuk di terminal:
   - *Set up and deploy?* Ketik `y`
   - *Which scope?* Pilih akun Anda
   - *Link to existing project?* Ketik `n`
   - *Project name?* Tekan Enter untuk nama default
   - *In which directory?* Tekan Enter (`./`)
   - *Want to modify settings?* Ketik `n` (karena konfigurasi sudah otomatis terbaca dari `vercel.json`)

3. **Deploy ke Production**:
   ```bash
   vercel --prod
   ```

---

## ⚙️ Variabel Lingkungan (Environment Variables)

Aplikasi ini menggunakan mock storage dan arsitektur client-side siap pakai sehingga dapat langsung berjalan tanpa database eksternal. Jika nanti Anda menghubungkan API eksternal atau Google AI Studio Gemini API, Anda cukup menambahkan variabel pada menu **Settings > Environment Variables** di Vercel:
- `VITE_GEMINI_API_KEY`: *(Opsional, jika ingin mengaktifkan integrasi AI tambahan)*
