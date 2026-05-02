import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'
import type { TaiSan, GiaoDich } from '@/src/lib/types'

const mockUser = { ho_ten: 'Trần Văn Khánh', vai_tro: 'chu_so_huu' }

const mockTaiSan: TaiSan[] = [
  { id: 'TS001', ten: 'Căn hộ Vinhomes Grand Park Q9', dia_chi: '185 Nguyễn Xiển, Q9', tinh_thanh: 'TP.HCM', loai: 'can_ho', dien_tich: 68, gia: 3200000000, trang_thai: 'dang_giao_dich', chu_so_huu_id: 'U01', ngay_dang: '2026-03-01' },
  { id: 'TS002', ten: 'Nhà phố Bình Thạnh 85m²', dia_chi: '42 Nơ Trang Long, Bình Thạnh', tinh_thanh: 'TP.HCM', loai: 'nha_pho', dien_tich: 85, gia: 6800000000, trang_thai: 'cho_ban', chu_so_huu_id: 'U01', ngay_dang: '2026-02-15' },
  { id: 'TS003', ten: 'Đất nền Nhà Bè 120m²', dia_chi: 'KDC Him Lam, Nhà Bè', tinh_thanh: 'TP.HCM', loai: 'dat_nen', dien_tich: 120, gia: 2100000000, trang_thai: 'da_ban', chu_so_huu_id: 'U01', ngay_dang: '2025-12-10' },
  { id: 'TS004', ten: 'Biệt thự Thảo Điền 350m²', dia_chi: '28 Thảo Điền, Q2', tinh_thanh: 'TP.HCM', loai: 'biet_thu', dien_tich: 350, gia: 18500000000, trang_thai: 'cho_ban', chu_so_huu_id: 'U01', ngay_dang: '2026-04-10' },
]

const mockGiaoDich: GiaoDich[] = [
  { id: 'GD001', tai_san_id: 'TS001', ten_tai_san: 'Căn hộ Vinhomes Grand Park Q9', nguoi_ban_id: 'U01', ten_nguoi_ban: 'Trần Văn Khánh', nguoi_mua_id: 'U02', ten_nguoi_mua: 'Lê Thị Bình', gia_giao_dich: 3200000000, ngay_tao: '2026-04-01', ngay_cap_nhat: '2026-04-28', trang_thai: 'cho_ky_hop_dong' },
  { id: 'GD003', tai_san_id: 'TS003', ten_tai_san: 'Đất nền Nhà Bè 120m²', nguoi_ban_id: 'U01', ten_nguoi_ban: 'Trần Văn Khánh', nguoi_mua_id: 'U07', ten_nguoi_mua: 'Đinh Văn Dũng', gia_giao_dich: 2100000000, ngay_tao: '2026-02-20', ngay_cap_nhat: '2026-04-10', trang_thai: 'hoan_thanh' },
]

const loaiMap: Record<string, string> = { can_ho: 'Căn hộ', nha_pho: 'Nhà phố', dat_nen: 'Đất nền', biet_thu: 'Biệt thự', van_phong: 'Văn phòng' }

const trangThaiTSMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
  cho_ban: { label: 'Chờ bán', variant: 'blue' },
  dang_giao_dich: { label: 'Đang GD', variant: 'yellow' },
  da_ban: { label: 'Đã bán', variant: 'green' },
  cho_thue: { label: 'Chờ thuê', variant: 'purple' },
  dang_thue: { label: 'Đang thuê', variant: 'orange' },
}

function formatVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  return n.toLocaleString('vi-VN')
}

export default function ChuSoHuuDashboard() {
  const dangBan = mockTaiSan.filter(t => t.trang_thai === 'cho_ban').length
  const tongGiaTri = mockTaiSan.filter(t => t.trang_thai !== 'da_ban').reduce((s, t) => s + t.gia, 0)
  const giaoDichChoKy = mockGiaoDich.filter(g => g.trang_thai === 'cho_ky_hop_dong' || g.trang_thai === 'cho_thanh_toan').length
  const daBan = mockTaiSan.filter(t => t.trang_thai === 'da_ban').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={mockUser.vai_tro} hoTen={mockUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Chủ Sở Hữu</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {mockUser.ho_ten}! Tổng quan danh mục bất động sản của bạn.</p>
        </div>

        <AlertBanner
          type="info"
          title="Cần ký hợp đồng"
          message="Căn hộ Vinhomes Grand Park đang chờ bạn ký hợp đồng chuyển nhượng. Liên hệ đối tác Nguyễn Minh Tuấn."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Đang chờ bán" value={`${dangBan} BĐS`} sub="Chờ người mua" icon="🏠" color="blue" />
          <MetricCard title="Tổng giá trị danh mục" value={formatVND(tongGiaTri)} sub="Không tính đã bán" icon="💎" color="green" />
          <MetricCard title="Giao dịch đang chờ" value={`${giaoDichChoKy} GD`} sub="Cần hành động" icon="⏳" color="yellow" />
          <MetricCard title="Đã bán thành công" value={`${daBan} BĐS`} sub="Lịch sử giao dịch" icon="🎉" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Danh Mục Tài Sản</h2>
              <span className="text-xs text-gray-400">{mockTaiSan.length} bất động sản</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Tài sản</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Loại</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Giá niêm yết</th>
                    <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockTaiSan.map((ts) => {
                    const st = trangThaiTSMap[ts.trang_thai]
                    return (
                      <tr key={ts.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{ts.ten}</p>
                          <p className="text-xs text-gray-400">{ts.dien_tich}m² · {ts.tinh_thanh}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{loaiMap[ts.loai]}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatVND(ts.gia)}</td>
                        <td className="px-5 py-3 text-center">
                          <Badge label={st.label} variant={st.variant} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Nhắc Việc</h2>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Ký HĐ bán căn Vinhomes Q9', date: '05/05/2026', urgent: true },
                  { label: 'Nhận tiền thanh lý Đất Nhà Bè', date: '07/05/2026', urgent: true },
                  { label: 'Gặp đối tác tư vấn Biệt thự Thảo Điền', date: '14/05/2026', urgent: false },
                  { label: 'Gia hạn đăng tin Nhà phố Bình Thạnh', date: '20/05/2026', urgent: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${item.urgent ? 'bg-red-500' : 'bg-blue-300'}`} />
                    <div>
                      <p className={item.urgent ? 'text-gray-900 font-medium' : 'text-gray-700'}>{item.label}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">🕐 Hoạt Động Gần Đây</h2>
              <ul className="space-y-3 text-sm">
                {[
                  { text: 'Lê Thị Bình đặt cọc căn Vinhomes', time: '2 ngày trước', icon: '💰' },
                  { text: 'Đăng tin Biệt thự Thảo Điền lên sàn', time: '4 ngày trước', icon: '📢' },
                  { text: 'Hoàn tất bán Đất nền Nhà Bè', time: '3 tuần trước', icon: '✅' },
                  { text: 'Cập nhật giá Nhà phố Bình Thạnh', time: '1 tháng trước', icon: '✏️' },
                ].map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0">{act.icon}</span>
                    <div>
                      <p className="text-gray-700">{act.text}</p>
                      <p className="text-xs text-gray-400">{act.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
