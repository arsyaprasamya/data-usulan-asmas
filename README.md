# Data Usulan ASMAS

Aplikasi pengelolaan Data Usulan Aset Modal (ASMAS) yang dibangun menggunakan Next.js dan Supabase.

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router) dengan TypeScript
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT Token
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form Handling**: React Hook Form dengan Zod validation
- **Date Handling**: date-fns

## Fitur

### Database Schema
- ✅ **SKPD**: Satuan Kerja Perangkat Daerah
- ✅ **Usulan**: Data usulan utama dengan coordinate dan relasi
- ✅ **Gambar Usulan**: Multiple gambar per usulan
- ✅ **Periode**: Tahun periode usulan
- ✅ **Status Usulan**: Status workflow usulan

### REST API Endpoints
- ✅ **Authentication**: Token-based dengan JWT
- ✅ **CRUD Usulan**: Create, Read, Update, Delete usulan
- ✅ **Filtering**: Berdasarkan tahun, status, SKPD, dan pencarian
- ✅ **Pagination**: Support pagination untuk list data
- ✅ **Soft Delete**: Penghapusan tidak permanen
- ✅ **Master Data**: Endpoint untuk dropdown/select options

### Frontend
- ✅ **Responsive Design**: 3 kolom desktop, 1 kolom mobile
- ✅ **Card Layout**: Tampilan menarik dengan preview gambar
- ✅ **Search & Filter**: Real-time filtering dan pagination
- ✅ **Authentication UI**: Login form dengan demo credentials

## Cara Menjalankan Project

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase

### 1. Clone Repository
```bash
git clone https://github.com/arsyaprasamya/data-usulan-asmas.git
cd data-usulan-asmas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

#### A. Buat Project Supabase
1. Pergi ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru
3. Tunggu hingga database siap

#### B. Jalankan SQL Schema
1. Buka SQL Editor di Supabase Dashboard
2. Copy paste isi file \`database/schema.sql\`
3. Jalankan SQL untuk membuat tables dan sample data

#### C. Setup Environment Variables
1. Copy file environment:
   ```bash
   cp .env.example .env.local
   ```

2. Isi nilai environment variables di \`.env.local\`:
   ```bash
   # Ambil dari Settings > API di Supabase Dashboard
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Generate random secret untuk JWT
   JWT_SECRET=your_super_secret_jwt_key_at_least_256_bits
   ```

### 4. Jalankan Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### 5. Login ke Aplikasi
Gunakan demo credentials:
- **Email**: admin@usulan-asmas.com  
- **Password**: admin123

## API Documentation

Base URL: \`http://localhost:3000/api\`

### Authentication

#### Generate Token
```http
POST /api/auth/token
Content-Type: application/json

