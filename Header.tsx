import React, { useState, useRef } from 'react';
import { Sun, Moon, Menu, Eye, EyeOff, User, Lock, Image as ImageIcon, Check, X, Upload } from 'lucide-react';

interface HeaderProps {
  title: string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toggleSidebar: () => void;
  adminName?: string;
  adminAvatar?: string;
  editorPassword?: string;
  onUpdateAdmin?: (name: string, avatar: string, pass: string) => void;
  globalSearch?: string;
  onGlobalSearchChange?: (val: string) => void;
}

export default function Header({ 
  title, 
  theme, 
  toggleTheme, 
  toggleSidebar,
  adminName = 'Albert',
  adminAvatar = '',
  editorPassword = '1234',
  onUpdateAdmin,
  globalSearch = '',
  onGlobalSearchChange
}: HeaderProps) {
  const isLight = theme === 'light';
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Form edit states
  const [tempName, setTempName] = useState(adminName === 'Albert' ? '' : adminName);
  const [tempAvatar, setTempAvatar] = useState(adminAvatar);
  const [tempPassword, setTempPassword] = useState(editorPassword);
  
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with props when open
  const handleOpenMenu = () => {
    setTempName(adminName === 'Albert' ? '' : adminName);
    setTempAvatar(adminAvatar);
    setTempPassword(editorPassword);
    setSaveSuccess(false);
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setTempAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateAdmin) {
      onUpdateAdmin(tempName.trim() || adminName, tempAvatar, tempPassword.trim() || '1234');
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsAdminMenuOpen(false);
    }, 1200);
  };

  const initials = adminName.charAt(0).toUpperCase() || 'A';

  return (
    <header className={`h-20 border-b px-6 md:px-10 flex justify-between items-center sticky top-0 z-40 transition-colors duration-300 ${
      isLight ? 'border-slate-200 bg-white/95 text-slate-800' : 'border-[#1e293b] bg-[#0b1326]/60'
    } backdrop-blur-xl`}>
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Icon for Mobile & Tablet */}
        <button
          onClick={toggleSidebar}
          className={`lg:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
            isLight 
              ? 'border-slate-200 hover:bg-slate-50 text-slate-705' 
              : 'border-[#1e293b] hover:bg-[#131b2e] text-[#dae2fd]'
          }`}
          title="Abrir Menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className={`text-md sm:text-lg md:text-xl font-extrabold font-sans tracking-tight transition-colors ${
          isLight ? 'text-slate-900' : 'text-[#dae2fd]'
        }`}>
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Light/Dark Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              isLight 
                ? 'text-slate-705 hover:bg-slate-50 border border-slate-200 shadow-xs' 
                : 'text-[#cbc3d7]/80 hover:text-[#dae2fd] hover:bg-[#131b2e]'
            }`}
            title={isLight ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        <div className={`h-6 w-[1.5px] ${isLight ? 'bg-slate-200' : 'bg-[#1e293b]'}`}></div>

        {/* Admin profile drop-down trigger */}
        <div className="relative">
          <button
            onClick={handleOpenMenu}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-95 active:scale-[0.98] transition-all text-left cursor-pointer focus:outline-none select-none"
            title="Administración de Perfil"
          >
            <div className="text-right hidden sm:block">
              <span className={`text-xs font-bold block ${isLight ? 'text-slate-800' : 'text-[#dae2fd]'}`}>
                {adminName}
              </span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                Admin
              </span>
            </div>
            
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center font-bold text-xs sm:text-sm text-white border border-[#8b5cf6]/30 shadow-md shadow-[#8b5cf6]/10 flex-shrink-0 overflow-hidden">
              {adminAvatar ? (
                <img src={adminAvatar} alt={adminName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </button>

          {/* Admin editing panel dropdown container */}
          {isAdminMenuOpen && (
            <div className={`absolute right-0 mt-3.5 w-80 rounded-[22px] shadow-2xl border p-5 z-50 animate-fade-in ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#131b2e] border-[#1e293b] text-[#dae2fd]'
            }`}>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-dashed border-slate-205/30">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>
                  Ajustes de Administrador
                </span>
                <button 
                  onClick={() => setIsAdminMenuOpen(false)}
                  className={`p-1 rounded-lg hover:red hover:bg-rose-500/10 cursor-pointer ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/40'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Admin Avatar Preview and Upload */}
                <div className="flex items-center gap-4 bg-purple-500/5 p-3 rounded-xl border border-dashed border-[#8b5cf6]/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center font-bold text-white shadow flex-shrink-0 overflow-hidden">
                    {tempAvatar ? (
                      <img src={tempAvatar} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      tempName.charAt(0).toUpperCase() || 'A'
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      Imagen de Administrador
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-[#8b5cf6] hover:bg-[#7c52f5] text-white text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Upload className="w-3 h-3" /> Subir Imagen
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  {tempAvatar && (
                    <button
                      type="button"
                      onClick={() => setTempAvatar('')}
                      className="p-1 px-1.5 text-[9px] font-semibold text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10 cursor-pointer"
                      title="Quitar imagen"
                    >
                      Quitar
                    </button>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase font-extrabold tracking-wider ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>
                    Nombre de Usuario
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#cbc3d7]/60" />
                    <input
                      type="text"
                      required
                      placeholder="Nuevo nombre"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                      }`}
                    />
                  </div>
                </div>

                {/* Password for Editor Mode */}
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase font-extrabold tracking-wider ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>
                    Contraseña de Editor
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#cbc3d7]/60" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Edita contraseña"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      className={`w-full border rounded-xl pl-9 pr-9 py-2 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#8b5cf6] text-xs cursor-pointer ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/40'}`}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Buttons controls */}
                <div className="flex gap-2 pt-2">
                  {saveSuccess ? (
                    <div className="w-full text-center py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 animate-bounce">
                      <Check className="w-4 h-4" /> Perfil Guardado
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsAdminMenuOpen(false)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer border text-center transition-all ${
                          isLight ? 'border-slate-200 hover:bg-slate-50 text-slate-650' : 'border-[#1e293b] hover:bg-white/5 text-[#cbc3d7]'
                        }`}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-[#8b5cf6] hover:bg-[#7c52f5] text-white rounded-xl text-xs font-bold font-sans shadow shadow-[#8b5cf6]/10 cursor-pointer transition-all active:scale-95"
                      >
                        Guardar Perfil
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
