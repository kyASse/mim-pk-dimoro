// components/admin/dashboard/DashboardAuditFeed.tsx
import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  Database,
  PlusCircle,
  Edit3,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { FormattedAuditActivity } from '@/lib/utils/dashboard-stats';

interface DashboardAuditFeedProps {
  activities: FormattedAuditActivity[];
}

export default function DashboardAuditFeed({ activities }: DashboardAuditFeedProps) {
  const getActionIcon = (variant: FormattedAuditActivity['actionVariant']) => {
    switch (variant) {
      case 'emerald':
        return <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'indigo':
        return <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'rose':
        return <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getActionBadgeClass = (variant: FormattedAuditActivity['actionVariant']) => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/40';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/40';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/40';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700';
    }
  };

  return (
    <div className="w-full p-1.5 rounded-2xl bg-gradient-to-b from-gray-100/90 to-gray-200/50 dark:from-zinc-800/80 dark:to-zinc-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
      <div className="p-4 sm:p-6 rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center ring-1 ring-purple-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Aktivitas Terbaru Sistem
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Jejak audit perubahan data operasional madrasah real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 self-start sm:self-auto font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Audit Trail Terenkripsi</span>
          </div>
        </div>

        {/* Feed List */}
        <div className="mt-4">
          {activities.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
              Belum ada riwayat aktivitas audit log di sistem.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* User Avatar Initial */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                      {item.userName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                          {item.userName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-mono">
                          {item.userRole}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getActionBadgeClass(
                            item.actionVariant
                          )}`}
                        >
                          {getActionIcon(item.actionVariant)}
                          {item.actionLabel}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                          <Database className="w-3 h-3 text-gray-400" />
                          {item.tableLabel}
                        </span>
                        {item.recordId && item.recordId !== '-' && (
                          <span className="text-[11px] font-mono text-gray-400">
                            ID: {item.recordId.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timestamp & Relative Time */}
                  <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-0.5 text-xs text-gray-500 dark:text-gray-400 shrink-0 self-end sm:self-auto">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {item.relativeTime}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
