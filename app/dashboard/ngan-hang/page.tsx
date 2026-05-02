import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'
import type { HoSoVay } from '@/src/lib/types'

const mockUser = { ho_ten: 'Phạm Thị Hương', vai_tro: 'nhan_vien_ngan_hang' }

const mockHoSoVay: HoSoVay[] = [
  { id: 'HSV001', giao_dich_id: 'GD001', khach_hang_id: 'U02', ten_khach_hang: 'Lê Thị Bình', ngan_hang: 'Vietcombank', so_tien_vay: 1920000000, lai_suat: 8.5, thoi_han: 240, trang_thai: 'cho_phe_duyet', ngay_nop: '2026-04-15', ngay_cap_nhat: '2026-04-28', ghi_chu: 'Chờ bổ sung sao kê 6 tháng' },
  { id: 'HSV002', giao_dich_id: 'GD004', khach_hang_id: 'U09', ten_khach_hang: 'Bùi Anh Khoa', ngan_hang: 'Vietcombank', so_tien_vay: 9250000000, lai_suat: 7.8, thoi_han: 300, trang_thai: 'dang_xu_ly', ngay_nop: '2026-04-22', ngay_cap_nhat: '2026-04-29', ghi_chu: 'Đang thẩm định tài sản' },
  { id: 'HSV003', giao_dich_id: 'GD006', khach_hang_id: 'U15', ten_khach_hang: 'Nguyễn Thành Nam', ngan_hang: 'Vietcombank', so_tien_vay: 2600000000, lai_suat: 8.2, thoi_han: 180, trang_thai: 'da_duyet', ngay_nop: '2026-04-01', ngay_cap_nhat: '2026-04-25', ghi_chu: 'Chờ giải ngân đợt 1' },
  { id: 'HSV004', giao_dich_id: 'GD007', khach_hang_id: 'U16', ten_khach_hang: 'Trần Minh Châu', ngan_hang: 'Vietcombank', so_tien_vay: 3100000000, lai_suat: 8.0, thoi_han: 240, trang_thai: 'dang_xu_ly', ngay_nop: '2026-04-18', ngay_cap_nhat: '2026-04-28', ghi_chu: 'Xác minh thu nhập' },
  { id: 'HSV005', giao_dich_id: 'GD008', khach_hang_id: 'U17', ten_khach_hang: 'Võ Thị Lan', ngan_hang: 'Vietcombank', so_tien_vay: 1500000000, lai_suat: 9.0, thoi_han: 120, trang_thai: 'tu_choi', ngay_nop: '2026-03-20', ngay_cap_nhat: '2026-04-10', ghi_chu: 'Không đủ điều kiện thu nhập' },
  { id: 'HSV006', giao_dich_id: 'GD009', khach_hang_id: 'U18', ten_khach_hang: 'Đặng Quốc Việt', ngan_hang: 'Vietcombank', so_tien_vay: 4200000000, lai_suat: 7.5, thoi_han: 360, trang_thai: 'da_giai_ngan', ngay_nop: '2026-02-10', ngay_cap_nhat: '2026-04-05', ghi_chu: 'Giải ngân đầy đủ' },
]

const trangThaiMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
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

export default function NganHangDashboard() {
  const dangXuLy = mockHoSoVay.filter(h => h.trang_thai === 'dang_xu_ly' || h.trang_thai === 'cho_phe_duyet').length
  const daDuyet = mockHoSoVay.filter(h => h.trang_thai === 'da_duyet' || h.trang_thai === 'da_giai_ngan').length
  const tongGiaTri = mockHoSoVay.filter(h => h.trang_thai !== 'tu_choi').reduce((s, h) => s + h.so_tien_vay, 0)
  const canBoSung = mockHoSoVay.filter(h => h.trang_thai === 'cho_phe_duyet').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={mockUser.vai_tro} hoTen={mockUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Ngân Hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {mockUser.ho_ten}! Tổng quan xử lý hồ sơ vay tháng 5/2026.</p>
        </div>

        <AlertBanner type="warning" title={`${canBoSung} hồ sơ đang chờ phê duyệt`} message="HSV001 – Lê Thị Bình cần nhắc khách bổ sung sao kê tài khoản trước 10/05/2026." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Đang xử lý" value={`${dangXuLy} HS`} sub="Cần theo dõi" icon="⚙️" color="blue" />
          <MetricCard title="Đã phê duyệt T5" value={`${daDuyet} HS`} sub="+2 so với tháng trước" icon="✅" color="green" />
          <MetricCard title="Tổng giá trị vay" value={formatVND(tongGiaTri)} sub="Không tính từ chối" icon="🏦" color="orange" />
          <MetricCard title="Chờ bổ sung" value={`${canBoSung} HS`} sub="Cần liên hệ khách hàng" icon="📋" color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Danh Sách Hồ Sơ Vay</h2>
              <span className="text-xs text-gray-400">{mockHoSoVay.length} hồ sơ</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Số tiền vay</th>
                    <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Lãi / Kỳ hạn</th>
                    <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockHoSoVay.map((hsv) => {
                    const st = trangThaiMap[hsv.trang_thai]
                    return (
                      <tr key={hsv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{hsv.ten_khach_hang}</p>
                          <p className="text-xs text-gray-400">{hsv.id} · Nộp {hsv.ngay_nop}</p>
                          {hsv.ghi_chu && <p className="text-xs text-orange-500 mt-0.5">{hsv.ghi_chu}</p>}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatVND(hsv.so_tien_vay)}</td>
                        <td className="px-5 py-3 text-center text-gray-600">
                          <span>{hsv.lai_suat}%</span>
                          <span className="text-gray-400"> / </span>
                          <span>{hsv.thoi_han}th</span>
                        </td>
                        <td className="px-5 py-3 text-center"><Badge label={st.label} variant={st.variant} /></td>
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
                  { label: 'Nhắc KH Lê Thị Bình nộp sao kê', date: '05/05/2026', urgent: true },
                  { label: 'Hoàn thiện thẩm định HS Bùi Anh Khoa', date: '08/05/2026', urgent: true },
                  { label: 'Phê duyệt giải ngân HS Đặng Q. Việt', date: '12/05/2026', urgent: false },
                  { label: 'Báo cáo tháng gửi trưởng phòng', date: '31/05/2026', urgent: false },
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
                  { text: 'Phê duyệt hồ sơ Trần Minh Châu', time: '1 ngày trước', icon: '✅' },
                  { text: 'Tiếp nhận hồ sơ mới Bùi Anh Khoa', time: '3 ngày trước', icon: '📥' },
                  { text: 'Từ chối hồ sơ Võ Thị Lan', time: '3 tuần trước', icon: '❌' },
                  { text: 'Giải ngân đầy đủ Đặng Quốc Việt', time: '4 tuần trước', icon: '💸' },
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
