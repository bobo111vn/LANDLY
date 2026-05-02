type AlertType = 'info' | 'warning' | 'error' | 'success'

const styles: Record<AlertType, { wrapper: string; icon: string }> = {
  info: { wrapper: 'bg-blue-50 border-blue-200 text-blue-800', icon: 'ℹ️' },
  warning: { wrapper: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: '⚠️' },
  error: { wrapper: 'bg-red-50 border-red-200 text-red-800', icon: '🚫' },
  success: { wrapper: 'bg-green-50 border-green-200 text-green-800', icon: '✅' },
}

export default function AlertBanner({
  type = 'info',
  title,
  message,
}: {
  type?: AlertType
  title: string
  message: string
}) {
  const s = styles[type]
  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${s.wrapper}`}>
      <span className="text-base leading-5 flex-shrink-0">{s.icon}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm mt-0.5 opacity-90">{message}</p>
      </div>
    </div>
  )
}
