import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <Search className="w-10 h-10 text-indigo-400" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-8xl font-black text-white/5 mb-2 leading-none select-none">404</h1>
        <h2 className="text-3xl font-extrabold text-white mb-3">Page not found</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-10">
          The link you followed may be broken, or the page may have been removed or renamed.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            to="/dashboard" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-sm font-bold rounded-xl transition-all backdrop-blur-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Logo Footer */}
        <div className="mt-16 flex items-center justify-center gap-2 opacity-50">
          <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">P</div>
          <span className="text-xs font-bold tracking-tight text-white uppercase">ProTool</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
