import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/src/lib/database.types'
import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'

type LoanRow = Database['public']['Tables']['loan_applications']['Row']


const trangThaiMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
  chua_nop:      { label: 'Chưa nộp',     variant: 'gray'   },
  dang_xu_ly:    { label: 'Đang xử lý',   variant: 'blue'   },
  cho_phe_duyet: { label: 'Chờ duyệt',    variant: 'yellow' },
  da_duyet:      { label: 'Đã duyệt',     variant: 'green'  },
  tu_choi:       { label: 'Từ chối',      variant: 'red'    },
  da_giai_ngan:  { label: 'Đã giải ngân', variant: 'purple' },
}

function formatVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  return n.toLocaleString('vi-VN')
}

export default async function NganHangDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const userRes = await supabase
    .from('users').select('ho_ten, vai_tro').eq('email', user?.email ?? '').single()
  const userRecord = userRes.data as { ho_ten: string; vai_tro: string } | null
  const currentUser = { ho_ten: userRecord?.ho_ten ?? 'Người dùng', vai_tro: userRecord?.vai_tro ?? 'nhan_vien_ngan_hang' }

  const { data: loans } = await supabase
    .from('loan_applications')
    .select('*')
    .order('ngay_cap_nhat', { ascending: false })

  const dsHoSo: LoanRow[] = loans ?? []

  const dangXuLy  = dsHoSo.filter(h => h.trang_thai === 'dang_xu_ly' || h.trang_thai === 'cho_phe_duyet').length
  const daDuyet   = dsHoSo.filter(h => h.trang_thai === 'da_duyet' || h.trang_thai === 'da_giai_ngan').length
  const tongGiaTri = dsHoSo.filter(h => h.trang_thai !== 'tu_choi').reduce((s, h) => s + h.so_tien_vay, 0)
  const canBoSung  = dsHoSo.filter(h => h.trang_thai === 'cho_phe_duyet')

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={currentUser.vai_tro} hoTen={currentUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Ngân Hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {currentUser.ho_ten}! Tổng quan xử lý hồ sơ vay.</p>
        </div>

        {canBoSung.length > 0 && (
          <AlertBanner
            type="warning"
            title={`${canBoSung.length} hồ sơ đang chờ phê duyệt`}
            message={canBoSung.map(h => `${h.ten_khach_hang}${h.ghi_chu ? ` – ${h.ghi_chu}` : ''}`).join(' · ')}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Đang xử lý"       value={`${dangXuLy} HS`}        sub="Cần theo dõi"              icon="⚙️" color="blue"   />
          <MetricCard title="Đã phê duyệt"      value={`${daDuyet} HS`}         sub="Duyệt + Giải ngân"         icon="✅" color="green"  />
          <MetricCard title="Tổng giá trị vay"  value={formatVND(tongGiaTri)}   sub="Không tính từ chối"        icon="🏦" color="orange" />
          <MetricCard title="Chờ bổ sung"       value={`${canBoSung.length} HS`} sub="Cần liên hệ khách hàng"  icon="📋" color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Danh Sách Hồ Sơ Vay</h2>
              <span className="text-xs text-gray-400">{dsHoSo.length} hồ sơ</span>
            </div>
            {dsHoSo.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">Chưa có hồ sơ nào.</p>
            ) : (
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
                    {dsHoSo.map((hsv) => {
                      const st = trangThaiMap[hsv.trang_thai] ?? { label: hsv.trang_thai, variant: 'gray' as const }
                      return (
                        <tr key={hsv.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-900">{hsv.ten_khach_hang}</p>
                            <p className="text-xs text-gray-400">{hsv.id.slice(0, 8)} · Nộp {hsv.ngay_nop.slice(0, 10)}</p>
                            {hsv.ghi_chu && <p className="text-xs text-orange-500 mt-0.5">{hsv.ghi_chu}</p>}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatVND(hsv.so_tien_vay)}</td>
                          <td className="px-5 py-3 text-center text-gray-600">
                            {hsv.lai_suat}% / {hsv.thoi_han}th
                          </td>
                          <td className="px-5 py-3 text-center"><Badge label={st.label} variant={st.variant} /></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Nhắc Việc</h2>
              <ul className="space-y-3 text-sm">
                {canBoSung.length === 0 ? (
                  <li className="text-gray-400">Không có việc cần làm ngay.</li>
                ) : (
                  canBoSung.map((h) => (
                    <li key={h.id} className="flex items-start gap-2">
                      <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                      <div>
                        <p className="text-gray-900 font-medium">{h.ten_khach_hang}</p>
                        <p className="text-xs text-gray-400">{h.ghi_chu ?? 'Chờ phê duyệt'}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">🕐 Hoạt Động Gần Đây</h2>
              <ul className="space-y-3 text-sm">
                {dsHoSo.slice(0, 4).map((h) => (
                  <li key={h.id} className="flex items-start gap-2">
                    <span className="flex-shrink-0">📄</span>
                    <div>
                      <p className="text-gray-700">{h.ten_khach_hang} – {formatVND(h.so_tien_vay)}</p>
                      <p className="text-xs text-gray-400">{trangThaiMap[h.trang_thai]?.label} · {h.ngay_cap_nhat.slice(0, 10)}</p>
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
