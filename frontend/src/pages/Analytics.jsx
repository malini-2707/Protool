import React from 'react';
import PageShell from '../components/PageShell';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';

const Analytics = () => {
  const stats = [
    { label: 'Project Performance', description: 'Track progress across all active projects' },
    { label: 'Team Productivity', description: 'Monitor task completion rates by team member' },
    { label: 'Task Completion Trends', description: 'Visualize burn-down and burn-up charts' },
    { label: 'Sprint Velocity', description: 'Measure work completed per iteration' },
    { label: 'Time Tracking', description: 'Analyze time spent on individual tasks' },
  ];

  return (
    <PageShell breadcrumb={[{ label: 'Analytics' }]}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1 text-sm">Deep insights into your project and team performance</p>
        </div>

        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Chart Placeholder */}
          <div className="md:col-span-2 lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" /> Task Progress Over Time
              </h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            
            {/* Visual placeholder for a chart */}
            <div className="h-64 flex items-end gap-2 px-2 pb-2 border-b border-l border-white/10">
              {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-indigo-500/20 to-indigo-500/60 rounded-t-sm transition-all hover:to-indigo-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>

          {/* Side Stats */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">Velocity</span>
                  </div>
                  <span className="text-sm font-bold text-white">+12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span className="text-sm text-slate-300">Active Members</span>
                  </div>
                  <span className="text-sm font-bold text-white">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-slate-300">Completed</span>
                  </div>
                  <span className="text-sm font-bold text-white">42</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-sm font-bold text-indigo-300 mb-2">Efficiency Rating</h3>
              <p className="text-3xl font-extrabold text-white">94%</p>
              <p className="text-xs text-indigo-300/60 mt-2">Above average this month</p>
            </div>
          </div>
        </div>

        {/* Feature List Placeholder */}
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Implementation Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all group">
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">{s.label}</h3>
                <p className="text-xs text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Analytics;
