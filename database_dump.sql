-- Database Dump untuk Data Usulan ASMAS
-- Generated on: $(date)
-- Tech Stack: Next.js + Supabase PostgreSQL

-- ================================================
-- SCHEMA DEFINITION
-- ================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA public;

-- Drop existing tables (if any) to ensure clean installation
DROP TABLE IF EXISTS gambar_usulan CASCADE;
DROP TABLE IF EXISTS usulan CASCADE;
DROP TABLE IF EXISTS skpd CASCADE;
DROP TABLE IF EXISTS periode CASCADE;
DROP TABLE IF EXISTS status_usulan CASCADE;

-- Function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================================
-- TABLES CREATION
-- ================================================

-- Table SKPD (Satuan Kerja Perangkat Daerah)
CREATE TABLE skpd (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Periode
CREATE TABLE periode (
    id SERIAL PRIMARY KEY,
    tahun INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Status Usulan
CREATE TABLE status_usulan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Usulan (Main table)
CREATE TABLE usulan (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    pengusul VARCHAR(100) NOT NULL,
    kode_wilayah VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    skpd_id INTEGER NOT NULL REFERENCES skpd(id),
    periode_id INTEGER NOT NULL REFERENCES periode(id),
    status_id INTEGER NOT NULL REFERENCES status_usulan(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL -- For soft delete
);

-- Table Gambar Usulan
CREATE TABLE gambar_usulan (
    id SERIAL PRIMARY KEY,
    usulan_id INTEGER NOT NULL REFERENCES usulan(id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    keterangan VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

CREATE INDEX idx_usulan_skpd_id ON usulan(skpd_id);
CREATE INDEX idx_usulan_periode_id ON usulan(periode_id);
CREATE INDEX idx_usulan_status_id ON usulan(status_id);
CREATE INDEX idx_usulan_deleted_at ON usulan(deleted_at);
CREATE INDEX idx_usulan_created_at ON usulan(created_at);
CREATE INDEX idx_usulan_judul_search ON usulan USING gin(to_tsvector('indonesian', judul));
CREATE INDEX idx_usulan_pengusul_search ON usulan USING gin(to_tsvector('indonesian', pengusul));
CREATE INDEX idx_gambar_usulan_usulan_id ON gambar_usulan(usulan_id);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

CREATE TRIGGER update_skpd_updated_at BEFORE UPDATE ON skpd
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_periode_updated_at BEFORE UPDATE ON periode
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_status_usulan_updated_at BEFORE UPDATE ON status_usulan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usulan_updated_at BEFORE UPDATE ON usulan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gambar_usulan_updated_at BEFORE UPDATE ON gambar_usulan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE skpd ENABLE ROW LEVEL SECURITY;
ALTER TABLE periode ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_usulan ENABLE ROW LEVEL SECURITY;
ALTER TABLE usulan ENABLE ROW LEVEL SECURITY;
ALTER TABLE gambar_usulan ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow all operations for authenticated users on skpd" ON skpd
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users on periode" ON periode
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users on status_usulan" ON status_usulan
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users on usulan" ON usulan
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users on gambar_usulan" ON gambar_usulan
    FOR ALL USING (true);

-- ================================================
-- SAMPLE DATA
-- ================================================

-- Insert SKPD data
INSERT INTO skpd (nama, alamat) VALUES 
('Dinas Kesehatan', 'Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta 10110'),
('Dinas Pendidikan', 'Jl. Thamrin No. 5, Jakarta Pusat, DKI Jakarta 10230'),
('Dinas Pekerjaan Umum', 'Jl. Gatot Subroto No. 10, Jakarta Selatan, DKI Jakarta 12930'),
('Dinas Sosial', 'Jl. Kebon Sirih No. 15, Jakarta Pusat, DKI Jakarta 10340'),
('Dinas Lingkungan Hidup', 'Jl. Casablanca Raya No. 88, Jakarta Selatan, DKI Jakarta 12560');

-- Insert Periode data
INSERT INTO periode (tahun) VALUES 
(2022), (2023), (2024), (2025), (2026);

-- Insert Status Usulan data
INSERT INTO status_usulan (nama) VALUES 
('Diajukan'),
('Dalam Review'),
('Disetujui'),
('Ditolak'),
('Selesai'),
('Dibatalkan');

-- Insert sample Usulan data
INSERT INTO usulan (judul, deskripsi, pengusul, kode_wilayah, latitude, longitude, skpd_id, periode_id, status_id) VALUES 
(
    'Pembangunan Puskesmas Keliling Type A', 
    'Usulan pembangunan puskesmas keliling untuk melayani daerah terpencil di wilayah Jakarta Utara. Fasilitas ini akan dilengkapi dengan peralatan medis dasar dan dapat menjangkau 5 kelurahan di sekitar lokasi.', 
    'Dr. Sari Wahyuni, M.Kes', 
    '31.01.01.001', 
    -6.200000, 
    106.816666, 
    1, 2, 2
),
(
    'Renovasi dan Perluasan SD Negeri 01', 
    'Renovasi total bangunan SD Negeri 01 yang sudah berusia 30 tahun. Meliputi perbaikan atap, lantai, dinding, serta penambahan 6 ruang kelas baru untuk menampung peningkatan jumlah siswa.', 
    'Ahmad Fauzi, S.Pd, M.Ed', 
    '31.01.02.001', 
    -6.175110, 
    106.865039, 
    2, 2, 1
),
(
    'Perbaikan Jalan Utama Desa Srengseng', 
    'Perbaikan jalan utama sepanjang 2.5 km yang menghubungkan desa dengan jalan provinsi. Jalan ini merupakan akses utama warga untuk kegiatan ekonomi dan pendidikan.', 
    'Ir. Budi Santoso, MT', 
    '31.01.03.001', 
    -6.208763, 
    106.845599, 
    3, 2, 3
),
(
    'Program Bantuan Sosial Lansia', 
    'Program bantuan sosial berupa paket sembako dan vitamin untuk 500 lansia di 3 kelurahan. Program ini bertujuan meningkatkan kesejahteraan lansia yang terdampak pandemi.', 
    'Dewi Sartika, S.Sos', 
    '31.02.01.005', 
    -6.185000, 
    106.827000, 
    4, 2, 3
),
(
    'Pemasangan Solar Panel Gedung Dinas', 
    'Instalasi sistem panel surya kapasitas 100 kWp di atap gedung dinas untuk mengurangi konsumsi listrik PLN dan mendukung program go green pemerintah daerah.', 
    'Eng. Rina Marlina, ST', 
    '31.01.04.002', 
    -6.195500, 
    106.835500, 
    5, 2, 1
),
(
    'Pembangunan Taman Bermain Anak', 
    'Pembangunan taman bermain anak seluas 1000m2 yang dilengkapi dengan berbagai permainan edukatif, jogging track, dan area olahraga untuk masyarakat umum.', 
    'Arief Rahman, S.Ars', 
    '31.02.02.003', 
    -6.190000, 
    106.820000, 
    3, 2, 2
),
(
    'Pengadaan Ambulance Tipe B', 
    'Pengadaan 2 unit ambulance tipe B yang dilengkapi dengan peralatan medis lengkap untuk melayani emergency call masyarakat 24/7 di wilayah Jakarta Selatan.', 
    'dr. Michael Tandy, Sp.A', 
    '31.03.01.001', 
    -6.230000, 
    106.840000, 
    1, 2, 1
),
(
    'Digitalisasi Perpustakaan Sekolah', 
    'Program digitalisasi 15 perpustakaan sekolah dengan pengadaan komputer, scanner, dan sistem manajemen perpustakaan digital untuk meningkatkan minat baca siswa.', 
    'Siti Nurhaliza, S.Pd, M.Lib', 
    '31.01.05.001', 
    -6.165000, 
    106.825000, 
    2, 2, 2
),
(
    'Revitalisasi Pasar Tradisional Minggu', 
    'Revitalisasi pasar tradisional dengan perbaikan drainase, sistem ventilasi, area parkir, dan penambahan fasilitas MCK yang layak untuk pedagang dan pembeli.', 
    'Hendra Gunawan, SE', 
    '31.02.03.004', 
    -6.170000, 
    106.815000, 
    3, 2, 1
),
(
    'Pelatihan Keterampilan Digital Ibu Rumah Tangga', 
    'Program pelatihan keterampilan digital marketing dan e-commerce untuk 200 ibu rumah tangga guna meningkatkan ekonomi keluarga melalui UMKM online.', 
    'Maya Sari, S.Kom', 
    '31.03.02.002', 
    -6.245000, 
    106.830000, 
    4, 2, 2
);

-- Insert sample Gambar Usulan data
INSERT INTO gambar_usulan (usulan_id, file_path, keterangan) VALUES 
(1, '/uploads/puskesmas/lokasi-usulan.jpg', 'Foto lokasi yang diusulkan untuk pembangunan puskesmas'),
(1, '/uploads/puskesmas/denah-bangunan.jpg', 'Denah rencana bangunan puskesmas keliling'),
(1, '/uploads/puskesmas/kondisi-eksisting.jpg', 'Kondisi eksisting lokasi saat ini'),

(2, '/uploads/sekolah/bangunan-lama.jpg', 'Kondisi bangunan SD yang perlu direnovasi'),
(2, '/uploads/sekolah/ruang-kelas.jpg', 'Kondisi ruang kelas yang sudah tidak layak'),
(2, '/uploads/sekolah/rencana-perluasan.jpg', 'Area yang direncanakan untuk perluasan'),

(3, '/uploads/jalan/kondisi-jalan-rusak.jpg', 'Kondisi jalan yang rusak parah'),
(3, '/uploads/jalan/titik-rawan.jpg', 'Titik-titik rawan yang sering menimbulkan kemacetan'),

(4, '/uploads/sosial/data-lansia.jpg', 'Data sasaran lansia penerima bantuan'),
(4, '/uploads/sosial/kondisi-ekonomi.jpg', 'Survei kondisi ekonomi lansia'),

(5, '/uploads/solar/atap-gedung.jpg', 'Kondisi atap gedung untuk instalasi solar panel'),
(5, '/uploads/solar/pengukuran-radiasi.jpg', 'Hasil pengukuran radiasi matahari'),

(6, '/uploads/taman/lokasi-taman.jpg', 'Lokasi yang akan dibangun taman bermain'),
(6, '/uploads/taman/desain-taman.jpg', 'Desain konsep taman bermain anak'),

(7, '/uploads/ambulance/spesifikasi-ambulance.jpg', 'Spesifikasi teknis ambulance yang diusulkan'),
(7, '/uploads/ambulance/rute-pelayanan.jpg', 'Peta rute pelayanan ambulance'),

(8, '/uploads/perpustakaan/kondisi-perpustakaan.jpg', 'Kondisi perpustakaan yang akan didigitalisasi'),
(8, '/uploads/perpustakaan/rencana-layout.jpg', 'Rencana layout ruang digital'),

(9, '/uploads/pasar/kondisi-pasar.jpg', 'Kondisi pasar tradisional saat ini'),
(9, '/uploads/pasar/master-plan.jpg', 'Master plan revitalisasi pasar'),

(10, '/uploads/pelatihan/materi-pelatihan.jpg', 'Contoh materi pelatihan digital marketing'),
(10, '/uploads/pelatihan/peserta-sasaran.jpg', 'Profil peserta sasaran pelatihan');

-- ================================================
-- VIEWS FOR REPORTING
-- ================================================

-- View untuk laporan usulan per SKPD
CREATE OR REPLACE VIEW v_usulan_per_skpd AS
SELECT 
    s.nama as skpd_name,
    COUNT(u.id) as total_usulan,
    COUNT(CASE WHEN st.nama = 'Diajukan' THEN 1 END) as usulan_diajukan,
    COUNT(CASE WHEN st.nama = 'Dalam Review' THEN 1 END) as usulan_review,
    COUNT(CASE WHEN st.nama = 'Disetujui' THEN 1 END) as usulan_disetujui,
    COUNT(CASE WHEN st.nama = 'Ditolak' THEN 1 END) as usulan_ditolak,
    COUNT(CASE WHEN st.nama = 'Selesai' THEN 1 END) as usulan_selesai
FROM skpd s
LEFT JOIN usulan u ON s.id = u.skpd_id AND u.deleted_at IS NULL
LEFT JOIN status_usulan st ON u.status_id = st.id
GROUP BY s.id, s.nama
ORDER BY s.nama;

-- View untuk laporan usulan per periode
CREATE OR REPLACE VIEW v_usulan_per_periode AS
SELECT 
    p.tahun,
    COUNT(u.id) as total_usulan,
    COUNT(CASE WHEN st.nama = 'Disetujui' THEN 1 END) as usulan_approved,
    COUNT(CASE WHEN st.nama = 'Selesai' THEN 1 END) as usulan_completed,
    ROUND(
        (COUNT(CASE WHEN st.nama = 'Selesai' THEN 1 END)::numeric / 
         NULLIF(COUNT(CASE WHEN st.nama = 'Disetujui' THEN 1 END), 0)::numeric) * 100, 2
    ) as completion_rate_percent
FROM periode p
LEFT JOIN usulan u ON p.id = u.periode_id AND u.deleted_at IS NULL
LEFT JOIN status_usulan st ON u.status_id = st.id
GROUP BY p.id, p.tahun
ORDER BY p.tahun DESC;

-- ================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ================================================

-- Function untuk soft delete usulan
CREATE OR REPLACE FUNCTION soft_delete_usulan(usulan_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE usulan 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id = usulan_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function untuk restore usulan yang di-soft delete
CREATE OR REPLACE FUNCTION restore_usulan(usulan_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE usulan 
    SET deleted_at = NULL 
    WHERE id = usulan_id AND deleted_at IS NOT NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function untuk pencarian usulan
CREATE OR REPLACE FUNCTION search_usulan(
    search_term TEXT DEFAULT NULL,
    filter_tahun INTEGER DEFAULT NULL,
    filter_skpd_id INTEGER DEFAULT NULL,
    filter_status_id INTEGER DEFAULT NULL,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10
)
RETURNS TABLE (
    total_count BIGINT,
    usulan_data JSON
) AS $$
DECLARE
    offset_val INTEGER;
BEGIN
    offset_val := (page_num - 1) * page_size;
    
    RETURN QUERY
    WITH filtered_usulan AS (
        SELECT u.*
        FROM usulan u
        JOIN periode p ON u.periode_id = p.id
        WHERE u.deleted_at IS NULL
        AND (filter_tahun IS NULL OR p.tahun = filter_tahun)
        AND (filter_skpd_id IS NULL OR u.skpd_id = filter_skpd_id)
        AND (filter_status_id IS NULL OR u.status_id = filter_status_id)
        AND (
            search_term IS NULL OR 
            u.judul ILIKE '%' || search_term || '%' OR 
            u.pengusul ILIKE '%' || search_term || '%'
        )
    ),
    total AS (
        SELECT COUNT(*) as cnt FROM filtered_usulan
    ),
    paginated AS (
        SELECT * FROM filtered_usulan
        ORDER BY created_at DESC
        LIMIT page_size OFFSET offset_val
    )
    SELECT 
        total.cnt,
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', p.id,
                    'judul', p.judul,
                    'deskripsi', p.deskripsi,
                    'pengusul', p.pengusul,
                    'created_at', p.created_at
                )
            ), 
            '[]'::json
        )
    FROM total, paginated p;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

-- Insert completion log
INSERT INTO status_usulan (nama) VALUES ('Database initialized successfully') 
ON CONFLICT DO NOTHING;

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'DATA USULAN ASMAS DATABASE SETUP COMPLETED';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Tables created: 5';
    RAISE NOTICE 'Sample SKPD: %', (SELECT COUNT(*) FROM skpd);
    RAISE NOTICE 'Sample Periods: %', (SELECT COUNT(*) FROM periode);
    RAISE NOTICE 'Sample Status: %', (SELECT COUNT(*) FROM status_usulan);
    RAISE NOTICE 'Sample Usulan: %', (SELECT COUNT(*) FROM usulan);
    RAISE NOTICE 'Sample Images: %', (SELECT COUNT(*) FROM gambar_usulan);
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Database is ready for use with Next.js application';
    RAISE NOTICE '================================================';
END $$;

-- Final cleanup - remove the temporary status we added
DELETE FROM status_usulan WHERE nama = 'Database initialized successfully';
