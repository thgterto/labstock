import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Beaker, Package, Settings, Menu, Activity, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Painel', path: '/' },
    { icon: Beaker, label: 'Inventário', path: '/inventory' },
    { icon: Package, label: 'Lotes', path: '/batches' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="flex items-center gap-3 p-6 border-b border-slate-800 flex-shrink-0">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LabControl</h1>
            <p className="text-xs text-slate-400">Versão 2.0.0-alpha</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-800 flex-shrink-0">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
               {user?.initials || 'U'}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium truncate">{user?.name || 'Visitante'}</p>
               <p className="text-xs text-slate-500 truncate capitalize">{user?.role || 'Visitante'}</p>
             </div>
           </div>

           <button
             onClick={logout}
             className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
           >
             <LogOut className="w-4 h-4" />
             Sair
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Online
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
