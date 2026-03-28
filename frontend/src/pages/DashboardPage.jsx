import React from 'react';
import { useAuth } from '../context/AuthContext-clean';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  ClipboardCheck, 
  User, 
  Settings, 
  Pencil,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const NavCard = ({ title, icon, subIcon, bgColor, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, translateY: -10 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative group overflow-hidden w-full aspect-square max-w-[320px] rounded-[2.5rem] ${bgColor} p-8 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]`}
  >
    {/* Decorative circle in corner to match image */}
    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-all duration-500" />
    
    {/* Icon Container */}
    <div className="relative mb-8 transform group-hover:scale-110 transition-transform duration-500">
      <div className="relative">
        {icon}
        {/* Sub-icon (gear/pencil) positioned relative to main icon */}
        <div className="absolute -bottom-2 -right-2 bg-slate-900/40 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/10">
          {subIcon}
        </div>
      </div>
    </div>

    {/* Title */}
    <h3 className="text-3xl font-bold text-white tracking-wide">
      {title}
    </h3>
  </motion.button>
);

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-slate-950">
      {/* Visual Radial Gradient Background - Match Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at center, #1e1b4e 0%, #020617 100%)'
        }}
      />

      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-20 px-10 py-8 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white/90">ProTool</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/profile')}
            className="hidden sm:flex flex-col items-end group/user transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-sm font-semibold text-white/80 group-hover/user:text-white transition-colors">{user?.name}</span>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold group-hover/user:text-indigo-300 transition-colors">{user?.role}</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-300"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Grid of Navigation Cards */}
      <main className="relative z-10 w-full max-w-7xl px-8 py-20 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
        <NavCard
          title="Projects"
          icon={<FolderKanban className="w-24 h-24 text-white drop-shadow-2xl" strokeWidth={1.5} />}
          subIcon={<Settings className="w-6 h-6 text-blue-200" />}
          bgColor="bg-gradient-to-br from-blue-600 to-indigo-700"
          onClick={() => navigate('/projects')}
          delay={0.1}
        />
        
        <NavCard
          title="Tasks"
          icon={<ClipboardCheck className="w-24 h-24 text-white drop-shadow-2xl" strokeWidth={1.5} />}
          subIcon={<Pencil className="w-6 h-6 text-emerald-200" />}
          bgColor="bg-gradient-to-br from-emerald-600 to-teal-700"
          onClick={() => navigate('/tasks')}
          delay={0.2}
        />
        
        <NavCard
          title="Profile"
          icon={<User className="w-24 h-24 text-white drop-shadow-2xl" strokeWidth={1.5} />}
          subIcon={<Settings className="w-6 h-6 text-purple-200" />}
          bgColor="bg-gradient-to-br from-purple-600 to-fuchsia-700"
          onClick={() => navigate('/profile')}
          delay={0.3}
        />
      </main>

      {/* Footer / Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-white/20 text-xs font-medium tracking-[0.2em] uppercase pointer-events-none"
      >
        Designed for Excellence · ProTool 2026
      </motion.div>
    </div>
  );
};

export default DashboardPage;
