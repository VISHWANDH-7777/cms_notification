import { useNavigate } from 'react-router-dom'

export default function StudentTable({ students, currentPage, itemsPerPage }) {
  const navigate = useNavigate()
  const startIndex = (currentPage - 1) * itemsPerPage

  const feeStatusStyle = (status) => {
    switch (status) {
      case 'Paid':    return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Overdue': return 'bg-red-100 text-red-700'
      default:        return 'bg-slate-100 text-slate-600'
    }
  }

  const statusStyle = (status) => {
    switch (status) {
      case 'Active':    return 'bg-green-100 text-green-700'
      case 'Inactive':  return 'bg-slate-100 text-slate-500'
      case 'Graduated': return 'bg-blue-100 text-blue-700'
      default:          return 'bg-slate-100 text-slate-600'
    }
  }

  const attendanceColor = (pct) => {
    if (pct >= 85) return 'text-green-600'
    if (pct >= 75) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
            <th className="px-6 py-4 w-8">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#2563eb]" />
            </th>
            <th className="px-4 py-4">Student</th>
            <th className="px-4 py-4">Department</th>
            <th className="px-4 py-4">Year</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Attendance</th>
            <th className="px-4 py-4">Fee Status</th>
            <th className="px-4 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">person_off</span>
                No students found matching your filters
              </td>
            </tr>
          )}
          {students.map((s, i) => (
            <tr
              key={s.id}
              className="hover:bg-slate-50/80 transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(`/students/${encodeURIComponent(s.id)}`)}
            >
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#2563eb]" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-[#2563eb] transition-colors">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-slate-600">{s.department}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{s.year}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle(s.status)}`}>
                  {s.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        s.attendancePct >= 85 ? 'bg-green-500' : s.attendancePct >= 75 ? 'bg-orange-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${s.attendancePct}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${attendanceColor(s.attendancePct)}`}>{s.attendancePct}%</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${feeStatusStyle(s.feeStatus)}`}>
                  {s.feeStatus}
                </span>
              </td>
              <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => navigate(`/students/${encodeURIComponent(s.id)}`)}
                  className="p-1.5 text-slate-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="View Details"
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 ml-1" title="More options">
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
