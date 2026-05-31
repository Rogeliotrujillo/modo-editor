import React, { useState } from 'react';
import { PageContent } from '../types';
import {
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Upload,
  Check,
  Type,
  Image as ImageIcon,
  Edit3,
  MousePointerClick,
  Info,
  Palette,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface EditorViewProps {
  pageContent: PageContent;
  onSaveContent: (content: PageContent) => void;
  theme: 'dark' | 'light';
  adminName?: string;
}

interface PresetPalette {
  id: string;
  name: string;
  primary: string;
  headingTextDark: string;
  headingTextLight: string;
  bodyTextDark: string;
  bodyTextLight: string;
}

const PRESET_PALETTES: PresetPalette[] = [
  {
    id: 'amethyst',
    name: 'Amatista Studio',
    primary: '#8b5cf6',
    headingTextDark: '#ffffff',
    headingTextLight: '#0f172a',
    bodyTextDark: '#cbc3d7',
    bodyTextLight: '#475569'
  },
  {
    id: 'emerald',
    name: 'Bosque Esmeralda',
    primary: '#059669',
    headingTextDark: '#f0fdf4',
    headingTextLight: '#064e3b',
    bodyTextDark: '#a7f3d0',
    bodyTextLight: '#1f2937'
  },
  {
    id: 'ocean',
    name: 'Atlántico Activo',
    primary: '#0284c7',
    headingTextDark: '#f0f9ff',
    headingTextLight: '#0369a1',
    bodyTextDark: '#bae6fd',
    bodyTextLight: '#374151'
  },
  {
    id: 'terracota',
    name: 'Calidez Atardecer',
    primary: '#ea580c',
    headingTextDark: '#fff7ed',
    headingTextLight: '#431407',
    bodyTextDark: '#ffedd5',
    bodyTextLight: '#4b5563'
  },
  {
    id: 'cosmic',
    name: 'Neon Cyberpunk',
    primary: '#db2777',
    headingTextDark: '#fdf2f8',
    headingTextLight: '#500724',
    bodyTextDark: '#fbcfe8',
    bodyTextLight: '#4b5563'
  },
  {
    id: 'mono',
    name: 'Contraste Helvecio',
    primary: '#111827',
    headingTextDark: '#f8fafc',
    headingTextLight: '#0f172a',
    bodyTextDark: '#cbd5e1',
    bodyTextLight: '#374151'
  }
];

const FONT_OPTIONS_HEADINGS = [
  { value: 'Space Grotesk', label: 'Space Grotesk (Modern/Tech)' },
  { value: 'Inter', label: 'Inter (Sleek/Corporate)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif/Elegant)' },
  { value: 'Outfit', label: 'Outfit (Nordic/Geometric)' },
  { value: 'Syne', label: 'Syne (Bold/Expressive)' }
];

const FONT_OPTIONS_BODY = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'PT Serif', label: 'PT Serif' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' }
];

