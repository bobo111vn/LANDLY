import Link from 'next/link'
import LogoutButton from './LogoutButton'

const roleLabel: Record<string, string> = {
  doi_tac: 'Đối Tác',
  chu_so_huu: 'Chủ Sở Hữu',
  nguoi_mua: 'Người Mua',
  nhan_vien_ngan_hang: 'Nhân Viên Ngân Hàng',
}

const roleColor: Record<string, string> = {
  doi_tac: 'bg-blue-600',
  chu_so_huu: 'bg-green-600',
  nguoi_mua: 'bg-purple-600',
  nhan_vien_ngan_hang: 'bg-orange-600',
}

export default function Topbar({
  vaiTro,
  hoTen,
}: {
  vaiTro: string
  hoTen: string
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          🏠 Landly
        </Link>
        <span className="hidden sm:block text-gray-300">|</span>
        <span className="hidden sm:block text-sm text-gray-500">Quản lý giao dịch bất động sản</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">{hoTen}</span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${roleColor[vaiTro] ?? 'bg-gray-600'}`}
        >
          {roleLabel[vaiTro] ?? vaiTro}
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
          {hoTen.charAt(0).toUpperCase()}
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
