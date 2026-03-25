import React from 'react';
import PageShell from '../components/PageShell';
import { Calendar, Layers, Plus, ChevronRight, Clock, Target } from 'lucide-react';

const Sprints = () => {
  const sprintData = [
    { name: 'Sprint 24 - Core MVP', status: 'ACTIVE', progress: 75, goal: 'Complete main authentication and project dashboard logic.' },
    { name: 'Sprint 25 - Advanced UI', status: 'PLANNING', progress: 0, goal: 'Apply dark theme consistent across all secondary modules.' },
    { name: 'Sprint 23 - Backend Foundation', status: 'COMPLETED', progress: 100, goal: 'Set up Prisma schema and initial API controllers.' },
  ];

  return (
    <PageShell breadcrumb={[{ label: 'Sprints' }]}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Sprints</h1>
            <p className="text-slate-400 mt-1 text-sm">Plan and track your team's iterative progress</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Sprint
          </button>
        </div>

        {/* Sprint Cards */}
        <div className="space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Iteration Flow</h2>
          
          {sprintData.map((sprint, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{sprint.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 20 - Apr 3</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${
                          sprint.status === 'ACTIVE' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-400/20' :
                          sprint.status === 'PLANNING' ? 'bg-slate-500/10 text-slate-400 border-slate-400/20' :
                          'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'
                        }`}>{sprint.status}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 flex items-center gap-1"><Target className="w-3 h-3" /> Goal: {sprint.goal}</span>
                      <span className="text-indigo-400 font-bold">{sprint.progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${sprint.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(u => (
                        <div key={u} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                          U{u}
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                        +4
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> 12 DONE</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-500" /> 4 REMAINING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note placeholder */}
        <div className="mt-10 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
          <h3 className="text-sm font-bold text-indigo-300 mb-2">Sprint Planning Pro-Tip</h3>
          <p className="text-xs text-indigo-300/70 leading-relaxed">
            Effective sprint goals help team members focus on the collective outcome rather than individual tasks. 
            Aim for goals that are specific, measurable, and achievable within the iteration timeframe.
          </p>
        </div>
      </div>
    </PageShell>
  );
};

export default Sprints;