export default function EditorView({ pageContent, onSaveContent, theme, adminName = 'Albert' }: EditorViewProps) {
  const isLight = theme === 'light';
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedElement, setSelectedElement] = useState<string | null>('heroHeading');
  const [sidebarTab, setSidebarTab] = useState<'content' | 'aesthetic'>('content');

  // Buffer state to edit content
  const [editedContent, setEditedContent] = useState<PageContent>({
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    themePalette: 'amethyst',
    textColorHeading: isLight ? '#0f172a' : '#ffffff',
    textColorBody: isLight ? '#475569' : '#cbc3d7',
    primaryBrandColor: '#8b5cf6',
    ...pageContent
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const deviceWidthClasses = {
    desktop: 'max-w-full h-full',
    tablet: 'max-w-[640px] h-[90%] border-x border-b border-[#8b5cf6]/10 rounded-[28px] my-auto shadow-xl transition-all',
    mobile: 'max-w-[360px] h-[85%] border-x border-b border-[#8b5cf6]/10 rounded-[28px] my-auto shadow-xl transition-all'
  };

  const handleApplyChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveContent(editedContent);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 1200);
  };

  const handleTextChange = (field: keyof PageContent, val: string) => {
    setEditedContent(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const applyPresetPalette = (p: PresetPalette) => {
    setEditedContent(prev => ({
      ...prev,
      themePalette: p.id,
      primaryBrandColor: p.primary,
      textColorHeading: isLight ? p.headingTextLight : p.headingTextDark,
      textColorBody: isLight ? p.bodyTextLight : p.bodyTextDark
    }));
  };

  const elementOptions = [
    { value: 'logoText', label: 'Logo de la Marca' },
    { value: 'heroHeading', label: 'Título Principal (Héroe)' },
    { value: 'heroParagraph', label: 'Introducción (Párrafo Héroe)' },
    { value: 'ctaText', label: 'Botón Principal' },
    { value: 'secondaryCtaText', label: 'Botón Secundario' },
    { value: 'heroImage', label: 'Imagen de Portada' },
    { value: 'storyHeading', label: 'Título de la Sección Secundaria' },
    { value: 'storyParagraph', label: 'Descripción de la Sección Secundaria' }
  ];

  // Dynamic Google Font Loader Inside Preview
  const headingFontClean = (editedContent.headingFont || 'Space Grotesk').replace(/\s+/g, '+');
  const bodyFontClean = (editedContent.bodyFont || 'Inter').replace(/\s+/g, '+');
  const styleHref = `https://fonts.googleapis.com/css2?family=${headingFontClean}:wght@500;700;800;900&family=${bodyFontClean}:wght@400;500;600;700&display=swap`;

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-sans min-h-[calc(100vh-12rem)] md:min-h-0">
      
      {/* Dynamic Font Injection link for Preview iframe context styling */}
      <link rel="stylesheet" href={styleHref} />

      {/* Top action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/50 pb-4 dark:border-slate-800/50">
        <div>
          <h4 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Editor de Diseño Visual <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Estudio</span>
          </h4>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
            Selecciona elementos directamente en el diseño interactivo o desde la caja de herramientas para personalizarlos.
          </p>
        </div>

        <button
          onClick={handleApplyChanges}
          disabled={isSaving}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-[#8b5cf6]/10 cursor-pointer ${
            saveSuccess
              ? 'bg-emerald-500 text-white'
              : 'bg-[#8b5cf6] hover:bg-[#7c52f5] text-white disabled:opacity-70'
          }`}
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Guardando cambios...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Cambios Sincronizados!</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar y Aplicar Cambios</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Main Content Shell */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1 min-h-0">
        
        {/* VIEWPORT AREA - takes full space adaptively */}
        <div className={`flex-1 flex flex-col rounded-[24px] border overflow-hidden transition-all min-h-[480px] lg:min-h-0 ${
          isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-[#060e20] border-[#1e293b]'
        }`}>
          {/* Viewport Control bar */}
          <div className={`h-14 border-b px-4 sm:px-6 flex justify-between items-center z-10 flex-shrink-0 ${
            isLight ? 'bg-slate-100/50 border-slate-200' : 'bg-[#131b2e] border-[#1e293b]'
          }`}>
            {/* Simulation URL */}
            <div className="flex gap-1.5 items-center overflow-hidden">
              <div className="hidden sm:flex gap-1.5 items-center mr-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
              </div>
              <span className={`text-[10px] font-mono tracking-wider px-3 py-1.5 rounded-lg border text-ellipsis overflow-hidden whitespace-nowrap ${
                isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0b1326] border-[#1e293b] text-[#cbc3d7]/50'
              }`}>
                www.{adminName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-design.com/preview
              </span>
            </div>

            {/* Device Selectors */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0b1326] border-[#1e293b]'
            }`}>
              <button
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded-lg transition-all ${
                  device === 'desktop'
                    ? (isLight ? 'bg-slate-100 text-[#8b5cf6]' : 'bg-[#8b5cf6]/20 text-[#d0bcff]')
                    : (isLight ? 'text-slate-400 hover:text-slate-600' : 'text-[#cbc3d7]/60 hover:text-white')
                }`}
                title="Vista Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded-lg transition-all ${
                  device === 'tablet'
                    ? (isLight ? 'bg-slate-100 text-[#8b5cf6]' : 'bg-[#8b5cf6]/20 text-[#d0bcff]')
                    : (isLight ? 'text-slate-400 hover:text-slate-600' : 'text-[#cbc3d7]/60 hover:text-white')
                }`}
                title="Vista Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded-lg transition-all ${
                  device === 'mobile'
                    ? (isLight ? 'bg-slate-100 text-[#8b5cf6]' : 'bg-[#8b5cf6]/20 text-[#d0bcff]')
                    : (isLight ? 'text-slate-400 hover:text-slate-600' : 'text-[#cbc3d7]/60 hover:text-white')
                }`}
                title="Vista Celular"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIEWPORT EMBED */}
          <div className={`flex-1 flex justify-center overflow-auto p-4 sm:p-6 md:p-8 ${
            isLight ? 'bg-slate-200/20' : 'bg-[#131b2e]/10'
          }`}>
            <div className={`w-full flex flex-col overflow-y-auto border relative transition-all duration-300 shadow-md ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b]/50 text-white'
            } ${deviceWidthClasses[device]}`}>
              
              {/* Inner live badge */}
              <div className="absolute top-4 right-4 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 px-3 py-1.5 rounded-full z-20 flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-pulse"></span>
                <span className="text-[10px] text-[#8b5cf6] font-bold uppercase tracking-widest leading-none">Previsualización</span>
              </div>

              {/* LIVE DEMO: HEADER */}
              <header className={`px-6 sm:px-8 py-5 flex justify-between items-center border-b relative z-10 ${
                isLight ? 'border-slate-100' : 'border-[#1e293b]/40'
              }`}>
                <span
                  onClick={() => setSelectedElement('logoText')}
                  className={`text-lg font-black tracking-tight cursor-pointer px-2.5 py-1 rounded-xl transition-all ${
                    isLight ? 'text-slate-900' : 'text-white'
                  } ${
                    selectedElement === 'logoText' 
                      ? 'ring-2 ring-[#8b5cf6] bg-[#8b5cf6]/10' 
                      : (isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5')
                  }`}
                  style={{ fontFamily: editedContent.headingFont || 'Space Grotesk' }}
                  title="Haz clic para editar"
                >
                  {editedContent.logoText}
                </span>

                <div className={`hidden sm:flex gap-6 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-[#cbc3d7]/70'}`} style={{ fontFamily: editedContent.bodyFont || 'Inter' }}>
                  <span className="hover:text-[#8b5cf6] cursor-pointer transition-colors">Inicio</span>
                  <span className="hover:text-[#8b5cf6] cursor-pointer transition-colors">Portafolio</span>
                  <span className="hover:text-[#8b5cf6] cursor-pointer transition-colors">Sobre mí</span>
                </div>
              </header>

              {/* LIVE DEMO: HERO */}
              <section className={`px-6 py-12 sm:px-12 flex flex-col justify-center items-start space-y-8 relative overflow-hidden bg-gradient-to-b ${
                isLight ? 'from-slate-50 to-white' : 'from-[#0b1326] via-[#0d152c] to-[#0f172a]'
              }`}>
                <div className="max-w-xl space-y-6 relative z-10 w-full text-left">
                  <h1
                    onClick={() => setSelectedElement('heroHeading')}
                    className={`text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight cursor-pointer px-2 py-1.5 rounded-xl transition-all ${
                      selectedElement === 'heroHeading' ? 'ring-2 ring-indigo-500 bg-[#8b5cf6]/10' : (isLight ? 'hover:bg-slate-150' : 'hover:bg-white/5')
                    }`}
                    style={{ 
                      color: editedContent.textColorHeading || (isLight ? '#0f172a' : '#ffffff'),
                      fontFamily: editedContent.headingFont || 'Space Grotesk'
                    }}
                  >
                    {editedContent.heroHeading}
                  </h1>

                  <p
                    onClick={() => setSelectedElement('heroParagraph')}
                    className={`text-xs sm:text-sm leading-relaxed cursor-pointer px-2 py-1 rounded-xl transition-all ${
                      selectedElement === 'heroParagraph' ? 'ring-2 ring-indigo-500 bg-[#8b5cf6]/10' : (isLight ? 'hover:bg-slate-150' : 'hover:bg-white/5')
                    }`}
                    style={{ 
                      color: editedContent.textColorBody || (isLight ? '#475569' : '#cbc3d7'),
                      fontFamily: editedContent.bodyFont || 'Inter'
                    }}
                  >
                    {editedContent.heroParagraph}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setSelectedElement('ctaText')}
                      className="px-5 py-2.5 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                      style={{ 
                        backgroundColor: editedContent.primaryBrandColor || '#8b5cf6',
                        fontFamily: editedContent.bodyFont || 'Inter'
                      }}
                    >
                      {editedContent.ctaText}
                    </button>
                    <button
                      onClick={() => setSelectedElement('secondaryCtaText')}
                      className={`px-5 py-2.5 border rounded-full text-xs font-bold transition-all hover:bg-white/5 cursor-pointer ${
                        selectedElement === 'secondaryCtaText' ? 'ring-2 ring-indigo-500 scale-95' : ''
                      }`}
                      style={{ 
                        borderColor: editedContent.primaryBrandColor || '#8b5cf6',
                        color: editedContent.primaryBrandColor || '#8b5cf6',
                        fontFamily: editedContent.bodyFont || 'Inter'
                      }}
                    >
                      {editedContent.secondaryCtaText}
                    </button>
                  </div>
                </div>

                {/* Hero Asset section */}
                <div className="w-full relative py-2">
                  <div className={`w-full h-44 sm:h-64 rounded-2xl overflow-hidden border relative group shadow-inner ${
                    isLight ? 'border-slate-200' : 'border-[#1e293b]'
                  }`}>
                    <img
                      src={editedContent.heroImage}
                      alt="Hero Cover"
                      className="w-full h-full object-cover transition-all grayscale duration-700 hover:grayscale-0"
                    />
                    <div
                      onClick={() => setSelectedElement('heroImage')}
                      className="absolute inset-0 bg-black/30 hover:bg-black/45 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <span className="px-3 py-2 bg-black/80 rounded-full text-[10px] uppercase font-bold tracking-widest text-white flex items-center gap-1.5 border border-[#8b5cf6]/30 select-none">
                        <ImageIcon className="w-3.5 h-3.5 text-[#8b5cf6]" /> Editar Imagen
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* LIVE DEMO: STORY */}
              <section className={`px-6 py-12 sm:px-12 space-y-4 border-t ${
                isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#090f20] border-[#1e293b]/30'
              }`}>
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: editedContent.primaryBrandColor || '#8b5cf6' }}></div>
                <h3
                  onClick={() => setSelectedElement('storyHeading')}
                  className={`text-lg sm:text-xl font-extrabold cursor-pointer px-2 py-1 rounded-xl transition-all ${
                    selectedElement === 'storyHeading' ? 'ring-2 ring-indigo-500 bg-[#8b5cf6]/10' : (isLight ? 'hover:bg-slate-150' : 'hover:bg-white/5')
                  }`}
                  style={{ 
                    color: editedContent.textColorHeading || (isLight ? '#0f172a' : '#ffffff'),
                    fontFamily: editedContent.headingFont || 'Space Grotesk'
                  }}
                >
                  {editedContent.storyHeading}
                </h3>
                <p
                  onClick={() => setSelectedElement('storyParagraph')}
                  className={`text-xs sm:text-sm leading-relaxed cursor-pointer px-2 py-1 rounded-xl transition-all ${
                    selectedElement === 'storyParagraph' ? 'ring-2 ring-indigo-500 bg-[#8b5cf6]/10' : (isLight ? 'hover:bg-slate-150' : 'hover:bg-white/5')
                  }`}
                  style={{ 
                    color: editedContent.textColorBody || (isLight ? '#475569' : '#cbc3d7'),
                    fontFamily: editedContent.bodyFont || 'Inter'
                  }}
                >
                  {editedContent.storyParagraph}
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* SIDE EDITING PANEL - Organized with Tabs for 'Content' vs 'Aesthetics' to look pristine */}
        <div className={`w-full lg:w-80 border rounded-[24px] p-5 flex flex-col justify-between flex-shrink-0 transition-colors duration-300 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#131b2e]/55 border-[#1e293b]'
        }`}>
          <div className="space-y-4">
            
            {/* Box Header */}
            <div className={`border-b pb-3 flex items-center justify-between ${isLight ? 'border-slate-150' : 'border-[#1e293b]'}`}>
              <div>
                <span className="text-[10px] font-bold text-[#8b5cf6] uppercase tracking-widest block mb-0.5">Caja de Herramientas</span>
                <h5 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Configurar Sitio</h5>
              </div>
              <Edit3 className="w-4 h-4 text-[#8b5cf6]" />
            </div>

            {/* Simple Visual Tab Switcher */}
            <div className={`grid grid-cols-2 p-1 rounded-xl border text-center text-xs ${
              isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-[#0b1326] border-[#1e293b]'
            }`}>
              <button
                type="button"
                onClick={() => setSidebarTab('content')}
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  sidebarTab === 'content'
                    ? (isLight ? 'bg-white text-[#8b5cf6] shadow-sm' : 'bg-[#8b5cf6]/20 text-white')
                    : (isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#cbc3d7]/65 hover:text-white')
                }`}
              >
                Contenido
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab('aesthetic')}
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  sidebarTab === 'aesthetic'
                    ? (isLight ? 'bg-white text-[#8b5cf6] shadow-sm' : 'bg-[#8b5cf6]/20 text-white')
                    : (isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#cbc3d7]/65 hover:text-white')
                }`}
              >
                Diseño Visual
              </button>
            </div>

            {/* Tab 1: Content Elements Editing */}
            {sidebarTab === 'content' && (
              <div className="space-y-4 pt-1 animate-fade-in">
                <div className="space-y-1.5">
                  <label className={`text-[10.5px] font-bold uppercase tracking-wide block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
                    Seleccionar Elemento
                  </label>
                  <select
                    value={selectedElement || ''}
                    onChange={(e) => setSelectedElement(e.target.value || null)}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-850' 
                        : 'bg-[#1a233a] border-[#2e3b56] text-white'
                    }`}
                  >
                    {elementOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedElement ? (
                  <div className="space-y-4">
                    <div>
                      <span className={`text-[10px] font-semibold block mb-1.5 uppercase tracking-wide ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>
                        Elemento del Lienzo Activo
                      </span>
                      <div className={`border px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#131b2e] border-[#1e293b] text-[#d0bcff]'
                      }`}>
                        <Type className="w-3.5 h-3.5 text-[#8b5cf6]" />
                        <span className="font-sans">
                          {elementOptions.find(o => o.value === selectedElement)?.label}
                        </span>
                      </div>
                    </div>

                    {selectedElement === 'heroImage' ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className={`text-[10px] font-bold block uppercase tracking-wide ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
                            URL de la Imagen (Hotlinking)
                          </label>
                          <input
                            type="text"
                            value={editedContent.heroImage}
                            onChange={(e) => handleTextChange('heroImage', e.target.value)}
                            className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                              isLight ? 'bg-slate-50 border-slate-200 text-slate-850' : 'bg-[#131b2e] border-[#2e3b56] text-white'
                            }`}
                          />
                        </div>
                        {/* Compact Image uploader mock with nice UX */}
                        <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all group ${
                          isLight 
                            ? 'border-slate-200 hover:border-[#8b5cf6] hover:bg-slate-50' 
                            : 'border-[#1e293b] hover:border-[#8b5cf6]/50 hover:bg-[#131b2e]/30'
                        }`}>
                          <Upload className="w-4 h-4 text-[#8b5cf6] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className={`text-[10px] block font-sans ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/50'}`}>Subir desde tu dispositivo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className={`text-[10.1px] font-bold block uppercase tracking-wide ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
                          Contenido de Texto
                        </label>
                        <textarea
                          rows={selectedElement.toLowerCase().includes('paragraph') ? 5 : 2}
                          value={editedContent[selectedElement as keyof PageContent] as string || ''}
                          onChange={(e) => handleTextChange(selectedElement as keyof PageContent, e.target.value)}
                          className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-[#8b5cf6] leading-relaxed resize-none ${
                            isLight ? 'bg-slate-50 border-slate-200 text-slate-850' : 'bg-[#131b2e] border-[#2e3b56] text-white'
                          }`}
                          placeholder="Escribe el contenido..."
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <MousePointerClick className="w-6 h-6 text-[#8b5cf6] mx-auto animate-bounce opacity-80" />
                    <p className={`text-xs font-semibold ${isLight ? 'text-slate-650' : 'text-[#cbc3d7]/50'}`}>Modo Interactivo Activo</p>
                    <p className={`text-[10px] leading-relaxed px-2 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/35'}`}>
                      Haz clic directo en cualquier cuadro de texto de la página web simulada para editarlo en tiempo real.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Aesthetic Styling / Themes / Colors & Fonts */}
            {sidebarTab === 'aesthetic' && (
              <div className="space-y-4 pt-1 animate-fade-in max-h-[460px] overflow-y-auto pr-1">
                
                {/* section: General Presets */}
                <div className="space-y-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wide flex items-center gap-1 text-[#8b5cf6]">
                    <Palette className="w-3.5 h-3.5" /> Paletas de Colores de la Web
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_PALETTES.map((palette) => {
                      const isSelected = editedContent.themePalette === palette.id;
                      return (
                        <button
                          key={palette.id}
                          type="button"
                          onClick={() => applyPresetPalette(palette)}
                          className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#8b5cf6] bg-[#8b5cf6]/5'
                              : (isLight ? 'border-slate-200 hover:bg-slate-50 bg-slate-50' : 'border-[#1e293b] hover:bg-[#1a233a] bg-[#131b2e]')
                          }`}
                        >
                          <span className={`text-[11px] font-bold block mb-1.5 transition-colors ${
                            isSelected ? (isLight ? 'text-[#8b5cf6]' : 'text-[#d0bcff]') : (isLight ? 'text-slate-800' : 'text-slate-200')
                          }`}>
                            {palette.name}
                          </span>
                          <div className="flex gap-1 items-center">
                            <span className="w-3 h-3 rounded-full shrink-0 border border-white/10" style={{ backgroundColor: palette.primary }} title="Color Destacado" />
                            <span className="w-3 h-3 rounded-full shrink-0 border border-white/10" style={{ backgroundColor: isLight ? palette.headingTextLight : palette.headingTextDark }} title="Color Título" />
                            <span className="w-3 h-3 rounded-full shrink-0 border border-white/10" style={{ backgroundColor: isLight ? palette.bodyTextLight : palette.bodyTextDark }} title="Color Párrafo" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section: Custom Color Sliders / Inputs */}
                <div className="space-y-2 pt-2 border-t dark:border-slate-800">
                  <span className="text-[10.5px] font-bold uppercase tracking-wide flex items-center gap-1 text-[#8b5cf6]">
                    <Sliders className="w-3.5 h-3.5" /> Personalizar Colores
                  </span>
                  
                  <div className="space-y-2.5">
                    {/* Input: Highlighting */}
                    <div className="flex items-center justify-between gap-2 border-b pb-2 dark:border-slate-800/60">
                      <span className={`text-[11px] font-medium ${isLight ? 'text-slate-650' : 'text-[#cbc3d7]/80'}`}>
                        Color de Marca (Botones)
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editedContent.primaryBrandColor || '#8b5cf6'}
                          onChange={(e) => setEditedContent(prev => ({ ...prev, primaryBrandColor: e.target.value }))}
                          className="w-8 h-7 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                        />
                        <span className="text-[10px] font-mono text-slate-450 uppercase">{editedContent.primaryBrandColor}</span>
                      </div>
                    </div>

                    {/* Input: Headings */}
                    <div className="flex items-center justify-between gap-2 border-b pb-2 dark:border-slate-800/60">
                      <span className={`text-[11px] font-medium ${isLight ? 'text-slate-650' : 'text-[#cbc3d7]/80'}`}>
                        Color de Título Principal
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editedContent.textColorHeading || (isLight ? '#0f172a' : '#ffffff')}
                          onChange={(e) => setEditedContent(prev => ({ ...prev, textColorHeading: e.target.value }))}
                          className="w-8 h-7 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                        />
                        <span className="text-[10px] font-mono text-slate-450 uppercase">{editedContent.textColorHeading}</span>
                      </div>
                    </div>

                    {/* Input: Body text */}
                    <div className="flex items-center justify-between gap-2 border-b pb-2 dark:border-slate-800/60">
                      <span className={`text-[11px] font-medium ${isLight ? 'text-slate-650' : 'text-[#cbc3d7]/80'}`}>
                        Color de Párrafos
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editedContent.textColorBody || (isLight ? '#475569' : '#cbc3d7')}
                          onChange={(e) => setEditedContent(prev => ({ ...prev, textColorBody: e.target.value }))}
                          className="w-8 h-7 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                        />
                        <span className="text-[10px] font-mono text-slate-450 uppercase">{editedContent.textColorBody}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Google Fonts selection */}
                <div className="space-y-3.5 pt-2 border-t dark:border-slate-800">
                  <span className="text-[10.5px] font-bold uppercase tracking-wide flex items-center gap-1 text-[#8b5cf6]">
                    <Type className="w-3.5 h-3.5" /> Fuentes de Tipografía
                  </span>

                  {/* Font dropdown titles */}
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className={`text-[10px] font-medium block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/70'}`}>
                        Tipografía de Títulos (Headings)
                      </label>
                      <select
                        value={editedContent.headingFont || 'Space Grotesk'}
                        onChange={(e) => setEditedContent(prev => ({ ...prev, headingFont: e.target.value }))}
                        className={`w-full rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] border ${
                          isLight 
                            ? 'bg-slate-50 border-slate-200 text-slate-800' 
                            : 'bg-[#1a233a] border-[#2e3b56] text-white'
                        }`}
                      >
                        {FONT_OPTIONS_HEADINGS.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className={`text-[10px] font-medium block ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/70'}`}>
                        Tipografía de Texto (Body)
                      </label>
                      <select
                        value={editedContent.bodyFont || 'Inter'}
                        onChange={(e) => setEditedContent(prev => ({ ...prev, bodyFont: e.target.value }))}
                        className={`w-full rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] border ${
                          isLight 
                            ? 'bg-slate-50 border-slate-200 text-slate-800' 
                            : 'bg-[#1a233a] border-[#2e3b56] text-white'
                        }`}
                      >
                        {FONT_OPTIONS_BODY.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Sincronización automáticas box */}
          <div className={`p-4 rounded-xl border mt-4 flex gap-2.5 items-start ${
            isLight ? 'bg-purple-50/50 border-purple-100 text-slate-700' : 'bg-[#131b2e]/50 border-[#1e293b]/50 text-[#cbc3d7]/70'
          }`}>
            <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? 'text-purple-600' : 'text-[#8b5cf6]'}`} />
            <div>
              <span className={`text-[10px] font-bold block ${isLight ? 'text-purple-700' : 'text-emerald-400'}`}>Estilo de Presentación</span>
              <p className="text-[10px] leading-normal font-sans mt-0.5">
                Las fuentes y colores se inyectan en tiempo real dentro del previsualizador interactivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
