import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'
import type { GiaoDich, HoaHong } from '@/src/lib/types'

const mockUser = { ho_ten: 'Nguyễn Minh Tuấn', vai_tro: 'doi_tac' }

const mockGiaoDich: GiaoDich[] = [
  { id: 'GD001', tai_san_id: 'TS001', ten_tai_san: 'Căn hộ Vinhomes Grand Park Q9', nguoi_ban_id: 'U01', ten_nguoi_ban: 'Trần Văn An', nguoi_mua_id: 'U02', ten_nguoi_mua: 'Lê Thị Bình', doi_tac_id: 'U03', ten_doi_tac: 'Nguyễn Minh Tuấn', gia_giao_dich: 3200000000, ngay_tao: '2026-04-01', ngay_cap_nhat: '2026-04-28', trang_thai: 'cho_ky_hop_dong' },
  { id: 'GD002', tai_san_id: 'TS002', ten_tai_san: 'Nhà phố Bình Thạnh 85m²', nguoi_ban_id: 'U04', ten_nguoi_ban: 'Phạm Quốc Hùng', nguoi_mua_id: 'U05', ten_nguoi_mua: 'Hoàng Lan Anh', doi_tac_id: 'U03', ten_doi_tac: 'Nguyễn Minh Tuấn', gia_giao_dich: 6800000000, ngay_tao: '2026-03-15', ngay_cap_nhat: '2026-04-30', trang_thai: 'dam_phan' },
  { id: 'GD003', tai_san_id: 'TS003', ten_tai_san: 'Đất nền Nhà Bè 120m²', nguoi_ban_id: 'U06', ten_nguoi_ban: 'Vũ Thanh Hà', nguoi_mua_id: 'U07', ten_nguoi_mua: 'Đinh Văn Dũng', doi_tac_id: 'U03', ten_doi_tac: 'Nguyễn Minh Tuấn', gia_giao_dich: 2100000000, ngay_tao: '2026-02-20', ngay_cap_nhat: '2026-04-10', trang_thai: 'hoan_thanh' },
  { id: 'GD004', tai_san_id: 'TS004', ten_tai_san: 'Biệt thự Thảo Điền 350m²', nguoi_ban_id: 'U08', ten_nguoi_ban: 'Ngô Thị Mai', nguoi_mua_id: 'U09', ten_nguoi_mua: 'Bùi Anh Khoa', doi_tac_id: 'U03', ten_doi_tac: 'Nguyễn Minh Tuấn', gia_giao_dich: 18500000000, ngay_tao: '2026-04-20', ngay_cap_nhat: '2026-04-29', trang_thai: 'tiem_nang' },
  { id: 'GD005', tai_san_id: 'TS005', ten_tai_san: 'Căn hộ Masteri Thảo Điền', nguoi_ban_id: 'U10', ten_nguoi_ban: 'Lý Thị Thu', nguoi_mua_id: 'U11', ten_nguoi_mua: 'Trương Minh Phúc', doi_tac_id: 'U03', ten_doi_tac: 'Nguyễn Minh Tuấn', gia_giao_dich: 4500000000, ngay_tao: '2026-04-05', ngay_cap_nhat: '2026-04-25', trang_thai: 'cho_thanh_toan' },
]

const mockHoaHong: HoaHong[] = [
  { id: 'HH001', giao_dich_id: 'GD003', ten_tai_san: 'Đất nền Nhà Bè 120m²', doi_tac_id: 'U03', ten_doi_tac: 'Nguyễn Minh Tuấn', ti_le: 2, so_tien: 42000000, da_thanh_toan: true, ngay_thanh_toan: '2026-04-12' },
  { id: 'HH002', giao_dich_id: 'GD005', ten_tai_san: 'Căn hộ Masteri Thảo Điền', doi_tac_id: 'U03', ten_doi_tac: 'Nguyễn Minh Tuấn', ti_le: 2, so_tien: 90000000, da_thanh_toan: false, ngay_du_kien_thanh_toan: '2026-05-10' },
]

const trangThaiMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' | 'orange' }> = {
  tiem_nang: { label: 'Tiềm năng', variant: 'purple' },
  dam_phan: { label: 'Đàm phán', variant: 'yellow' },
  cho_ky_hop_dong: { label: 'Chờ ký HĐ', variant: 'blue' },
  cho_thanh_toan: { label: 'Chờ thanh toán', variant: 'orange' },
  hoan_thanh: { label: 'Hoàn thành', variant: 'green' },
  huy_bo: { label: 'Huỷ bỏ', variant: 'red' },
}

function formatVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  return n.toLocaleString('vi-VN')
}

export default function DoiTacDashboard() {
  const dangXuLy = mockGiaoDich.filter(g => g.trang_thai !== 'hoan_thanh' && g.trang_thai !== 'huy_bo').length
  const hoaHongChoNhan = mockHoaHong.filter(h => !h.da_thanh_toan).reduce((s, h) => s + h.so_tien, 0)
  const hoaHongDaThu = mockHoaHong.filter(h => h.da_thanh_toan).reduce((s, h) => s + h.so_tien, 0)
  const tiLeChot = Math.round((mockGiaoDich.filter(g => g.trang_thai === 'hoan_thanh').length / mockGiaoDich.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={mockUser.vai_tro} hoTen={mockUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Đối Tác</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {mockUser.ho_ten}! Đây là tổng quan hoạt động của bạn.</p>
        </div>

        <AlertBanner type="warning" title="Nhắc nhở: 2 giao dịch cần hành động" message="GD001 chờ ký hợp đồng — hạn ngày 05/05. GD005 chờ thanh toán — hạn ngày 08/05." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Đang xử lý" value={`${dangXuLy} GD`} sub="Cần theo dõi" icon="📋" color="blue" />
          <MetricCard title="Hoa hồng chờ nhận" value={formatVND(hoaHongChoNhan)} sub="Dự kiến tháng 5" icon="💰" color="green" />
          <MetricCard title="Đã thu tháng 4" value={formatVND(hoaHongDaThu)} sub="+15% so với tháng trước" icon="✅" color="purple" />
          <MetricCard title="Tỉ lệ chốt" value={`${tiLeChot}%`} sub={`${mockGiaoDich.filter(g => g.trang_thai === 'hoan_thanh').length}/${mockGiaoDich.length} giao dịch`} icon="🎯" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Giao Dịch Của Tôi</h2>
              <span className="text-xs text-gray-400">{mockGiaoDich.length} giao dịch</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Tài sản</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Người mua</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                    <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockGiaoDich.map((gd) => {
                    const ts = trangThaiMap[gd.trang_thai]
                    return (
                      <tr key={gd.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 truncate max-w-xs">{gd.ten_tai_san}</p>
                          <p className="text-xs text-gray-400">{gd.id} · {gd.ngay_cap_nhat}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{gd.ten_nguoi_mua}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatVND(gd.gia_giao_dich)}</td>
                        <td className="px-5 py-3 text-center"><Badge label={ts.label} variant={ts.variant} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Nhắc Việc</h2>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Ký HĐ GD001 – Vinhomes Q9', date: '05/05/2026', urgent: true },
                  { label: 'Nhận TT GD005 – Masteri', date: '08/05/2026', urgent: true },
                  { label: 'Gặp khách Biệt thự Thảo Điền', date: '12/05/2026', urgent: false },
                  { label: 'Đàm phán lại giá GD002', date: '15/05/2026', urgent: false },
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
                  { text: 'Hoa hồng GD003 đã được thanh toán', time: '2 ngày trước', icon: '💵' },
                  { text: 'Lê Thị Bình chấp thuận giá GD001', time: '3 ngày trước', icon: '🤝' },
                  { text: 'Trương Minh Phúc chuyển cọc GD005', time: '5 ngày trước', icon: '🏦' },
                  { text: 'Tiếp nhận tài sản mới Biệt thự Thảo Điền', time: '1 tuần trước', icon: '🏠' },
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