{
  "email": "admin@usulan-asmas.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Token berhasil dibuat",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "userId": "1",
      "email": "admin@usulan-asmas.com",
      "role": "admin"
    },
    "expires_in": "24h"
  }
}
```

### Headers untuk API yang Memerlukan Authentication
```http
Authorization: Bearer <jwt_token>
```

### Master Data

#### Get Master Data
```http
GET /api/master
Authorization: Bearer <token>
```

Response: Data SKPD, Periode, dan Status Usulan untuk dropdown

### Usulan Endpoints

#### 1. Get List Usulan (dengan Filter dan Pagination)
```http
GET /api/usulan?tahun=2024&status_id=1&skpd_id=1&search=pembangunan&page=1&limit=10
Authorization: Bearer <token>
```

Query Parameters:
- \`tahun\` (optional): Filter berdasarkan tahun periode
- \`status_id\` (optional): Filter berdasarkan status usulan
- \`skpd_id\` (optional): Filter berdasarkan SKPD
- \`search\` (optional): Pencarian di judul atau pengusul
- \`page\` (optional): Halaman (default: 1)
- \`limit\` (optional): Jumlah per halaman (default: 10)

Response:
```json
{
  "success": true,
  "message": "Data usulan berhasil diambil",
  "data": {
    "data": [
      {
        "id": 1,
        "judul": "Pembangunan Puskesmas Keliling",
        "deskripsi": "Usulan pembangunan puskesmas keliling untuk daerah terpencil",
        "pengusul": "Dr. Sari Wahyuni",
        "kode_wilayah": "31.01.01.001",
        "latitude": -6.200000,
        "longitude": 106.816666,
        "skpd": {
          "id": 1,
          "nama": "Dinas Kesehatan",
          "alamat": "Jl. Sudirman No. 1, Jakarta"
        },
        "periode": {
          "id": 2,
          "tahun": 2024
        },
        "status_usulan": {
          "id": 2,
          "nama": "Dalam Review"
        },
        "gambar_usulan": [
          {
            "id": 1,
            "file_path": "/path/to/image.jpg",
            "keterangan": "Lokasi usulan"
          }
        ],
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

#### 2. Get Detail Usulan
```http
GET /api/usulan/{id}
Authorization: Bearer <token>
```

#### 3. Create Usulan Baru
```http
POST /api/usulan
Authorization: Bearer <token>
Content-Type: application/json

{
  "judul": "Usulan Baru",
  "deskripsi": "Deskripsi usulan",
  "pengusul": "Nama Pengusul",
  "kode_wilayah": "31.01.01.001",
  "latitude": -6.200000,
  "longitude": 106.816666,
  "skpd_id": 1,
  "periode_id": 2,
  "status_id": 1,
  "gambar": [
    {
      "file_path": "/path/to/image1.jpg",
      "keterangan": "Gambar 1"
    },
    {
      "file_path": "/path/to/image2.jpg", 
      "keterangan": "Gambar 2"
    }
  ]
}
```

#### 4. Update Usulan
```http
PUT /api/usulan/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "judul": "Judul yang diperbarui",
  "status_id": 3,
  // fields lainnya...
}
```

#### 5. Delete Usulan (Soft Delete)
```http
DELETE /api/usulan/{id}
Authorization: Bearer <token>
```

### Response Format

Semua API menggunakan format response yang konsisten:

Success Response:
```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": { ... }
}
```

Error Response:
```json
{
  "success": false,
  "message": "Pesan error"
}
```

### Error Codes
- \`400\`: Bad Request - Data tidak valid
- \`401\`: Unauthorized - Token tidak valid atau tidak ada
- \`404\`: Not Found - Data tidak ditemukan
- \`500\`: Internal Server Error - Kesalahan server

## Struktur Project

```
data-usulan-asmas/
├── database/
│   └── schema.sql          # Database schema dan sample data
├── public/                 # Static assets
│   ├── next.svg           # Next.js logo
│   ├── vercel.svg         # Vercel logo
│   └── *.svg              # Other icons
├── src/
│   ├── app/
│   │   ├── api/            # REST API endpoints
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   │   └── token/
│   │   │   │       └── route.ts  # JWT token generation
│   │   │   ├── usulan/     # Usulan CRUD endpoints
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts  # Individual usulan operations
│   │   │   │   └── route.ts      # List & create usulan
│   │   │   └── master/     # Master data endpoints
│   │   │       └── route.ts      # Master data API
│   │   ├── page.tsx        # Halaman utama dengan card layout
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   └── favicon.ico     # App favicon
│   ├── components/         # React components
│   │   ├── UsulanCard.tsx  # Komponen card usulan
│   │   ├── FilterBar.tsx   # Komponen filter dan search
│   │   └── Pagination.tsx  # Komponen pagination
│   ├── lib/                # Utility libraries
│   │   ├── supabase.ts     # Supabase client dan types
│   │   ├── database.ts     # Database operations
│   │   ├── jwt.ts          # JWT utilities
│   │   ├── middleware.ts   # API middleware
│   │   └── api-client.ts   # Frontend API client
│   └── types/
│       └── index.ts        # TypeScript type definitions
├── database_dump.sql       # Complete database schema & sample data
├── setup_database.sql      # Simple database setup
├── simple_setup.sql        # Minimal database setup
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies & scripts
├── package-lock.json      # Dependency lock file
├── postcss.config.mjs     # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Dokumentasi project
```

## Deployment

### Vercel (Recommended)
1. Push ke repository GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy otomatis

### Manual Deployment
1. Build project: \`npm run build\`
2. Start production server: \`npm start\`

### Database Migration
Untuk production, gunakan Supabase Migration tool atau jalankan SQL manual di Supabase dashboard.

## Fitur yang Bisa Dikembangkan

- [ ] File upload untuk gambar usulan
- [ ] Email notifications untuk perubahan status  
- [ ] Reporting dan dashboard analytics
- [ ] Role-based access control yang lebih detail
- [ ] Integration dengan GIS/mapping service
- [ ] Bulk import/export data
- [ ] Mobile app dengan React Native

## Troubleshooting

### Database Connection Error
- Pastikan environment variables Supabase sudah benar
- Cek network connection ke Supabase
- Pastikan RLS policies sudah di-setup dengan benar

### Authentication Error
- Cek JWT_SECRET di environment variables
- Pastikan token masih valid (belum expired)
- Cek format header Authorization: Bearer <token>

### Build Error
- Run \`npm install\` ulang
- Cek TypeScript errors dengan \`npm run type-check\`
- Clear cache dengan \`rm -rf .next\`

## Contributing

1. Fork repository
2. Create feature branch: \`git checkout -b feature/new-feature\`
3. Commit changes: \`git commit -m 'Add new feature'\`
4. Push branch: \`git push origin feature/new-feature\`
5. Submit Pull Request

## License

MIT License - lihat file LICENSE untuk detail lengkap.

---

Dibuat dengan ❤️ menggunakan Next.js dan Supabase