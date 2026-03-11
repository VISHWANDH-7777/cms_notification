import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getStudentById } from '../data/studentData'

// ─── Tab Components ──────────────────────────────────────────────

function OverviewTab({ student }) {
  const infoItems = [
    { icon: 'mail', label: 'Email', value: student.email },
    { icon: 'phone', label: 'Phone', value: student.phone },
    { icon: 'cake', label: 'Date of Birth', value: new Date(student.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
    { icon: 'home', label: 'Address', value: student.address },
    { icon: 'supervisor_account', label: 'Guardian', value: student.guardian },
    { icon: 'call', label: 'Guardian Phone', value: student.guardianPhone },
  ]

  // Mini attendance heatmap — shows 6 months
  const months = student.attendanceMonthly || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[20px] text-[#2563eb]">person</span>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {infoItems.map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[18px] text-slate-400 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                  <p className="text-sm text-slate-800 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[20px] text-[#2563eb]">school</span>
            Academic Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{student.cgpa}</p>
              <p className="text-xs text-blue-500 font-medium mt-1">CGPA</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{student.attendancePct}%</p>
              <p className="text-xs text-green-500 font-medium mt-1">Attendance</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{student.subjects?.length || 0}</p>
              <p className="text-xs text-purple-500 font-medium mt-1">Subjects</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-700">Sem {student.semester}</p>
              <p className="text-xs text-orange-500 font-medium mt-1">Current</p>
            </div>
          </div>
        </div>

        {/* Attendance Heatmap */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[20px] text-[#2563eb]">calendar_month</span>
            Monthly Attendance
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {months.map(m => {
              const pct = Math.round((m.present / m.total) * 100)
              const bg = pct >= 90 ? 'bg-green-100 border-green-200' : pct >= 75 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
              const textColor = pct >= 90 ? 'text-green-700' : pct >= 75 ? 'text-yellow-700' : 'text-red-600'
              return (
                <div key={m.month} className={`${bg} border rounded-xl p-3 text-center`}>
                  <p className="text-xs font-bold text-slate-500 mb-1">{m.month}</p>
                  <p className={`text-lg font-bold ${textColor}`}>{pct}%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.present}/{m.total}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Department</span>
              <span className="text-sm font-semibold text-slate-800">{student.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Section</span>
              <span className="text-sm font-semibold text-slate-800">{student.section}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Year</span>
              <span className="text-sm font-semibold text-slate-800">{student.year}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Enrolled</span>
              <span className="text-sm font-semibold text-slate-800">
                {new Date(student.enrollDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Fee Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                student.feeStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                student.feeStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {student.feeStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Ring */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-base font-bold text-slate-900 mb-4 self-start">Overall Attendance</h3>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="#e2e8f0" strokeWidth="10" fill="none" />
              <circle
                cx="60" cy="60" r="50"
                stroke="#2563eb" strokeWidth="10" fill="none"
                strokeLinecap="round"
                strokeDasharray={`${student.attendancePct * 3.14} ${314 - student.attendancePct * 3.14}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-slate-900">{student.attendancePct}%</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {student.attendancePct >= 85 ? 'Good standing' : student.attendancePct >= 75 ? 'Needs improvement' : 'Critical — below 75%'}
          </p>
        </div>
      </div>
    </div>
  )
}

function AcademicsTab({ student }) {
  const subjects = student.subjects || []
  const totalObtained = subjects.reduce((s, sub) => s + sub.total, 0)
  const totalMax = subjects.length * 100
  const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{student.cgpa}</p>
          <p className="text-xs text-blue-500 font-medium mt-1">CGPA</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{percentage}%</p>
          <p className="text-xs text-green-500 font-medium mt-1">Overall %</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{subjects.length}</p>
          <p className="text-xs text-purple-500 font-medium mt-1">Subjects</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">Sem {student.semester}</p>
          <p className="text-xs text-orange-500 font-medium mt-1">Current Semester</p>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Subject-wise Performance</h3>
          <span className="text-xs font-medium text-slate-400 uppercase">Semester {student.semester}</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3 text-center">Internal (50)</th>
              <th className="px-6 py-3 text-center">External (50)</th>
              <th className="px-6 py-3 text-center">Total (100)</th>
              <th className="px-6 py-3 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map(sub => (
              <tr key={sub.code} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5 text-sm font-mono text-slate-500">{sub.code}</td>
                <td className="px-6 py-3.5 text-sm font-medium text-slate-800">{sub.name}</td>
                <td className="px-6 py-3.5 text-sm text-center text-slate-600">{sub.internal}</td>
                <td className="px-6 py-3.5 text-sm text-center text-slate-600">{sub.external}</td>
                <td className="px-6 py-3.5 text-sm text-center font-bold text-slate-800">{sub.total}</td>
                <td className="px-6 py-3.5 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    sub.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                    sub.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {sub.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td className="px-6 py-3 text-sm font-bold text-slate-700" colSpan={2}>Total</td>
              <td className="px-6 py-3 text-sm font-bold text-center text-slate-700">
                {subjects.reduce((s, sub) => s + sub.internal, 0)}
              </td>
              <td className="px-6 py-3 text-sm font-bold text-center text-slate-700">
                {subjects.reduce((s, sub) => s + sub.external, 0)}
              </td>
              <td className="px-6 py-3 text-sm font-bold text-center text-slate-900">
                {totalObtained}
              </td>
              <td className="px-6 py-3 text-sm font-bold text-center text-[#2563eb]">
                {percentage}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function FeesTab({ student }) {
  const fees = student.fees || []
  const totalAmount = fees.reduce((s, f) => s + f.amount, 0)
  const totalPaid = fees.reduce((s, f) => s + f.paid, 0)
  const totalDue = fees.reduce((s, f) => s + f.due, 0)

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      {/* Fee summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-blue-500 uppercase mb-1">Total Fees</p>
          <p className="text-2xl font-bold text-blue-700">{fmt(totalAmount)}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-green-500 uppercase mb-1">Amount Paid</p>
          <p className="text-2xl font-bold text-green-700">{fmt(totalPaid)}</p>
        </div>
        <div className={`${totalDue > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'} border rounded-xl p-5`}>
          <p className={`text-xs font-semibold uppercase mb-1 ${totalDue > 0 ? 'text-red-500' : 'text-slate-400'}`}>Balance Due</p>
          <p className={`text-2xl font-bold ${totalDue > 0 ? 'text-red-600' : 'text-slate-500'}`}>{fmt(totalDue)}</p>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Payment History</h3>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline">
            <span className="material-symbols-outlined text-sm">download</span>
            Download Receipt
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-right">Paid</th>
              <th className="px-6 py-3 text-right">Due</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fees.map(f => (
              <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5 text-sm font-mono text-slate-500">{f.id}</td>
                <td className="px-6 py-3.5 text-sm font-medium text-slate-800">{f.type}</td>
                <td className="px-6 py-3.5 text-sm text-right text-slate-600">{fmt(f.amount)}</td>
                <td className="px-6 py-3.5 text-sm text-right text-green-600 font-medium">{fmt(f.paid)}</td>
                <td className={`px-6 py-3.5 text-sm text-right font-medium ${f.due > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  {fmt(f.due)}
                </td>
                <td className="px-6 py-3.5 text-sm text-slate-500">{f.date}</td>
                <td className="px-6 py-3.5 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    f.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    f.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DocumentsTab({ student }) {
  const docs = student.documents || []

  const fileIcon = (type) => {
    switch (type) {
      case 'pdf':   return { icon: 'picture_as_pdf', color: 'text-red-500 bg-red-50' }
      case 'image': return { icon: 'image', color: 'text-blue-500 bg-blue-50' }
      case 'doc':   return { icon: 'description', color: 'text-blue-600 bg-blue-50' }
      default:      return { icon: 'insert_drive_file', color: 'text-slate-400 bg-slate-50' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Uploaded Documents</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-semibold hover:bg-[#1d4ed8] shadow-sm transition-all">
          <span className="material-symbols-outlined text-lg">upload_file</span>
          Upload Document
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-3">Document</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Upload Date</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map(doc => {
              const fi = fileIcon(doc.type)
              return (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${fi.color}`}>
                        <span className="material-symbols-outlined text-[20px]">{fi.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500 uppercase">{doc.type}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">
                    {new Date(doc.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{doc.size}</td>
                  <td className="px-6 py-3.5 text-center">
                    <button className="p-1.5 text-slate-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-all" title="Download">
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-1" title="Delete">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Detail Page ────────────────────────────────────────────

const tabs = [
  { id: 'overview',  label: 'Overview',  icon: 'dashboard' },
  { id: 'academics', label: 'Academics', icon: 'school' },
  { id: 'fees',      label: 'Fees',      icon: 'payments' },
  { id: 'documents', label: 'Documents', icon: 'folder_open' },
]

export default function StudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const student = getStudentById(decodeURIComponent(id))

  if (!student) {
    return (
      <Layout title="Student Not Found">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">person_off</span>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Student Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">No student record exists with ID "{decodeURIComponent(id)}"</p>
          <button
            onClick={() => navigate('/students')}
            className="px-5 py-2.5 bg-[#2563eb] text-white rounded-lg text-sm font-semibold hover:bg-[#1d4ed8] transition-all"
          >
            Back to Students
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Student Details">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/students')} className="text-[#2563eb] hover:underline font-medium">Students</button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500">{student.name}</span>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 shadow-md"
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {student.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">badge</span>
                  {student.id}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">apartment</span>
                  {student.department}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_month</span>
                  {student.year} • Semester {student.semester}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Download Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-lg text-sm font-semibold hover:bg-[#1d4ed8] transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">mail</span>
              Contact Student
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-[#2563eb] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab student={student} />}
      {activeTab === 'academics' && <AcademicsTab student={student} />}
      {activeTab === 'fees' && <FeesTab student={student} />}
      {activeTab === 'documents' && <DocumentsTab student={student} />}
    </Layout>
  )
}
