import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'
import type { TaiSan, HoSoVay } from '@/src/lib/types'

const mockUser = { ho_ten: 'Lê Thị Bình', vai_tro: 'nguoi_mua' }

const mockYeuThich: TaiSan[] = [
  { id: 'TS001', ten: 'Căn hộ Vinhomes Grand Park Q9', dia_chi: '185 Nguyễn Xiển, Q9', tinh_thanh: 'TP.HCM', loai: 'can_ho', dien_tich: 68, gia: 3200000000, trang_thai: 'dang_giao_dich', chu_so_huu_id: 'U01', ngay_dang: '2026-03-01' },
  { id: 'TS006', ten: 'Căn hộ The Estella An Phú', dia_chi: '88 Song Hành, An Phú, Q2', tinh_thanh: 'TP.HCM', loai: 'can_ho', dien_tich: 75, gia: 4100000000, trang_thai: 'cho_ban', chu_so_huu_id: 'U12', ngay_dang: '2026-03-20' },
  { id: 'TS007', ten: 'Nhà phố Gò Vấp 60m²', dia_chi: '15 Nguyễn Văn Nghi, Gò Vấp', tinh_thanh: 'TP.HCM', loai: 'nha_pho', dien_tich: 60, gia: 5200000000, trang_thai: 'cho_ban', chu_so_huu_id: 'U13', ngay_dang: '2026-02-28' },
  { id: 'TS008', ten: 'Căn hộ Sunrise City View Q7', dia_chi: '25 Nguyễn Hữu Thọ, Q7', tinh_thanh: 'TP.HCM', loai: 'can_ho', dien_tich: 82, gia: 3750000000, trang_thai: 'cho_ban', chu_so_huu_id: 'U14', ngay_dang: '2026-04-05' },
]

const mockHoSoVay: HoSoVay[] = [
  { id: 'HSV001', giao_dich_id: 'GD001', khach_hang_id: 'U02', ten_khach_hang: 'Lê Thị Bình', ngan_hang: 'Vietcombank', so_tien_vay: 1920000000, lai_suat: 8.5, thoi_han: 240, trang_thai: 'cho_phe_duyet', ngay_nop: '2026-04-15', ngay_cap_nhat: '2026-04-28', ghi_chu: 'Cần bổ sung sao kê 6 tháng' },
]

const loaiMap: Record<string, string> = { can_ho: 'Căn hộ', nha_pho: 'Nhà phố', dat_nen: 'Đất nền', biet_thu: 'Biệt thự', van_phong: 'Văn phòng' }

const trangThaiMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
  cho_ban: { label: 'Chờ bán', variant: 'blue' },
  dang_giao_dich: { label: 'Đang GD', variant: 'yellow' },
  da_ban: { label: 'Đã bán', variant: 'green' },
}

const trangThaiVayMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
  chua_nop: { label: 'Chưa nộp', variant: 'gray' },
  dang_xu_ly: { label: 'Đang xử lý', variant: 'blue' },
  cho_phe_duyet: { label: 'Chờ duyệt', variant: 'yellow' },
  da_duyet: { label: 'Đã duyệt', variant: 'green' },
  tu_choi: { label: 'Từ chối', variant: 'red' },
  da_giai_ngan: { label: 'Đã giải ngân', variant: 'purple' },
}

function formatVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  return n.toLocaleString('vi-VN')
}

export default function NguoiMuaDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={mockUser.vai_tro} hoTen={mockUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Người Mua</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {mockUser.ho_ten}! Theo dõi quá trình mua bất động sản của bạn.</p>
        </div>

        <AlertBanner
          type="warning"
          title="Hồ sơ vay cần bổ sung tài liệu"
          message="Vietcombank yêu cầu bổ sung sao kê tài khoản 6 tháng gần nhất. Hạn nộp: 10/05/2026."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="BĐS đã xem" value="12" sub="Tháng này" icon="👁️" color="blue" />
          <MetricCard title="Đang quan tâm" value={`${mockYeuThich.length}`} sub="Trong danh sách" icon="❤️" color="red" />
          <MetricCard title="Hồ sơ vay" value={`${mockHoSoVay.length}`} sub="Chờ phê duyệt" icon="📄" color="yellow" />
          <MetricCard title="Tiền cọc đã đặt" value={formatVND(160000000)} sub="GD001 – Vinhomes Q9" icon="🔒" color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties of interest */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">BĐS Đang Quan Tâm</h2>
              <span className="text-xs text-gray-400">{mockYeuThich.length} bất động sản</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Tài sản</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Loại</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Giá</th>
                    <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockYeuThich.map((ts) => {
                    const st = trangThaiMap[ts.trang_thai] ?? { label: ts.trang_thai, variant: 'gray' as const }
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

            {/* Loan section */}
            <div className="border-t border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Hồ Sơ Vay Vốn</h3>
              {mockHoSoVay.map((hsv) => {
                const st = trangThaiVayMap[hsv.trang_thai]
                return (
                  <div key={hsv.id} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{hsv.ngan_hang} – {formatVND(hsv.so_tien_vay)}</p>
                      <p className="text-xs text-gray-400">{hsv.lai_suat}%/năm · {hsv.thoi_han} tháng · {hsv.ghi_chu}</p>
                    </div>
                    <Badge label={st.label} variant={st.variant} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Nhắc Việc</h2>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Nộp bổ sung hồ sơ vay VCB', date: '10/05/2026', urgent: true },
                  { label: 'Ký hợp đồng mua Vinhomes Q9', date: '05/05/2026', urgent: true },
                  { label: 'Xem thực tế The Estella An Phú', date: '13/05/2026', urgent: false },
                  { label: 'Hẹn tư vấn tài chính cá nhân', date: '18/05/2026', urgent: false },
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
                  { text: 'Đặt cọc 160tr căn Vinhomes Q9', time: '5 ngày trước', icon: '💰' },
                  { text: 'Nộp hồ sơ vay Vietcombank', time: '1 tuần trước', icon: '📄' },
                  { text: 'Xem thực tế Nhà phố Gò Vấp', time: '1 tuần trước', icon: '🏠' },
                  { text: 'Lưu quan tâm The Estella An Phú', time: '2 tuần trước', icon: '❤️' },
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
