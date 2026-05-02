# Landly – Project Status

**Cập nhật:** 02/05/2026

## Trạng thái: 🟡 Đang phát triển

---

## Đã hoàn thành

### UI & Dashboard
- [x] Trang chủ `/` – chọn vai trò
- [x] Dashboard Đối Tác `/dashboard/doi-tac`
- [x] Dashboard Chủ Sở Hữu `/dashboard/chu-so-huu`
- [x] Dashboard Người Mua `/dashboard/nguoi-mua`
- [x] Dashboard Ngân Hàng `/dashboard/ngan-hang`
- [x] Component: Topbar, MetricCard, Badge, AlertBanner, LogoutButton

### Auth
- [x] Trang đăng nhập `/login`
- [x] Supabase Auth (email + password)
- [x] Redirect đúng dashboard theo `vai_tro`
- [x] Bảo vệ route `/dashboard/*` bằng `proxy.ts`
- [x] Nút Đăng xuất trên Topbar

### Database (Supabase)
- [x] Schema 7 bảng: `users`, `properties`, `transactions`, `loan_applications`, `commissions`, `property_images`, `transaction_logs`
- [x] RLS policy cho `anon` và `authenticated`
- [x] Seed data đầy đủ

### Deploy
- [x] GitHub: `bobo111vn/LANDLY`
- [x] Netlify: cấu hình `netlify.toml`

---

## Cần làm thủ công (Supabase Dashboard)

- [ ] Chạy `supabase/migrations/001_initial_schema.sql`
- [ ] Chạy `supabase/migrations/002_auth_seed.sql`
- [ ] Thêm env vars trên Netlify: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

## Tài khoản test

| Email | Mật khẩu | Vai trò |
|---|---|---|
| tuan.doi.tac@landly.vn | Landly@123 | Đối tác |
| khanh.owner@landly.vn | Landly@123 | Chủ sở hữu |
| binh.buyer@landly.vn | Landly@123 | Người mua |
| huong.bank@landly.vn | Landly@123 | Nhân viên ngân hàng |

---

## Stack

- Next.js 16.2.4 (App Router, Turbopack)
- React 19.2.4
- Tailwind CSS v4
- Supabase (Auth + PostgreSQL)
- Netlify (deploy)

## 👥 PHÂN CÔNG NHIỆM VỤ

### 🔴 LẬP TRÌNH VIÊN
Kết nối data Supabase vào dashboard, fix bug, deploy Netlify. KHÔNG thiết kế lại UI.

### 🔵 DATABASE
Schema, query, migration, seed data. KHÔNG đụng code Next.js.

### 🟡 UI / GIAO DIỆN
Code React components với mock data. KHÔNG kết nối database trực tiếp.

### 🟢 NGHIỆP VỤ & LOGIC
Định nghĩa quy trình, tính hoa hồng. KHÔNG viết code.

## 📋 CÁCH BẮT ĐẦU CONVERSATION MỚI
Paste vào đầu: "Đọc PROJECT_STATUS tại: https://github.com/bobo111vn/LANDLY/blob/main/PROJECT_STATUS.md. Nhiệm vụ hôm nay: [mô tả]"

## ⚠️ TUYỆT ĐỐI KHÔNG LÀM
- KHÔNG xóa bảng/cột database
- KHÔNG dùng NextAuth
- KHÔNG dùng src/app/
- KHÔNG deploy lên Vercel
- KHÔNG paste token vào chat
