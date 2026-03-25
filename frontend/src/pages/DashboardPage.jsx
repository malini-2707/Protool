import React from 'react';
import { useAuth } from '../context/AuthContext-clean';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, gradient, buttonLabel, buttonColor, onClick }) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-6 shadow-lg flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl ${gradient}`}
  >
    {/* Decorative blob */}
    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 bg-white" />

    <div className="text-4xl mb-3">{icon}</div>
    <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-1">{title}</p>
    <p className="text-5xl font-extrabold text-white mb-5">{value}</p>
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 active:scale-95 ${buttonColor}`}
    >
      {buttonLabel}
    </button>
  </div>
);

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleBadge = {
    ADMIN: 'bg-rose-500/20 text-rose-300 border border-rose-400/30',
    MEMBER: 'bg-sky-500/20 text-sky-300 border border-sky-400/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/40">
            P
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ProTool</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 text-sm font-medium rounded-full border border-rose-400/30 text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome Banner */}
        <div className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 shadow-lg backdrop-blur-sm">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">
              Welcome back, <span className="text-indigo-400">{user?.name || 'User'}</span>!
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
            <span
              className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${
                roleBadge[user?.role] ?? roleBadge.MEMBER
              }`}
            >
              {user?.role || 'MEMBER'}
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Projects"
            value="0"
            icon="🗂️"
            gradient="bg-gradient-to-br from-indigo-600 to-blue-700"
            buttonLabel="View Projects"
            buttonColor="bg-white text-indigo-700 hover:bg-indigo-50"
            onClick={() => navigate('/projects')}
          />
          <StatCard
            title="Tasks"
            value="0"
            icon="✅"
            gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
            buttonLabel="View Tasks"
            buttonColor="bg-white text-emerald-700 hover:bg-emerald-50"
            onClick={() => navigate('/tasks')}
          />
          <StatCard
            title="Profile"
            value="⚙️"
            icon="👤"
            gradient="bg-gradient-to-br from-violet-600 to-purple-700"
            buttonLabel="View Profile"
            buttonColor="bg-white text-violet-700 hover:bg-violet-50"
            onClick={() => navigate('/profile')}
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-14">
          ProTool · Project Management Platform
        </p>
      </main>
    </div>
  );
};

export default DashboardPage;
