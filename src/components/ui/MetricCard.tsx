export default function MetricCard({
  title,
  value,
  sub,
  icon,
  color = 'blue',
}: {
  title: string
  value: string
  sub?: string
  icon: string
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange'
}) {
  const bgMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${bgMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
