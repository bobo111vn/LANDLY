'use client'
import { useActionState } from 'react'
import { signIn } from './actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, { error: null })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-4xl">🏠</span>
            <span className="text-3xl font-bold text-gray-900 tracking-tight">Landly</span>
          </div>
          <p className="text-gray-500 text-sm">Quản lý giao dịch bất động sản</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Đăng nhập</h2>

          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="email@landly.vn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-sm text-red-600">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Dùng tài khoản được cấp bởi quản trị viên Landly
        </p>
      </div>
    </div>
  )
}
