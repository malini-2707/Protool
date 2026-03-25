import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext-clean';

/**
 * PageShell – wraps every protected page with the shared dark header + bg.
 * Props:
 *   children  – page content
 *   breadcrumb – optional array of { label, to? } for breadcrumb trail
 */
const PageShell = ({ children, breadcrumb }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/40">
              P
            </div>
            <span className="text-base font-bold tracking-tight">ProTool</span>
          </Link>

          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400">
              <span className="text-slate-600">/</span>
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={i}>
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-indigo-400 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-300 font-medium">{crumb.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <span className="text-slate-600">/</span>}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-slate-400">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-rose-400/30 text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Page body */}
      <main className="w-full">
        {children}
      </main>

      {/* Footer */}
      <p className="text-center text-xs text-slate-700 py-6">
        ProTool · Project Management Platform
      </p>
    </div>
  );
};

export default PageShell;
