-- ============================================================
-- LANDLY – Initial Schema Migration
-- Chạy file này trong Supabase Dashboard > SQL Editor
-- ============================================================

-- ─── ENUM TYPES ─────────────────────────────────────────────

CREATE TYPE vai_tro AS ENUM (
  'doi_tac', 'chu_so_huu', 'nguoi_mua', 'nhan_vien_ngan_hang'
);

CREATE TYPE loai_tai_san AS ENUM (
  'can_ho', 'nha_pho', 'dat_nen', 'biet_thu', 'van_phong'
);

CREATE TYPE trang_thai_tai_san AS ENUM (
  'cho_ban', 'dang_giao_dich', 'da_ban', 'cho_thue', 'dang_thue'
);

CREATE TYPE trang_thai_giao_dich AS ENUM (
  'tiem_nang', 'dam_phan', 'cho_ky_hop_dong',
  'cho_thanh_toan', 'hoan_thanh', 'huy_bo'
);

CREATE TYPE trang_thai_ho_so_vay AS ENUM (
  'chua_nop', 'dang_xu_ly', 'cho_phe_duyet',
  'da_duyet', 'tu_choi', 'da_giai_ngan'
);

-- ─── TABLES ─────────────────────────────────────────────────

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ho_ten          TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  so_dien_thoai   TEXT,
  vai_tro         vai_tro NOT NULL,
  avatar_url      TEXT,
  ngay_tao        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ngay_cap_nhat   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten             TEXT NOT NULL,
  dia_chi         TEXT NOT NULL,
  tinh_thanh      TEXT NOT NULL DEFAULT 'TP.HCM',
  loai            loai_tai_san NOT NULL,
  dien_tich       NUMERIC(10, 2) NOT NULL,
  gia             BIGINT NOT NULL,
  trang_thai      trang_thai_tai_san NOT NULL DEFAULT 'cho_ban',
  chu_so_huu_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  mo_ta           TEXT,
  ngay_dang       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ngay_cap_nhat   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tai_san_id      UUID REFERENCES properties(id) ON DELETE SET NULL,
  ten_tai_san     TEXT NOT NULL,
  nguoi_ban_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  ten_nguoi_ban   TEXT NOT NULL,
  nguoi_mua_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  ten_nguoi_mua   TEXT NOT NULL,
  doi_tac_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  ten_doi_tac     TEXT,
  gia_giao_dich   BIGINT NOT NULL,
  trang_thai      trang_thai_giao_dich NOT NULL DEFAULT 'tiem_nang',
  ghi_chu         TEXT,
  ngay_tao        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ngay_cap_nhat   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE loan_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giao_dich_id    UUID REFERENCES transactions(id) ON DELETE SET NULL,
  khach_hang_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  ten_khach_hang  TEXT NOT NULL,
  ngan_hang       TEXT NOT NULL,
  nhan_vien_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  so_tien_vay     BIGINT NOT NULL,
  lai_suat        NUMERIC(5, 2) NOT NULL,
  thoi_han        INTEGER NOT NULL,
  trang_thai      trang_thai_ho_so_vay NOT NULL DEFAULT 'chua_nop',
  ghi_chu         TEXT,
  ngay_nop        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ngay_cap_nhat   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE commissions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giao_dich_id                UUID REFERENCES transactions(id) ON DELETE SET NULL,
  ten_tai_san                 TEXT NOT NULL,
  doi_tac_id                  UUID REFERENCES users(id) ON DELETE SET NULL,
  ten_doi_tac                 TEXT NOT NULL,
  ti_le                       NUMERIC(5, 2) NOT NULL,
  so_tien                     BIGINT NOT NULL,
  da_thanh_toan               BOOLEAN NOT NULL DEFAULT FALSE,
  ngay_du_kien_thanh_toan     DATE,
  ngay_thanh_toan             DATE,
  ngay_tao                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE property_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tai_san_id    UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  alt           TEXT,
  la_anh_chinh  BOOLEAN NOT NULL DEFAULT FALSE,
  thu_tu        INTEGER NOT NULL DEFAULT 0,
  ngay_tao      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transaction_logs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giao_dich_id          UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  nguoi_thuc_hien_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  hanh_dong             TEXT NOT NULL,
  trang_thai_cu         trang_thai_giao_dich,
  trang_thai_moi        trang_thai_giao_dich,
  ghi_chu               TEXT,
  ngay_tao              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ────────────────────────────────────────────────

CREATE INDEX idx_properties_chu_so_huu  ON properties(chu_so_huu_id);
CREATE INDEX idx_properties_trang_thai  ON properties(trang_thai);

CREATE INDEX idx_transactions_tai_san   ON transactions(tai_san_id);
CREATE INDEX idx_transactions_ban       ON transactions(nguoi_ban_id);
CREATE INDEX idx_transactions_mua       ON transactions(nguoi_mua_id);
CREATE INDEX idx_transactions_doi_tac   ON transactions(doi_tac_id);
CREATE INDEX idx_transactions_trang_thai ON transactions(trang_thai);

