import React from 'react';
import { ScreenType, Product, Transaction } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  History,
  ArrowRight,
  Sparkles,
  Server,
  Zap,
  HardDrive,
  Globe
} from 'lucide-react';
import { calcularEspacioUsado, MAX_STORE_SPACE_MB } from '../utils/storage';

interface DashboardViewProps {
  setScreen: (screen: ScreenType) => void;
  products: Product[];
  transactions: Transaction[];
  theme: 'dark' | 'light';
  adminName?: string;
}

export default function DashboardView({ setScreen, products, transactions, theme, adminName = 'Albert' }: DashboardViewProps) {
  const isLight = theme === 'light';

  // Compute some totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeProductsCount = products.length;

  // Compute dynamic growth rates based on sales transactions
  const baselineIncome = 6000;
  const growthPercentage = baselineIncome > 0 ? ((totalIncome - baselineIncome) / baselineIncome) * 100 : 0;
  const growthFormatted = `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`;
  const growthText = growthPercentage >= 0 
    ? `${growthPercentage.toFixed(1)}% más` 
    : `${Math.abs(growthPercentage).toFixed(1)}% menos`;

  // Calculate dynamic catalog space used using simulated Supabase parameters
  const totalSpaceUsedMb = calcularEspacioUsado(products);
  const maxAllowedSpaceMb = MAX_STORE_SPACE_MB;
  const usagePercentage = Math.min(100, Math.round((totalSpaceUsedMb / maxAllowedSpaceMb) * 100));

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in text-sans">
      {/* Intro Greetings */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[20px] md:rounded-[24px] border relative overflow-hidden transition-all duration-300 bg-gradient-to-r ${
        isLight 
          ? 'from-[#FAF8F5] to-[#F5F2EA] border-[#EBE6DC] text-slate-800' 
          : 'from-[#131b2e] to-[#0b1326] border-[#1e293b] text-white'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-[80px]" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold text-[#8b5cf6] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Módulo de Administración
          </span>
          <h3 className={`font-sans font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight ${isLight ? 'text-slate-905 font-black' : 'text-white'}`}>
            ¡Hola, {adminName}!
          </h3>
          <p className={`${isLight ? 'text-slate-600 font-medium' : 'text-[#cbc3d7]/70'} text-xs sm:text-sm max-w-xl leading-relaxed`}>
            ¡Te damos la bienvenida de vuelta a tu espacio creativo y de negocio! Sigue impulsando el crecimiento y la innovación hoy de manera constante.
          </p>
        </div>
        <button
          onClick={() => setScreen('editor')}
          className="relative z-10 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#8b5cf6] hover:bg-[#7c52f5] text-white rounded-xl text-xs font-bold font-sans flex items-center gap-2 shadow-lg shadow-[#8b5cf6]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          Editor de Diseño <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Bento Grid - Optimized to 2 items as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Metric 1: Total Ventas */}
        <div className={`border p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[20px] md:rounded-[24px] hover:border-[#8b5cf6]/40 transition-all duration-300 relative group overflow-hidden ${
          isLight ? 'bg-white border-[#EBE6DC] shadow-sm' : 'bg-[#131b2e]/80 border-[#1e293b]'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/5 rounded-full blur-2xl group-hover:bg-[#8b5cf6]/10 transition-all" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6]">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 text-emerald-500 bg-emerald-500/10">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Flujo Sano
            </span>
          </div>
          <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/60'}`}>
            Total Ventas
          </p>
          <p className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            ${totalIncome.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Metric 2: Active Products */}
        <div className={`border p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[20px] md:rounded-[24px] hover:border-[#8b5cf6]/40 transition-all duration-300 relative group overflow-hidden ${
          isLight ? 'bg-white border-[#EBE6DC] shadow-sm' : 'bg-[#131b2e]/80 border-[#1e293b]'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a78bfa]/5 rounded-full blur-2xl group-hover:bg-[#a78bfa]/10 transition-all" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#a78bfa]/10 rounded-xl text-[#8c65ff]">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className={`font-bold text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${isLight ? 'bg-[#FAF8F5] text-[#8c65ff]' : 'bg-[#a78bfa]/10 text-[#cebdff]'}`}>
              Catálogo Activo
            </span>
          </div>
          <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/60'}`}>
            Productos Activos
          </p>
          <p className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {activeProductsCount} <span className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>ítems</span>
          </p>
        </div>
      </div>

      {/* Main Content Layout Columns */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Service Statuses (Catalog space and Page size) - Expanded into full container */}
        <div className={`border rounded-xl sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-8 flex flex-col justify-between ${
          isLight ? 'bg-white border-[#EBE6DC] shadow-sm' : 'bg-[#131b2e]/55 border-[#1e293b]'
        }`}>
          <div className="space-y-4">
            <h4 className={`font-bold text-sm sm:text-base md:text-lg flex items-center gap-2 font-sans tracking-tight mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Server className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b5cf6]" /> Estados de Servicios del Sitio
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 pt-2">
              {/* Stat 1: Catalog space */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-[#cbc3d7]/80'}`}>
                    <HardDrive className="w-3.5 h-3.5 text-indigo-500" /> Almacenamiento (Supabase Prep)
                  </span>
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Usas {totalSpaceUsedMb} MB de {maxAllowedSpaceMb} MB
                  </span>
                </div>
                <div className={`h-2 sm:h-2.5 rounded-full overflow-hidden border ${isLight ? 'bg-[#FAF8F5] border-[#EBE6DC]' : 'bg-[#131b2e] border-[#1e293b]'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-[#8b5cf6] to-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/50'}`}>
                  Ocupando el {usagePercentage}% del límite. Monitoreo por cliente optimizado con compresión dinámica automática.
                </p>
              </div>

              {/* Stat 2: Page size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-[#cbc3d7]/80'}`}>
                    <Globe className="w-3.5 h-3.5 text-emerald-500" /> Tamaño de la Página Web Pública
                  </span>
                  <span className="font-extrabold text-emerald-500">
                    425 KB
                  </span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden border ${isLight ? 'bg-[#FAF8F5] border-[#EBE6DC]' : 'bg-[#131b2e] border-[#1e293b]'}`}>
                  <div 
                    className="h-full bg-emerald-400 rounded-full" 
                    style={{ width: '22%' }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                  <span className="text-emerald-500 font-semibold uppercase font-sans tracking-wide">
                    Altamente Optimizado - Carga Ultra Rápida
                  </span>
                  <span className={`opacity-80 ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/50'}`}>
                    Límite recomendado: 2.0 MB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`pt-4 mt-6 border-t ${isLight ? 'border-slate-100' : 'border-[#1e293b]'}`}>
            <p className={`text-[10px] sm:text-[11px] leading-relaxed font-sans ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/40'}`}>
              Los productos y assets multimedia se comprimen automáticamente en el CDN global de MODO EDITOR al guardarse para maximizar las tasas de conversión del cliente final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
