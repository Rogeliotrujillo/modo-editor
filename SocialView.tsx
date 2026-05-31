import React, { useState } from 'react';
import { SocialLinks } from '../types';
import {
  Share2,
  Instagram,
  Smartphone,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Sliders,
  RefreshCw,
  Mail,
  Linkedin
} from 'lucide-react';

interface SocialViewProps {
  social: SocialLinks;
  onSaveSocial: (social: SocialLinks) => void;
  theme: 'dark' | 'light';
  adminName?: string;
}

export default function SocialView({ social, onSaveSocial, theme, adminName = 'Albert' }: SocialViewProps) {
  const isLight = theme === 'light';

  const [instagram, setInstagram] = useState(social.instagram);
  const [tiktok, setTiktok] = useState(social.tiktok);
  const [whatsapp, setWhatsapp] = useState(social.whatsapp);
  const [whatsappMessage, setWhatsappMessage] = useState(social.whatsappMessage);
  const [gmail, setGmail] = useState(social.gmail || '');

  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState('saving');

    setTimeout(() => {
      onSaveSocial({
        instagram,
        tiktok,
        whatsapp,
        whatsappMessage,
        gmail
      });
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2000);
    }, 1000);
  };

  const getHandle = (url: string, fallback: string) => {
    try {
      if (!url) return fallback;
      if (url.includes('@')) return url;
      const parts = url.split('/');
      const handle = parts[parts.length - 1] || parts[parts.length - 2];
      return handle ? `@${handle.replace('@', '')}` : fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-sans min-h-[calc(100vh-12rem)] lg:min-h-0">
      {/* Header element */}
      <div className="flex-shrink-0">
        <h4 className={`text-lg font-extrabold tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Conectividad Social y Redes
        </h4>
        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
          Gestiona las redes oficiales, correos electrónicos corporativos y mensajes del catálogo interactivo.
        </p>
      </div>

      {/* Main split grid */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
        
        {/* LEFT: FORM CONFIGURATION */}
        <div className={`lg:col-span-7 border rounded-[24px] p-6 lg:p-8 flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#131b2e]/30 border-[#1e293b]'
        }`}>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest block border-b pb-2 ${
                isLight ? 'text-[#8b5cf6] border-slate-100' : 'text-[#8b5cf6] border-[#1e293b]'
              }`}>Canales de Marca</span>

              {/* Instagram URL */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/70'}`}>
                  Perfil Instagram Business
                </label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-[#cbc3d7]/50 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className={`w-full border rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                    }`}
                    placeholder="https://instagram.com/tu_marca"
                  />
                </div>
              </div>

              {/* TikTok URL */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/70'}`}>
                  Canal TikTok Creator
                </label>
                <div className="relative">
                  <Share2 className="w-4 h-4 text-[#cbc3d7]/50 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    className={`w-full border rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                    }`}
                    placeholder="https://tiktok.com/@tu_marca"
                  />
                </div>
              </div>

              {/* Correo Electrónico (Gmail) */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/70'}`}>
                  Correo Electrónico Corporativo (Gmail)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#cbc3d7]/50 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    className={`w-full border rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                    }`}
                    placeholder="ejemplo@gmail.com"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/70'}`}>
                  Número WhatsApp (con código de país)
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-[#cbc3d7]/50 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={`w-full border rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                    }`}
                    placeholder="Ej: +34600000000"
                  />
                </div>
              </div>
            </div>

            {/* WA CONSULT METRIC */}
            <div className="space-y-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest block border-b pb-2 ${
                isLight ? 'text-[#8b5cf6] border-slate-100' : 'text-[#8b5cf6] border-[#1e293b]'
              }`}>Mensajería Directa</span>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/70'}`}>
                  Mensaje de consulta por defecto
                </label>
                <p className={`text-[11px] leading-relaxed mb-2 select-none ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/50'}`}>
                  Este mensaje aparecerá automáticamente cuando un cliente haga clic en tu botón de WhatsApp desde la tienda.
                </p>
                <textarea
                  rows={3}
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  className={`w-full border rounded-xl p-3.5 text-xs focus:outline-none focus:border-[#8b5cf6] leading-relaxed resize-none ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-850' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                  }`}
                />
              </div>

              {/* LINK DIRECTO DE LA CONSULTA */}
              <div className={`p-4 rounded-xl border space-y-2.5 transition-colors ${
                isLight ? 'bg-indigo-50/50 border-indigo-100' : 'bg-emerald-500/5 border-emerald-400/10'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-indigo-700' : 'text-emerald-400'}`}>
                    Enlace Directo de Consulta Activa
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-400/10 text-emerald-400'}`}>
                    Link en vivo
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#cbc3d7]/65'}`}>
                  Usa este enlace directo generado dinámicamente para iniciar la consulta optimizada por WhatsApp:
                </p>
                
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-between gap-1.5 font-mono text-[10px] p-2.5 rounded-lg border select-all hover:scale-[1.005] transition-all cursor-pointer ${
                    isLight 
                      ? 'bg-white border-slate-200 text-indigo-600 hover:text-indigo-700' 
                      : 'bg-[#0b1326] border-[#1e293b] text-emerald-400 hover:text-emerald-300'
                  }`}
                  title="Probar enlace de consulta directa"
                >
                  <span className="truncate">https://wa.me/{whatsapp.replace(/[^0-9]/g, '')}?text={encodeURIComponent(whatsappMessage).slice(0, 45)}...</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingState === 'saving'}
                className="w-full bg-[#8b5cf6] hover:bg-[#7c52f5] text-white py-3.5 rounded-xl font-bold text-xs select-none shadow-md shadow-[#8b5cf6]/10 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savingState === 'saving' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardando cambios...</span>
                  </>
                ) : savingState === 'saved' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span>¡Configuración Sincronizada!</span>
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" />
                    <span>GUARDAR CONFIGURACIÓN</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: LIVE SMARTPHONE PREVIEW */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 overflow-hidden">
          <div className={`flex-1 border rounded-[24px] p-6 flex flex-col items-center justify-center relative min-h-[440px] ${
            isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#131b2e]/20 border-[#1e293b]/50'
          }`}>
            <div className={`absolute top-4 left-4 border px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm z-10 ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20 text-[#d0bcff]'
            }`}>
              <Smartphone className={`w-3.5 h-3.5 ${isLight ? 'text-[#8b5cf6]' : 'text-[#8b5cf6]'}`} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Demo de Enlaces</span>
            </div>

            {/* Smartphone mockup shape */}
            <div className={`w-60 sm:w-64 aspect-[9/18] rounded-[36px] border-[5px] shadow-2xl p-4 flex flex-col justify-between overflow-hidden relative ${
              isLight ? 'bg-slate-100 border-slate-300 shadow-slate-200' : 'bg-[#060e20] border-[#1e293b]'
            }`}>
              {/* Dynamic top speaker notch */}
              <div className={`w-20 h-3.5 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10 flex justify-center items-center ${
                isLight ? 'bg-slate-300' : 'bg-[#1e293b]'
              }`}>
                <span className="w-8 h-0.5 bg-black/40 rounded-full" />
              </div>

              {/* Status Bar */}
              <div className="flex justify-between text-[8px] font-semibold pt-1 select-none text-slate-400 dark:text-slate-600">
                <span>{adminName} Studio</span>
                <span>9:41 AM</span>
              </div>

              {/* Main screen content */}
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 pt-3 pb-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border ${
                  isLight ? 'bg-white border-slate-200 shadow-sm text-[#8b5cf6]' : 'bg-[#8b5cf6]/20 border-[#8b5cf6]/30 text-[#8b5cf6]'
                }`}>
                  <Share2 className="w-4.5 h-4.5" />
                </div>

                <div className="space-y-1 px-1">
                  <p className={`text-xs font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Digital Social Hub</p>
                  <p className={`text-[9.5px] leading-normal ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
                    Establece comunicación instantánea con mis canales digitales.
                  </p>
                </div>

                {/* Social items buttons inside smartphone simulation */}
                <div className="w-full space-y-2 pt-2 scrollbar-none overflow-y-auto max-h-[180px]">
                  {/* Instagrate link */}
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full border py-2.5 rounded-xl flex items-center justify-between px-3 group transition-all ${
                        isLight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-[#131b2e] border-[#1e293b] hover:border-[#8b5cf6]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Instagram className="w-3.5 h-3.5 text-[#8b5cf6]" />
                        <span className={`text-[9px] font-bold truncate max-w-[120px] ${isLight ? 'text-slate-700' : 'text-[#dae2fd]'}`}>
                          {getHandle(instagram, 'Instagram')}
                        </span>
                      </div>
                      <ExternalLink className={`w-2.5 h-2.5 opacity-60 group-hover:opacity-100 ${isLight ? 'text-slate-400' : 'text-white'}`} />
                    </a>
                  )}

                  {/* Tiktok handle preview */}
                  {tiktok && (
                    <a
                      href={tiktok}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full border py-2.5 rounded-xl flex items-center justify-between px-3 group transition-all ${
                        isLight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-[#131b2e] border-[#1e293b] hover:border-[#8b5cf6]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#cebdff] font-bold font-mono">T</span>
                        <span className={`text-[9px] font-bold truncate max-w-[120px] ${isLight ? 'text-slate-700' : 'text-[#dae2fd]'}`}>
                          {getHandle(tiktok, 'TikTok')}
                        </span>
                      </div>
                      <ExternalLink className={`w-2.5 h-2.5 opacity-60 group-hover:opacity-100 ${isLight ? 'text-slate-400' : 'text-white'}`} />
                    </a>
                  )}

                  {/* Gmail address */}
                  {gmail && (
                    <a
                      href={`mailto:${gmail}`}
                      className={`w-full border py-2.5 rounded-xl flex items-center justify-between px-3 group transition-all ${
                        isLight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-[#131b2e] border-[#1e293b] hover:border-[#8b5cf6]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-indigo-505 text-indigo-400" />
                        <span className={`text-[9px] font-bold truncate max-w-[120px] ${isLight ? 'text-slate-700' : 'text-[#dae2fd]'}`}>
                          {gmail}
                        </span>
                      </div>
                      <ExternalLink className={`w-2.5 h-2.5 opacity-60 group-hover:opacity-100 ${isLight ? 'text-slate-400' : 'text-white'}`} />
                    </a>
                  )}

                  {/* WhatsApp handle preview */}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 py-2.5 rounded-xl flex items-center justify-between px-3 group transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] text-emerald-500 font-extrabold">
                          WhatsApp Chat
                        </span>
                      </div>
                      <ExternalLink className="w-2.5 h-2.5 text-emerald-500/70" />
                    </a>
                  )}
                </div>
              </div>

              {/* Bottom bar indicator */}
              <div className={`w-16 h-1 rounded-full mx-auto mb-1 select-none ${
                isLight ? 'bg-slate-300' : 'bg-[#1e293b]'
              }`} />
            </div>
          </div>

          {/* Social views click performance tracker card */}
          <div className={`border p-4.5 rounded-[20px] flex items-center justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#131b2e]/30 border-[#1e293b]'
          }`}>
            <div className="space-y-0.5">
              <span className={`text-[9px] uppercase tracking-widest block font-bold ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>Clics en Canales (7d)</span>
              <p className={`text-base font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>3,842 clics</p>
            </div>
            <span className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" /> +12.4%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
