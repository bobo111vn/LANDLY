import { createClient } from '@/utils/supabase/server'
import Topbar from '@/src/components/ui/Topbar'
import MetricCard from '@/src/components/ui/MetricCard'
import Badge from '@/src/components/ui/Badge'
import AlertBanner from '@/src/components/ui/AlertBanner'

const mockUser = { ho_ten: 'Trần Văn Khánh', vai_tro: 'chu_so_huu' }

const loaiMap: Record<string, string> = {
  can_ho: 'Căn hộ', nha_pho: 'Nhà phố', dat_nen: 'Đất nền', biet_thu: 'Biệt thự', van_phong: 'Văn phòng',
}

const trangThaiMap: Record<string, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange' }> = {
  cho_ban:        { label: 'Chờ bán',   variant: 'blue'   },
  dang_giao_dich: { label: 'Đang GD',  variant: 'yellow' },
  da_ban:         { label: 'Đã bán',   variant: 'green'  },
  cho_thue:       { label: 'Chờ thuê', variant: 'purple' },
  dang_thue:      { label: 'Đang thuê',variant: 'orange' },
}

function formatVND(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  return n.toLocaleString('vi-VN')
}

export default async function ChuSoHuuDashboard() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('ngay_cap_nhat', { ascending: false })

  const dsTaiSan = properties ?? []

  const dangBan    = dsTaiSan.filter(t => t.trang_thai === 'cho_ban').length
  const tongGiaTri = dsTaiSan.filter(t => t.trang_thai !== 'da_ban').reduce((s, t) => s + t.gia, 0)
  const dangGD     = dsTaiSan.filter(t => t.trang_thai === 'dang_giao_dich').length
  const daBan      = dsTaiSan.filter(t => t.trang_thai === 'da_ban').length

  const canKy = dsTaiSan.filter(t => t.trang_thai === 'dang_giao_dich')

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar vaiTro={mockUser.vai_tro} hoTen={mockUser.ho_ten} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Chủ Sở Hữu</h1>
          <p className="text-gray-500 text-sm mt-1">Xin chào, {mockUser.ho_ten}! Tổng quan danh mục bất động sản của bạn.</p>
        </div>

        {canKy.length > 0 && (
          <AlertBanner
            type="info"
            title={`${canKy.length} tài sản đang trong giao dịch`}
            message={canKy.map(t => t.ten).join(' · ')}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Đang chờ bán"         value={`${dangBan} BĐS`}         sub="Chờ người mua"       icon="🏠" color="blue"   />
          <MetricCard title="Tổng giá trị danh mục" value={formatVND(tongGiaTri)}    sub="Không tính đã bán"  icon="💎" color="green"  />
          <MetricCard title="Đang giao dịch"        value={`${dangGD} BĐS`}          sub="Cần hành động"      icon="⏳" color="yellow" />
          <MetricCard title="Đã bán thành công"     value={`${daBan} BĐS`}           sub="Lịch sử giao dịch"  icon="🎉" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Danh Mục Tài Sản</h2>
              <span className="text-xs text-gray-400">{dsTaiSan.length} bất động sản</span>
            </div>
            {dsTaiSan.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">Chưa có tài sản nào.</p>
            ) : (
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
                    {dsTaiSan.map((ts) => {
                      const st = trangThaiMap[ts.trang_thai] ?? { label: ts.trang_thai, variant: 'gray' as const }
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
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Nhắc Việc</h2>
              <ul className="space-y-3 text-sm">
                {canKy.length === 0 ? (
                  <li className="text-gray-400">Không có việc cần làm ngay.</li>
                ) : (
                  canKy.map((ts) => (
                    <li key={ts.id} className="flex items-start gap-2">
                      <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                      <div>
                        <p className="text-gray-900 font-medium">{ts.ten}</p>
                        <p className="text-xs text-gray-400">Đang trong giao dịch · {ts.ngay_cap_nhat.slice(0, 10)}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">🕐 Hoạt Động Gần Đây</h2>
              <ul className="space-y-3 text-sm">
                {dsTaiSan.slice(0, 4).map((ts) => (
                  <li key={ts.id} className="flex items-start gap-2">
                    <span className="flex-shrink-0">🏠</span>
                    <div>
                      <p className="text-gray-700 truncate max-w-[180px]">{ts.ten}</p>
                      <p className="text-xs text-gray-400">{trangThaiMap[ts.trang_thai]?.label} · {ts.ngay_cap_nhat.slice(0, 10)}</p>
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
