-- ============================================================
-- LANDLY – Migration 002: Auth Users + Authenticated RLS
-- Chạy file này trong Supabase Dashboard > SQL Editor
-- ============================================================

-- ─── AUTHENTICATED READ POLICIES ────────────────────────────
-- Dashboard pages dùng session cookie → role = authenticated
-- Cần thêm policy riêng (policy anon không áp dụng cho authenticated)

CREATE POLICY "authenticated_read" ON users             FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read" ON properties        FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read" ON transactions      FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read" ON loan_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read" ON commissions       FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read" ON property_images   FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read" ON transaction_logs  FOR SELECT TO authenticated USING (true);

-- ─── AUTH USERS ──────────────────────────────────────────────
-- Tạo tài khoản đăng nhập trong Supabase Auth
-- Mật khẩu mặc định: Landly@123

INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud
) VALUES
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'tuan.doi.tac@landly.vn',
    crypt('Landly@123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, 'authenticated', 'authenticated'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'khanh.owner@landly.vn',
    crypt('Landly@123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, 'authenticated', 'authenticated'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'binh.buyer@landly.vn',
    crypt('Landly@123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, 'authenticated', 'authenticated'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'huong.bank@landly.vn',
    crypt('Landly@123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, 'authenticated', 'authenticated'
  );

-- Also insert into auth.identities (required for email provider)
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, created_at, updated_at
) VALUES
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '{"sub":"aaaaaaaa-0000-0000-0000-000000000001","email":"tuan.doi.tac@landly.vn"}',
    'email', 'tuan.doi.tac@landly.vn', now(), now()
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '{"sub":"aaaaaaaa-0000-0000-0000-000000000002","email":"khanh.owner@landly.vn"}',
    'email', 'khanh.owner@landly.vn', now(), now()
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000003',
    '{"sub":"aaaaaaaa-0000-0000-0000-000000000003","email":"binh.buyer@landly.vn"}',
    'email', 'binh.buyer@landly.vn', now(), now()
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    'aaaaaaaa-0000-0000-0000-000000000004',
    '{"sub":"aaaaaaaa-0000-0000-0000-000000000004","email":"huong.bank@landly.vn"}',
    'email', 'huong.bank@landly.vn', now(), now()
  );

-- ─── LINK PUBLIC USERS TO AUTH USERS ────────────────────────
UPDATE users SET auth_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE email = 'tuan.doi.tac@landly.vn';
UPDATE users SET auth_id = 'aaaaaaaa-0000-0000-0000-000000000002' WHERE email = 'khanh.owner@landly.vn';
UPDATE users SET auth_id = 'aaaaaaaa-0000-0000-0000-000000000003' WHERE email = 'binh.buyer@landly.vn';
UPDATE users SET auth_id = 'aaaaaaaa-0000-0000-0000-000000000004' WHERE email = 'huong.bank@landly.vn';
