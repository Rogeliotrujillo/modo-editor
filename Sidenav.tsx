import React from 'react';
import { ScreenType } from '../types';
import {
  LayoutDashboard,
  FileEdit,
  Package,
  Share2,
  DollarSign,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';

interface SidenavProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  logout: () => void;
  theme: 'dark' | 'light';
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  adminName?: string;
  adminAvatar?: string;
}

export default function Sidenav({ 
  currentScreen, 
  setScreen, 
  logout, 
  theme, 
  isSidebarOpen, 
  setIsSidebarOpen,
  adminName = 'Albert',
  adminAvatar = ''
}: SidenavProps) {
  const isLight = theme === 'light';

  const initials = adminName.charAt(0).toUpperCase() || 'A';

  // If we are on 'catalog', Dashboard label is 'Panel de Control'
  const dashboardLabel = currentScreen === 'catalog' ? 'Panel de Control' : 'Dashboard';

  // Editor label is 'Editor de Contenido' on login view, or 'Editor de Diseño' elsewhere
  const editorLabel = currentScreen === 'login' ? 'Editor de Contenido' : 'Editor de Diseño';

  const navItems = [
    { screen: 'dashboard', label: dashboardLabel, icon: LayoutDashboard },
    { screen: 'editor', label: editorLabel, icon: FileEdit },
    { screen: 'catalog', label: 'Catálogo', icon: Package },
    { screen: 'social', label: 'Redes Sociales', icon: Share2 },
    { screen: 'finance', label: 'Finanzas', icon: DollarSign },
  ] as const;

  return (
    <>
      {/* Mobile background overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 lg:static flex flex-col w-72 lg:w-20 hover:lg:w-72 h-full py-8 px-6 lg:px-4 hover:lg:px-6 flex-shrink-0 z-50 transition-all duration-300 border-r group ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-800 shadow-xl lg:shadow-none' 
          : 'bg-[#060e20] border-[#1e293b] text-[#dae2fd]'
      }`}>
        {/* Brand Logo & Close button */}
        <div className="px-2 mb-8 flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8b5cf6]/20 rounded-xl flex items-center justify-center border border-[#8b5cf6]/30 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#8b5cf6] animate-pulse" />
            </div>
            <div className="lg:w-0 lg:opacity-0 lg:group-hover:w-auto lg:group-hover:opacity-100 transition-all duration-300 overflow-hidden flex flex-col">
              <h1 className={`font-sans font-bold text-base tracking-tight transition-colors whitespace-nowrap ${
                isLight ? 'text-slate-900 font-black' : 'text-[#dae2fd]'
              }`}>
                MODO EDITOR
              </h1>
              <p className={`text-[11px] font-medium tracking-wide transition-colors whitespace-nowrap ${
                isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'
              }`}>
                Estudio de Diseño
              </p>
            </div>
          </div>

          {/* Close button on mobile/tablets */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
              isLight 
                ? 'border-[#EBE6DC] hover:bg-slate-100 text-slate-700' 
                : 'border-[#1e293b] hover:bg-[#131b2e] text-[#cbc3d7]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1 overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => {
                  setScreen(item.screen);
                  setIsSidebarOpen(false); // Close sidebar drawer on selection in mobile
                }}
                className={`flex items-center gap-3.5 px-4 lg:px-2.5 hover:lg:px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all group/item cursor-pointer w-full justify-start overflow-hidden ${
                  isActive
                    ? 'bg-[#8b5cf6]/15 text-[#8b5cf6] border-r-4 border-[#8b5cf6] font-bold'
                    : isLight 
                      ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-50' 
                      : 'text-[#cbc3d7] hover:text-[#dae2fd] hover:bg-[#131b2e]/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/item:scale-105 flex-shrink-0 ${
                  isActive ? 'text-[#8b5cf6]' : isLight ? 'text-slate-400' : 'text-[#cbc3d7]/70'
                }`} />
                <span className="truncate lg:opacity-0 lg:group-hover:opacity-100 lg:w-0 lg:group-hover:w-auto transition-all duration-300 whitespace-nowrap pl-0 lg:group-hover:pl-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Account */}
        <div className={`mt-auto pt-6 border-t flex flex-col gap-4 overflow-hidden ${
          isLight ? 'border-slate-200' : 'border-[#1e293b]'
        }`}>
          <div className="flex items-center gap-3 px-2 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#a78bfa] flex items-[#8b5cf6]/20 items-center justify-center font-bold text-sm text-white shadow-md shadow-[#8b5cf6]/10 flex-shrink-0 overflow-hidden border border-[#8b5cf6]/20">
              {adminAvatar ? (
                <img src={adminAvatar} alt={adminName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="lg:w-0 lg:opacity-0 lg:group-hover:w-auto lg:group-hover:opacity-100 transition-all duration-300 overflow-hidden flex flex-col">
              <p className={`text-sm font-semibold whitespace-nowrap ${isLight ? 'text-[#322c26]' : 'text-[#dae2fd]'}`}>{adminName}</p>
              <p className={`text-xs whitespace-nowrap ${isLight ? 'text-slate-500 font-normal' : 'text-[#cbc3d7] opacity-60'}`}>Administrador</p>
            </div>
          </div>

          {/* Log Out */}
          <button
            onClick={() => {
              logout();
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 lg:px-2.5 hover:lg:px-3.5 py-3 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-all font-medium group/logout cursor-pointer overflow-hidden justify-start w-full"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover/logout:-translate-x-0.5 transition-transform flex-shrink-0" />
            <span className="lg:opacity-0 lg:group-hover:opacity-100 lg:w-0 lg:group-hover:w-auto transition-all duration-300 whitespace-nowrap pl-0 lg:group-hover:pl-1">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
