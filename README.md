# LaporKita – Frontend Next.js

Frontend untuk Sistem Pengaduan Masyarakat yang dibangun dengan **Next.js 14**, **Tailwind CSS**, dan **TypeScript**.

## Palet Warna

Menggunakan palet warna earthy / natural:
- **Primary** `#A98B76` – Coklat hangat (tombol utama, aksen)
- **Secondary** `#BFA98E` – Coklat muda
- **Cream** `#EFE5C8` – Latar belakang utama
- **Sage** `#8FA870` – Hijau zaitun (status disetujui, tombol sekunder)

## Fitur

- 🏠 **Landing Page** – Beranda publik dengan hero, fitur, statistik, CTA
- 🔐 **Auth** – Login & Register dengan JWT
- 📋 **Dashboard** – Daftar laporan, filter & pencarian, pagination
- 📝 **Buat Laporan** – Form lengkap dengan upload foto, deteksi GPS, alamat
- 🔍 **Detail Laporan** – Foto, komentar, lokasi, status
- 💬 **Komentar** – CRUD komentar per laporan
- 🛡️ **Admin Panel** – Kelola laporan (approve/reject/delete)
- 👥 **Super Admin** – CRUD user (tambah/edit/hapus)
- 👤 **Profil** – Edit username & ubah password

## Struktur Direktori

```
app/
├── page.tsx                  # Landing page
├── login/page.tsx            # Halaman login
├── register/page.tsx         # Halaman register
├── dashboard/
│   ├── page.tsx              # Dashboard laporan
│   └── profile/page.tsx      # Profil pengguna
├── laporan/
│   ├── baru/page.tsx         # Form buat laporan
│   └── [id]/page.tsx         # Detail laporan
└── admin/
    ├── laporan/page.tsx      # Admin: kelola laporan
    └── users/page.tsx        # Super Admin: kelola user
components/
├── layout/Navbar.tsx
├── ui/StatusBadge.tsx
├── ui/LoadingSpinner.tsx
└── laporan/ReportCard.tsx
lib/
├── api.ts                    # Axios API client
├── auth.ts                   # Auth helpers (cookie)
└── utils.ts                  # Utilities
```

## Setup & Instalasi

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi environment

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3001](http://localhost:3001) (port default Next.js, backend di 3000).

### 4. Build production

```bash
npm run build
npm start
```

## Integrasi Backend

Frontend ini terhubung ke backend Express.js dengan endpoint:

| Endpoint | Keterangan |
|----------|-----------|
| `POST /api/users/login` | Login |
| `POST /api/users/register` | Register |
| `GET /api/reports` | Daftar laporan |
| `POST /api/reports` | Buat laporan (multipart) |
| `GET /api/reports/:id` | Detail laporan |
| `PATCH /api/reports/:id/status` | Update status (Admin) |
| `DELETE /api/reports/:id` | Hapus laporan |
| `GET /api/comments/report/:id` | Komentar laporan |
| `POST /api/comments` | Buat komentar |
| `GET /api/users` | Semua user (Super Admin) |
| `POST /api/users/create` | Buat user (Super Admin) |
| `PUT /api/users/:id` | Edit user (Super Admin) |
| `DELETE /api/users/:id` | Hapus user (Super Admin) |

## Role & Akses

| Role | Akses |
|------|-------|
| `user` | Lihat laporan, buat laporan, komentar |
| `admin` | + Approve/reject laporan, hapus komentar |
| `super_admin` | + CRUD semua user |
