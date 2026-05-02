import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/src/lib/database.types'
import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type LoanRow     = Database['public']['Tables']['loan_applications']['Row']

const mockUser = { ho_ten: 'Lê Thị Bình', vai_tro: 'nguoi_mua' }

const loaiMap: Record<string, string> = {
  can_ho: 'Căn hộ', nha_pho: 'Nhà phố', dat_nen: 'Đất nền', biet_thu: 'Biệt thự', van_phong: 'Văn phòng',
}

const trangThaiTSMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
  cho_ban:        { label: 'Chờ bán',  variant: 'blue'   },
  dang_giao_dich: { label: 'Đang GD', variant: 'yellow' },
  da_ban:         { label: 'Đã bán',  variant: 'green'  },
}

const trangThaiVayMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
  chua_nop:      { label: 'Chưa nộp',    variant: 'gray'   },
  dang_xu_ly:    { label: 'Đang xử lý',  variant: 'blue'   },
  cho_phe_duyet: { label: 'Chờ duyệt',   variant: 'yellow' },
  da_duyet:      { label: 'Đã duyệt',    variant: 'green'  },
  tu_choi:       { label: 'Từ chối',     variant: 'red'    },
  da_giai_ngan:  { label: 'Đã giải ngân',variant: 'purple' },
}

function formatVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  return n.toLocaleString('vi-VN')
}

export default async function NguoiMuaDashboard() {
  const supabase = await createClient()

  const [{ data: properties }, { data: loans }] = await Promise.all([
    supabase
      .from('properties')
      .select('*')
      .in('trang_thai', ['cho_ban', 'dang_giao_dich'])
      .order('ngay_dang', { ascending: false })
      .limit(8),
    supabase
      .from('loan_applications')
      .select('*')
      .order('ngay_nop', { ascending: false }),
  ])

  const dsTaiSan: PropertyRow[]  = properties ?? []
  const dsHoSoVay: LoanRow[]     = loans ?? []

  const hoSoChoXuLy = dsHoSoVay.filter(h => h.trang_thai === 'cho_phe_duyet' || h.trang_thai === 'dang_xu_ly')

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={mockUser.vai_tro} hoTen={mockUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Người Mua</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {mockUser.ho_ten}! Theo dõi quá trình mua bất động sản của bạn.</p>
        </div>

        {hoSoChoXuLy.length > 0 && (
          <AlertBanner
            type="warning"
            title={`${hoSoChoXuLy.length} hồ sơ vay đang chờ xử lý`}
            message={hoSoChoXuLy.map(h => `${h.ngan_hang} – ${h.ghi_chu ?? ''}`).join(' · ')}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="BĐS đang bán"      value={`${dsTaiSan.length}`}                              sub="Trên thị trường"    icon="🏠" color="blue"   />
          <MetricCard title="Hồ sơ vay"          value={`${dsHoSoVay.length}`}                             sub="Tổng hồ sơ"         icon="📄" color="yellow" />
          <MetricCard title="Chờ phê duyệt"      value={`${hoSoChoXuLy.length}`}                           sub="Cần theo dõi"       icon="⏳" color="orange" />
          <MetricCard title="Đã duyệt / Giải ngân" value={`${dsHoSoVay.filter(h => h.trang_thai === 'da_duyet' || h.trang_thai === 'da_giai_ngan').length}`} sub="Hồ sơ thành công" icon="✅" color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">BĐS Đang Trên Thị Trường</h2>
              <span className="text-xs text-gray-400">{dsTaiSan.length} bất động sản</span>
            </div>
            {dsTaiSan.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">Không có bất động sản nào.</p>
            ) : (
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
                    {dsTaiSan.map((ts) => {
                      const st = trangThaiTSMap[ts.trang_thai] ?? { label: ts.trang_thai, variant: 'gray' as const }
                      return (
                        <tr key={ts.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-900 truncate max-w-xs">{ts.ten}</p>
                            <p className="text-xs text-gray-400">{ts.dien_tich}m² · {ts.tinh_thanh}</p>
                          </td>
                          <td className="px-5 py-3 text-gray-600">{loaiMap[ts.loai] ?? ts.loai}</td>
                          <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatVND(ts.gia)}</td>
                          <td className="px-5 py-3 text-center"><Badge label={st.label} variant={st.variant} /></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {dsHoSoVay.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Hồ Sơ Vay Vốn</h3>
                <div className="space-y-2">
                  {dsHoSoVay.map((hsv) => {
                    const st = trangThaiVayMap[hsv.trang_thai] ?? { label: hsv.trang_thai, variant: 'gray' as const }
                    return (
                      <div key={hsv.id} className="flex items-center justify-between py-2 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{hsv.ngan_hang} – {formatVND(hsv.so_tien_vay)}</p>
                          <p className="text-xs text-gray-400">{hsv.lai_suat}%/năm · {hsv.thoi_han} tháng{hsv.ghi_chu ? ` · ${hsv.ghi_chu}` : ''}</p>
                        </div>
                        <Badge label={st.label} variant={st.variant} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Nhắc Việc</h2>
              <ul className="space-y-3 text-sm">
                {hoSoChoXuLy.length === 0 ? (
                  <li className="text-gray-400">Không có việc cần làm ngay.</li>
                ) : (
                  hoSoChoXuLy.map((h) => (
                    <li key={h.id} className="flex items-start gap-2">
                      <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                      <div>
                        <p className="text-gray-900 font-medium">{h.ngan_hang}</p>
                        <p className="text-xs text-gray-400">{h.ghi_chu ?? trangThaiVayMap[h.trang_thai]?.label}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">🕐 Hoạt Động Gần Đây</h2>
              <ul className="space-y-3 text-sm">
                {dsHoSoVay.slice(0, 4).map((h) => (
                  <li key={h.id} className="flex items-start gap-2">
                    <span className="flex-shrink-0">📄</span>
                    <div>
                      <p className="text-gray-700">{h.ngan_hang} – {formatVND(h.so_tien_vay)}</p>
                      <p className="text-xs text-gray-400">{trangThaiVayMap[h.trang_thai]?.label} · {h.ngay_nop.slice(0, 10)}</p>
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