CREATE INDEX idx_loans_khach_hang       ON loan_applications(khach_hang_id);
CREATE INDEX idx_loans_nhan_vien        ON loan_applications(nhan_vien_id);
CREATE INDEX idx_loans_trang_thai       ON loan_applications(trang_thai);

CREATE INDEX idx_commissions_doi_tac    ON commissions(doi_tac_id);
CREATE INDEX idx_commissions_giao_dich  ON commissions(giao_dich_id);

CREATE INDEX idx_images_tai_san         ON property_images(tai_san_id);
CREATE INDEX idx_logs_giao_dich         ON transaction_logs(giao_dich_id);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties        ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs  ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc public (anon) – thắt chặt lại khi có auth
CREATE POLICY "public_read" ON users             FOR SELECT TO anon USING (true);
CREATE POLICY "public_read" ON properties        FOR SELECT TO anon USING (true);
CREATE POLICY "public_read" ON transactions      FOR SELECT TO anon USING (true);
CREATE POLICY "public_read" ON loan_applications FOR SELECT TO anon USING (true);
CREATE POLICY "public_read" ON commissions       FOR SELECT TO anon USING (true);
CREATE POLICY "public_read" ON property_images   FOR SELECT TO anon USING (true);
CREATE POLICY "public_read" ON transaction_logs  FOR SELECT TO anon USING (true);

-- ─── SEED DATA ───────────────────────────────────────────────
-- Mock data khớp với dashboard UI

INSERT INTO users (id, ho_ten, email, so_dien_thoai, vai_tro) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn',   'tuan.doi.tac@landly.vn',   '0901234501', 'doi_tac'),
  ('11111111-0000-0000-0000-000000000002', 'Trần Văn Khánh',     'khanh.owner@landly.vn',    '0901234502', 'chu_so_huu'),
  ('11111111-0000-0000-0000-000000000003', 'Lê Thị Bình',        'binh.buyer@landly.vn',     '0901234503', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000004', 'Phạm Thị Hương',     'huong.bank@landly.vn',     '0901234504', 'nhan_vien_ngan_hang'),
  ('11111111-0000-0000-0000-000000000005', 'Trần Văn An',        'an@landly.vn',             '0901234505', 'chu_so_huu'),
  ('11111111-0000-0000-0000-000000000006', 'Đinh Văn Dũng',      'dung@landly.vn',           '0901234506', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000007', 'Hoàng Lan Anh',      'anh@landly.vn',            '0901234507', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000008', 'Bùi Anh Khoa',       'khoa@landly.vn',           '0901234508', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000009', 'Trương Minh Phúc',   'phuc@landly.vn',           '0901234509', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000010', 'Nguyễn Thành Nam',   'nam@landly.vn',            '0901234510', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000011', 'Trần Minh Châu',     'chau@landly.vn',           '0901234511', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000012', 'Võ Thị Lan',         'lan@landly.vn',            '0901234512', 'nguoi_mua'),
  ('11111111-0000-0000-0000-000000000013', 'Đặng Quốc Việt',     'viet@landly.vn',           '0901234513', 'nguoi_mua');

INSERT INTO properties (id, ten, dia_chi, tinh_thanh, loai, dien_tich, gia, trang_thai, chu_so_huu_id) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Căn hộ Vinhomes Grand Park Q9',  '185 Nguyễn Xiển, Q9',            'TP.HCM', 'can_ho',  68,  3200000000, 'dang_giao_dich', '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000002', 'Nhà phố Bình Thạnh 85m²',       '42 Nơ Trang Long, Bình Thạnh',   'TP.HCM', 'nha_pho', 85,  6800000000, 'cho_ban',        '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000003', 'Đất nền Nhà Bè 120m²',          'KDC Him Lam, Nhà Bè',            'TP.HCM', 'dat_nen', 120, 2100000000, 'da_ban',         '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000004', 'Biệt thự Thảo Điền 350m²',      '28 Thảo Điền, Q2',               'TP.HCM', 'biet_thu',350, 18500000000,'cho_ban',        '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000005', 'Căn hộ Masteri Thảo Điền',      '159 Xa lộ Hà Nội, Q2',           'TP.HCM', 'can_ho',  70,  4500000000, 'dang_giao_dich', '11111111-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000006', 'Căn hộ The Estella An Phú',     '88 Song Hành, An Phú, Q2',        'TP.HCM', 'can_ho',  75,  4100000000, 'cho_ban',        '11111111-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000007', 'Nhà phố Gò Vấp 60m²',          '15 Nguyễn Văn Nghi, Gò Vấp',     'TP.HCM', 'nha_pho', 60,  5200000000, 'cho_ban',        '11111111-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000008', 'Căn hộ Sunrise City View Q7',   '25 Nguyễn Hữu Thọ, Q7',          'TP.HCM', 'can_ho',  82,  3750000000, 'cho_ban',        '11111111-0000-0000-0000-000000000005');

INSERT INTO transactions (id, tai_san_id, ten_tai_san, nguoi_ban_id, ten_nguoi_ban, nguoi_mua_id, ten_nguoi_mua, doi_tac_id, ten_doi_tac, gia_giao_dich, trang_thai, ngay_tao, ngay_cap_nhat) VALUES
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Căn hộ Vinhomes Grand Park Q9', '11111111-0000-0000-0000-000000000002', 'Trần Văn Khánh', '11111111-0000-0000-0000-000000000003', 'Lê Thị Bình',       '11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn', 3200000000,  'cho_ky_hop_dong', '2026-04-01', '2026-04-28'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Nhà phố Bình Thạnh 85m²',      '11111111-0000-0000-0000-000000000002', 'Trần Văn Khánh', '11111111-0000-0000-0000-000000000007', 'Hoàng Lan Anh',     '11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn', 6800000000,  'dam_phan',        '2026-03-15', '2026-04-30'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 'Đất nền Nhà Bè 120m²',         '11111111-0000-0000-0000-000000000002', 'Trần Văn Khánh', '11111111-0000-0000-0000-000000000006', 'Đinh Văn Dũng',     '11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn', 2100000000,  'hoan_thanh',      '2026-02-20', '2026-04-10'),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000004', 'Biệt thự Thảo Điền 350m²',     '11111111-0000-0000-0000-000000000002', 'Trần Văn Khánh', '11111111-0000-0000-0000-000000000008', 'Bùi Anh Khoa',      '11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn', 18500000000, 'tiem_nang',       '2026-04-20', '2026-04-29'),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005', 'Căn hộ Masteri Thảo Điền',     '11111111-0000-0000-0000-000000000005', 'Trần Văn An',    '11111111-0000-0000-0000-000000000009', 'Trương Minh Phúc',  '11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn', 4500000000,  'cho_thanh_toan',  '2026-04-05', '2026-04-25');

