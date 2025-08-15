-- Database Schema untuk Aplikasi Data Usulan ASMAS
-- Tech Stack: Next.js + Supabase (PostgreSQL)

-- Enable RLS (Row Level Security)
ALTER DEFAULT PRIVILEGES REVOKE ALL ON TABLES FROM public;
ALTER DEFAULT PRIVILEGES GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

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

-- Create indexes for better performance
CREATE INDEX idx_usulan_skpd_id ON usulan(skpd_id);
CREATE INDEX idx_usulan_periode_id ON usulan(periode_id);
CREATE INDEX idx_usulan_status_id ON usulan(status_id);
CREATE INDEX idx_usulan_deleted_at ON usulan(deleted_at);
CREATE INDEX idx_gambar_usulan_usulan_id ON gambar_usulan(usulan_id);

-- Update triggers untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Enable RLS pada tables
ALTER TABLE skpd ENABLE ROW LEVEL SECURITY;
ALTER TABLE periode ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_usulan ENABLE ROW LEVEL SECURITY;
ALTER TABLE usulan ENABLE ROW LEVEL SECURITY;
ALTER TABLE gambar_usulan ENABLE ROW LEVEL SECURITY;

-- Create policies untuk RLS (allow all for authenticated users)
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

-- Insert sample data untuk testing
INSERT INTO skpd (nama, alamat) VALUES 
('Dinas Kesehatan', 'Jl. Sudirman No. 1, Jakarta'),
('Dinas Pendidikan', 'Jl. Thamrin No. 5, Jakarta'),
('Dinas Pekerjaan Umum', 'Jl. Gatot Subroto No. 10, Jakarta');

INSERT INTO periode (tahun) VALUES 
(2023), (2024), (2025);

INSERT INTO status_usulan (nama) VALUES 
('Diajukan'),
('Dalam Review'),
('Disetujui'),
('Ditolak'),
('Selesai');

-- Sample usulan data
INSERT INTO usulan (judul, deskripsi, pengusul, kode_wilayah, latitude, longitude, skpd_id, periode_id, status_id) VALUES 
('Pembangunan Puskesmas Keliling', 'Usulan pembangunan puskesmas keliling untuk daerah terpencil', 'Dr. Sari Wahyuni', '31.01.01.001', -6.200000, 106.816666, 1, 2, 2),
('Renovasi Sekolah Dasar', 'Renovasi SD Negeri 01 yang sudah rusak', 'Ahmad Fauzi, S.Pd', '31.01.02.001', -6.175110, 106.865039, 2, 2, 1),
('Perbaikan Jalan Desa', 'Perbaikan jalan utama desa yang rusak parah', 'Ir. Budi Santoso', '31.01.03.001', -6.208763, 106.845599, 3, 2, 3);
