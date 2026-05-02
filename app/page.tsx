import Link from 'next/link'

const roles = [
  { href: '/dashboard/doi-tac', label: 'Đối Tác', desc: 'Môi giới bất động sản', icon: '🤝', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
  { href: '/dashboard/chu-so-huu', label: 'Chủ Sở Hữu', desc: 'Quản lý tài sản của bạn', icon: '🏡', color: 'border-green-200 hover:border-green-400 hover:bg-green-50' },
  { href: '/dashboard/nguoi-mua', label: 'Người Mua', desc: 'Tìm kiếm bất động sản', icon: '🔍', color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50' },
  { href: '/dashboard/ngan-hang', label: 'Nhân Viên Ngân Hàng', desc: 'Xử lý hồ sơ vay', icon: '🏦', color: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">🏠 Landly</h1>
        <p className="text-gray-500 mt-2 text-lg">Nền tảng quản lý giao dịch bất động sản Việt Nam</p>
      </div>
      <p className="text-sm text-gray-400 mb-6 uppercase tracking-wider font-medium">Chọn vai trò để xem dashboard</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {roles.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className={`bg-white border-2 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-150 ${r.color}`}
          >
            <span className="text-4xl mb-3">{r.icon}</span>
            <span className="font-semibold text-gray-900">{r.label}</span>
            <span className="text-sm text-gray-500 mt-1">{r.desc}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
