import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Download,
  KeyRound,
  Activity,
  Users,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const SecurityComplianceModule: React.FC = () => {
  const { auditLogs, role } = useHealth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'AUTH', 'EHR_ACCESS', 'PRESCRIPTION_ISSUED', 'ORDER_PLACED', 'PAYMENT', 'SECURITY'];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || log.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedNexa_AuditLogs_${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Safety &amp; Privacy Protection
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your personal medical records are kept safe with 256-bit bank-level encryption.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLogs}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Security Report
        </button>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              HIPAA Compliance
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700">100% Compliant</div>
          <p className="text-[11px] text-slate-500">ePHI Safeguards Activated</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Encryption Status
            </span>
            <Lock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-black text-teal-800">AES-256 + TLS 1.3</div>
          <p className="text-[11px] text-slate-500">In-Transit &amp; At-Rest</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Audit Event Volume
            </span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{auditLogs.length} Events</div>
          <p className="text-[11px] text-slate-500">Immutable ledger enabled</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Role Matrix (RBAC)
            </span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-indigo-800">3 Verified Tiers</div>
          <p className="text-[11px] text-slate-500">Patient, Doctor, Admin</p>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-teal-600" />
          Role-Based Access Governance (Active Role: {role.toUpperCase()})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className={`p-3.5 rounded-xl border transition ${role === 'patient' ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Patient Role</span>
              {role === 'patient' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">Active</span>}
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>&bull; Self EHR records &amp; vitals logging</li>
              <li>&bull; Book telehealth appointments</li>
              <li>&bull; Purchase pharmacy medicines &amp; view orders</li>
              <li>&bull; Set custom pill reminders &amp; AI wellness</li>
            </ul>
          </div>

          <div className={`p-3.5 rounded-xl border transition ${role === 'doctor' ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Doctor Role</span>
              {role === 'doctor' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">Active</span>}
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>&bull; Manage schedule &amp; time slots</li>
              <li>&bull; Conduct encrypted video consultations</li>
              <li>&bull; Sign &amp; issue verified digital prescriptions (e-Rx)</li>
              <li>&bull; Record diagnosis &amp; review clinical lab tests</li>
            </ul>
          </div>

          <div className={`p-3.5 rounded-xl border transition ${role === 'shopkeeper' ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Pharmacy Role</span>
              {role === 'shopkeeper' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">Active</span>}
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>&bull; Fulfill &amp; dispense medicine orders</li>
              <li>&bull; Update order statuses (Processing, Shipped, Delivered)</li>
              <li>&bull; Review attached digital e-prescriptions</li>
              <li>&bull; Chemist partner catalog &amp; stock management</li>
            </ul>
          </div>

          <div className={`p-3.5 rounded-xl border transition ${role === 'admin' ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Admin Role</span>
              {role === 'admin' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">Active</span>}
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>&bull; Full system oversight &amp; audit trails</li>
              <li>&bull; Advance pharmacy order fulfillment stages</li>
              <li>&bull; Manage doctor verification &amp; catalog stock</li>
              <li>&bull; Export regulatory security compliance data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Audit Log Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by user, category, or payload details..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-teal-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Security Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-700 uppercase">
            Cryptographic Audit Trail ({filteredLogs.length} Records)
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Node: us-west1-phi-cluster
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">IP Address</th>
                <th className="py-2.5 px-4">Details</th>
                <th className="py-2.5 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <span className="font-bold text-slate-900">{log.userName}</span>
                    <span className="text-slate-400 ml-1.5 text-[10px] uppercase">({log.userRole})</span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 font-mono">{log.ipAddress}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-600 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'info'
                          ? 'bg-blue-100 text-blue-800'
                          : log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