INSERT INTO commissions (id, giao_dich_id, ten_tai_san, doi_tac_id, ten_doi_tac, ti_le, so_tien, da_thanh_toan, ngay_thanh_toan, ngay_du_kien_thanh_toan) VALUES
  ('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000003', 'Đất nền Nhà Bè 120m²',     '11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn', 2.0, 42000000,  TRUE,  '2026-04-12', NULL),
  ('44444444-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000005', 'Căn hộ Masteri Thảo Điền', '11111111-0000-0000-0000-000000000001', 'Nguyễn Minh Tuấn', 2.0, 90000000,  FALSE, NULL,         '2026-05-10');

INSERT INTO loan_applications (id, giao_dich_id, khach_hang_id, ten_khach_hang, ngan_hang, nhan_vien_id, so_tien_vay, lai_suat, thoi_han, trang_thai, ghi_chu, ngay_nop, ngay_cap_nhat) VALUES
  ('55555555-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Lê Thị Bình',        'Vietcombank', '11111111-0000-0000-0000-000000000004', 1920000000, 8.5, 240, 'cho_phe_duyet', 'Chờ bổ sung sao kê 6 tháng',    '2026-04-15', '2026-04-28'),
  ('55555555-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000008', 'Bùi Anh Khoa',       'Vietcombank', '11111111-0000-0000-0000-000000000004', 9250000000, 7.8, 300, 'dang_xu_ly',    'Đang thẩm định tài sản',        '2026-04-22', '2026-04-29'),
  ('55555555-0000-0000-0000-000000000003', NULL,                                  '11111111-0000-0000-0000-000000000010', 'Nguyễn Thành Nam',   'Vietcombank', '11111111-0000-0000-0000-000000000004', 2600000000, 8.2, 180, 'da_duyet',      'Chờ giải ngân đợt 1',           '2026-04-01', '2026-04-25'),
  ('55555555-0000-0000-0000-000000000004', NULL,                                  '11111111-0000-0000-0000-000000000011', 'Trần Minh Châu',     'Vietcombank', '11111111-0000-0000-0000-000000000004', 3100000000, 8.0, 240, 'dang_xu_ly',    'Xác minh thu nhập',             '2026-04-18', '2026-04-28'),
  ('55555555-0000-0000-0000-000000000005', NULL,                                  '11111111-0000-0000-0000-000000000012', 'Võ Thị Lan',         'Vietcombank', '11111111-0000-0000-0000-000000000004', 1500000000, 9.0, 120, 'tu_choi',       'Không đủ điều kiện thu nhập',   '2026-03-20', '2026-04-10'),
  ('55555555-0000-0000-0000-000000000006', NULL,                                  '11111111-0000-0000-0000-000000000013', 'Đặng Quốc Việt',    'Vietcombank', '11111111-0000-0000-0000-000000000004', 4200000000, 7.5, 360, 'da_giai_ngan',  'Giải ngân đầy đủ',              '2026-02-10', '2026-04-05');
