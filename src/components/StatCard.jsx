export default function StatCard({ icon, label, value, trend, color = 'blue' }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-200', iconBg: 'bg-blue-100 text-blue-600',   valueColor: 'text-blue-700' },
    green:  { bg: 'bg-green-50',  border: 'border-green-200', iconBg: 'bg-green-100 text-green-600', valueColor: 'text-green-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'bg-purple-100 text-purple-600', valueColor: 'text-purple-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'bg-orange-100 text-orange-600', valueColor: 'text-orange-700' },
    red:    { bg: 'bg-red-50',    border: 'border-red-200',    iconBg: 'bg-red-100 text-red-600',       valueColor: 'text-red-700' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className={`${c.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className={`text-2xl font-bold ${c.valueColor}`}>{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
        {trend && <p className="text-[11px] text-slate-400 mt-0.5">{trend}</p>}
      </div>
    </div>
  )
}
