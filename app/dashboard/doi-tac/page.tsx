import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/src/lib/database.types'
import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'

type TransactionRow = Database['public']['Tables']['transactions']['Row']
type CommissionRow  = Database['public']['Tables']['commissions']['Row']

const mockUser = { ho_ten: 'Nguyễn Minh Tuấn', vai_tro: 'doi_tac' }

const trangThaiMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' | 'orange' }> = {
  tiem_nang:        { label: 'Tiềm năng',      variant: 'purple' },
  dam_phan:         { label: 'Đàm phán',        variant: 'yellow' },
  cho_ky_hop_dong:  { label: 'Chờ ký HĐ',      variant: 'blue'   },
  cho_thanh_toan:   { label: 'Chờ thanh toán',  variant: 'orange' },
  hoan_thanh:       { label: 'Hoàn thành',      variant: 'green'  },
  huy_bo:           { label: 'Huỷ bỏ',          variant: 'red'    },
}

function formatVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  return n.toLocaleString('vi-VN')
}

export default async function DoiTacDashboard() {
  const supabase = await createClient()

  const [{ data: giaoDich }, { data: hoaHong }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*')
      .order('ngay_cap_nhat', { ascending: false })
      .limit(10),
    supabase
      .from('commissions')
      .select('*')
      .order('ngay_tao', { ascending: false }),
  ])

  const transactions: TransactionRow[] = giaoDich ?? []
  const commissions: CommissionRow[]   = hoaHong  ?? []

  const dangXuLy       = transactions.filter(g => g.trang_thai !== 'hoan_thanh' && g.trang_thai !== 'huy_bo').length
  const hoaHongChoNhan = commissions.filter(h => !h.da_thanh_toan).reduce((s, h) => s + h.so_tien, 0)
  const hoaHongDaThu   = commissions.filter(h => h.da_thanh_toan).reduce((s, h) => s + h.so_tien, 0)
  const total          = transactions.length
  const daHoanThanh    = transactions.filter(g => g.trang_thai === 'hoan_thanh').length
  const tiLeChot       = total > 0 ? Math.round((daHoanThanh / total) * 100) : 0

  const canHanhDong = transactions.filter(g =>
    g.trang_thai === 'cho_ky_hop_dong' || g.trang_thai === 'cho_thanh_toan'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={mockUser.vai_tro} hoTen={mockUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Đối Tác</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {mockUser.ho_ten}! Đây là tổng quan hoạt động của bạn.</p>
        </div>

        {canHanhDong.length > 0 && (
          <AlertBanner
            type="warning"
            title={`${canHanhDong.length} giao dịch cần hành động`}
            message={canHanhDong.map(g => g.ten_tai_san).join(' · ')}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Đang xử lý"          value={`${dangXuLy} GD`}             sub="Cần theo dõi"            icon="📋" color="blue"   />
          <MetricCard title="Hoa hồng chờ nhận"   value={formatVND(hoaHongChoNhan)}     sub="Dự kiến tháng tới"       icon="💰" color="green"  />
          <MetricCard title="Hoa hồng đã thu"      value={formatVND(hoaHongDaThu)}       sub="Đã thanh toán"           icon="✅" color="purple" />
          <MetricCard title="Tỉ lệ chốt"           value={`${tiLeChot}%`}               sub={`${daHoanThanh}/${total} giao dịch`} icon="🎯" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Giao Dịch Của Tôi</h2>
              <span className="text-xs text-gray-400">{transactions.length} giao dịch</span>
            </div>
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">Chưa có giao dịch nào.</p>
            ) : (
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
                    {transactions.map((gd) => {
                      const ts = trangThaiMap[gd.trang_thai] ?? { label: gd.trang_thai, variant: 'gray' as const }
                      return (
                        <tr key={gd.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-900 truncate max-w-xs">{gd.ten_tai_san}</p>
                            <p className="text-xs text-gray-400">{gd.id.slice(0, 8)} · {gd.ngay_cap_nhat.slice(0, 10)}</p>
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
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">💰 Hoa Hồng</h2>
              {commissions.length === 0 ? (
                <p className="text-gray-400 text-sm">Chưa có hoa hồng.</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {commissions.map((hh) => (
                    <li key={hh.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[140px]">{hh.ten_tai_san}</p>
                        <p className="text-xs text-gray-400">{hh.ti_le}% · {formatVND(hh.so_tien)}</p>
                      </div>
                      <Badge
                        label={hh.da_thanh_toan ? 'Đã thu' : 'Chờ thu'}
                        variant={hh.da_thanh_toan ? 'green' : 'yellow'}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Nhắc Việc</h2>
              <ul className="space-y-3 text-sm">
                {canHanhDong.length === 0 ? (
                  <li className="text-gray-400">Không có việc cần làm ngay.</li>
                ) : (
                  canHanhDong.map((gd) => (
                    <li key={gd.id} className="flex items-start gap-2">
                      <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                      <div>
                        <p className="text-gray-900 font-medium">{gd.ten_tai_san}</p>
                        <p className="text-xs text-gray-400">{trangThaiMap[gd.trang_thai]?.label}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">🕐 Hoạt Động Gần Đây</h2>
              <ul className="space-y-3 text-sm">
                {transactions.slice(0, 4).map((gd) => (
                  <li key={gd.id} className="flex items-start gap-2">
                    <span className="flex-shrink-0">📋</span>
                    <div>
                      <p className="text-gray-700 truncate max-w-[180px]">{gd.ten_tai_san}</p>
                      <p className="text-xs text-gray-400">{trangThaiMap[gd.trang_thai]?.label} · {gd.ngay_cap_nhat.slice(0, 10)}</p>
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
