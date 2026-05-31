import React, { useState } from 'react';
import { Transaction, Product } from '../types';
import {
  TrendingUp,
  Download,
  Plus,
  X,
  CreditCard,
  Coins,
  Search,
  Check,
  Edit2,
  Trash2,
  TrendingDown,
  Info,
  DollarSign,
  PackageCheck
} from 'lucide-react';

interface FinanceViewProps {
  products: Product[];
  transactions: Transaction[];
  theme: 'dark' | 'light';
  onAddTransaction: (trx: Transaction) => void;
  onEditTransaction: (updatedTrx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  globalSearch?: string;
  onGlobalSearchChange?: (val: string) => void;
  adminName?: string;
}

export default function FinanceView({
  products,
  transactions,
  theme,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  globalSearch,
  onGlobalSearchChange,
  adminName = 'Albert'
}: FinanceViewProps) {
  const isLight = theme === 'light';

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTrxId, setEditingTrxId] = useState<string | null>(null);

  // Form states matching user preferences
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [clientName, setClientName] = useState('Cliente de la Web');
  const [project, setProject] = useState('Venta de Catálogo');
  const [amountVal, setAmountVal] = useState('');
  const [trxDate, setTrxDate] = useState('2026-05-26');
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta' | 'Efectivo'>('Tarjeta');
  const [notes, setNotes] = useState('');

  // Search
  const [localFinanceSearch, setLocalFinanceSearch] = useState('');
  const financeSearch = globalSearch !== undefined ? globalSearch : localFinanceSearch;
  const setFinanceSearch = onGlobalSearchChange !== undefined ? onGlobalSearchChange : setLocalFinanceSearch;

  // Delete safety
  const [deleteIdConfirm, setDeleteIdConfirm] = useState<string | null>(null);
  const [expandedTrxId, setExpandedTrxId] = useState<string | null>(null);

  // Totals calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const openAddDrawer = () => {
    setEditingTrxId(null);
    setClientName('Cliente de la Web');
    
    if (products.length > 0) {
      const firstProd = products[0];
      setSelectedProductId(firstProd.id);
      const discountedPrice = firstProd.discount ? firstProd.price * (1 - firstProd.discount / 100) : firstProd.price;
      setAmountVal(discountedPrice.toFixed(2));
      setProject(`Venta: ${firstProd.name}`);
    } else {
      setSelectedProductId('');
      setAmountVal('');
      setProject('Venta de Catálogo');
    }

    setNotes('');
    setTrxDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Tarjeta');
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (t: Transaction) => {
    setEditingTrxId(t.id);
    setClientName(t.clientName || 'Cliente de la Web');
    setProject(t.project || 'Venta de Catálogo');
    setAmountVal(t.amount.toString());
    setTrxDate(t.date);
    setPaymentMethod(t.paymentMethod === 'Efectivo' ? 'Efectivo' : 'Tarjeta');

    // Attempt to automatically match a product by parsing the transaction's concept text
    const matched = products.find(p => t.concept.includes(p.name));
    if (matched) {
      setSelectedProductId(matched.id);
    } else if (products.length > 0) {
      setSelectedProductId(products[0].id);
    } else {
      setSelectedProductId('');
    }

    setIsDrawerOpen(true);
  };

  const handleProductSelectionChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      const discountedPrice = prod.discount ? prod.price * (1 - prod.discount / 100) : prod.price;
      setAmountVal(discountedPrice.toFixed(2));
      setProject(`Venta: ${prod.name}`);
    }
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountVal) return;

    const parsedAmount = parseFloat(amountVal) || 0;
    const selectedProd = products.find(p => p.id === selectedProductId);
    const resolvedConcept = selectedProd ? `Venta: ${selectedProd.name}` : project;

    if (editingTrxId) {
      // Edit mode
      const updatedTrx: Transaction = {
        id: editingTrxId,
        date: trxDate,
        concept: resolvedConcept,
        amount: parsedAmount,
        type: 'income',
        status: 'Completado',
        clientName,
        project: resolvedConcept,
        paymentMethod
      };
      onEditTransaction(updatedTrx);
    } else {
      // Create mode
      const trxId = `TRX-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTrx: Transaction = {
        id: trxId,
        date: trxDate,
        concept: resolvedConcept,
        amount: parsedAmount,
        type: 'income',
        status: 'Completado',
        clientName,
        project: resolvedConcept,
        paymentMethod
      };
      onAddTransaction(newTrx);
    }

    setIsDrawerOpen(false);
  };

  // Export to Excel with a beautiful formal table structure
  const handleExportExcel = () => {
    const generatedDate = new Date().toLocaleString('es-ES');
    
    // Calculate total net matching the system
    const incomes = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalInc = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);
    const net = totalInc - totalExp;

    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: #1e293b;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          .title-text {
            font-size: 18px;
            font-weight: bold;
            color: #7c3aed;
            padding-bottom: 5px;
          }
          .subtitle-text {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            padding-bottom: 20px;
          }
          .summary-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            font-size: 12px;
          }
          .summary-title {
            font-weight: bold;
            color: #475569;
          }
          .data-table th {
            background-color: #7c3aed;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
            text-align: left;
            padding: 12px 10px;
            border: 1.5px solid #6d28d9;
          }
          .data-table td {
            font-size: 12px;
            padding: 10px;
            border: 1px solid #e2e8f0;
          }
          .amount-val {
            text-align: right;
            font-weight: bold;
          }
          .income-type {
            color: #10b981;
            font-weight: bold;
          }
          .expense-type {
            color: #ef4444;
            font-weight: bold;
          }
          .footer-summary {
            font-weight: bold;
            background-color: #f1f5f9;
            border-top: 2px solid #cbd5e1;
          }
          .footer-summary-name {
            font-weight: bold;
            text-transform: uppercase;
            color: #0f172a;
            padding: 12px 10px;
          }
        </style>
      </head>
      <body>
        <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
          <tr>
            <td colspan="6" class="title-text">${adminName} Studio - Reporte General de Finanzas</td>
          </tr>
          <tr>
            <td colspan="6" class="subtitle-text">Control Administrativo de Ventas y Flujo Comercial</td>
          </tr>
          <tr>
            <td colspan="3" class="summary-card">
              <b>Generado:</b> ${generatedDate}<br/>
              <b>Administrador Responsable:</b> ${adminName}
            </td>
            <td colspan="3" class="summary-card" align="right" style="vertical-align: top;">
              <b>Mesa de Control</b><br/>
              <b>Flujo Neto Acumulado:</b> $${net.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </td>
          </tr>
        </table>

        <br/>

        <table class="data-table" border="1" cellpadding="5" cellspacing="0" bordercolor="#e2e8f0">
          <thead>
            <tr style="background-color: #7c3aed;">
              <th style="color: #ffffff; font-weight: bold; background-color: #7c3aed;">ID TRX</th>
              <th style="color: #ffffff; font-weight: bold; background-color: #7c3aed;">Fecha</th>
              <th style="color: #ffffff; font-weight: bold; background-color: #7c3aed;">Cliente</th>
              <th style="color: #ffffff; font-weight: bold; background-color: #7c3aed;">Detalle / Concepto</th>
              <th style="color: #ffffff; font-weight: bold; background-color: #7c3aed;">Medio de Pago</th>
              <th style="color: #ffffff; font-weight: bold; background-color: #7c3aed; text-align: right;">Monto Liquidado (USD)</th>
            </tr>
          </thead>
          <tbody>
    `;

    transactions.forEach((t) => {
      const formattedAmount = `$${t.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      htmlContent += `
        <tr>
          <td style="font-weight: bold;">${t.id}</td>
          <td>${t.date}</td>
          <td>${t.clientName || 'Cliente General'}</td>
          <td>${t.concept}</td>
          <td>${t.paymentMethod || 'Tarjeta'}</td>
          <td align="right" style="font-weight: bold; color: ${t.type === 'income' ? '#10b981' : '#ef4444'};">
            ${t.type === 'income' ? '' : '-'}${formattedAmount}
          </td>
        </tr>
      `;
    });

    htmlContent += `
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td colspan="4" style="font-weight: bold; padding: 12px; text-transform: uppercase;">Métricas Consolidadas de ${adminName} Studio</td>
              <td align="right" style="font-weight: bold; padding: 12px;">Total Neto:</td>
              <td align="right" style="font-weight: bold; padding: 12px; color: ${net >= 0 ? '#10b981' : '#ef4444'};">
                $${net.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reporte_Financiero_${adminName.replace(/\s+/g, '')}Studio.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered transactions
  const filteredTrx = transactions.filter((t) => {
    const term = financeSearch.toLowerCase();
    return (
      t.concept.toLowerCase().includes(term) ||
      t.id.toLowerCase().includes(term) ||
      (t.clientName && t.clientName.toLowerCase().includes(term))
    );
  });

  // Calculate dynamic data points for the real-time financial evolution chart
  const incomeTransactions = [...transactions]
    .filter((t) => t.type === 'income')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Take the last 8 income transactions
  const chartTrxs = incomeTransactions.slice(-8);
  const hasChartData = chartTrxs.length > 0;
  
  // Dynamic scaling for Y-axis numbers
  const maxAmountVal = hasChartData ? Math.max(...chartTrxs.map((t) => t.amount)) : 2000;
  const yScaleMax = maxAmountVal > 0 ? maxAmountVal * 1.18 : 2000;

  // Chart layout dimensions (viewbox is 1000 x 220)
  const paddingLeft = 85;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 45;
  const totalSvgWidth = 1000;
  const totalSvgHeight = 220;
  const plotWidth = totalSvgWidth - paddingLeft - paddingRight;
  const plotHeight = totalSvgHeight - paddingTop - paddingBottom;

  // Mapping points of real payments
  const points = chartTrxs.map((t, idx) => {
    const x = chartTrxs.length > 1
      ? paddingLeft + (idx / (chartTrxs.length - 1)) * plotWidth
      : paddingLeft + plotWidth / 2;
    const y = paddingTop + plotHeight - (t.amount / yScaleMax) * plotHeight;
    return { x, y, amount: t.amount, date: t.date, concept: t.concept };
  });

  // SVG Shapes builder
  let linePathD = '';
  let areaPathD = '';
  const bottomY = paddingTop + plotHeight;

  if (points.length > 0) {
    linePathD = `M ${points[0].x},${points[0].y} ` + points.slice(1).map((p) => `L ${p.x},${p.y}`).join(' ');
    areaPathD = `M ${points[0].x},${bottomY} ` + points.map((p) => `L ${p.x},${p.y}`).join(' ') + ` L ${points[points.length - 1].x},${bottomY} Z`;
  } else {
    // Elegant fallback if list is empty
    linePathD = `M ${paddingLeft},${bottomY - 30} L ${paddingLeft + plotWidth},${bottomY - 40}`;
    areaPathD = `M ${paddingLeft},${bottomY} L ${paddingLeft},${bottomY - 30} L ${paddingLeft + plotWidth},${bottomY - 40} L ${paddingLeft + plotWidth},${bottomY} Z`;
  }

  // Abbreviated spanish months utility for dynamic date rendering
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[2];
        const monthNum = parseInt(parts[1], 10);
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${day} ${months[monthNum - 1]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-sans min-h-[calc(100vh-12rem)] pb-10">
      
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Módulo de Finanzas
          </h4>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
            Registro de cobros directos de productos, análisis de rentabilidad bruta y curvas de crecimiento.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            onClick={openAddDrawer}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c52f5] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#8b5cf6]/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Venta</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Row - Space optimized for mobile/tablet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
        <div className={`border p-3 sm:p-5 rounded-xl sm:rounded-[20px] transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#131b2e]/65 border-[#1e293b]'
        }`}>
          <span className={`text-[8px] sm:text-[10px] uppercase font-bold block mb-0.5 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>Ingresos Totales</span>
          <span className="text-sm sm:text-lg md:text-xl font-extrabold text-emerald-500 block truncate">${totalIncome.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className={`border p-3 sm:p-5 rounded-xl sm:rounded-[20px] transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#131b2e]/65 border-[#1e293b]'
        }`}>
          <span className={`text-[8px] sm:text-[10px] uppercase font-bold block mb-0.5 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>Facturación Media</span>
          <span className={`text-sm sm:text-lg md:text-xl font-extrabold block truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>
            ${(transactions.length > 0 ? totalIncome / transactions.length : 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className={`border p-3 sm:p-5 rounded-xl sm:rounded-[20px] transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#131b2e]/65 border-[#1e293b]'
        }`}>
          <span className={`text-[8px] sm:text-[10px] uppercase font-bold block mb-0.5 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>Impuestos Estimados (16%)</span>
          <span className="text-sm sm:text-lg md:text-xl font-extrabold text-amber-500 block truncate">${(totalIncome * 0.16).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Bezier visual chart */}
      <div className={`border rounded-[24px] p-6 lg:p-8 space-y-5 ${
        isLight ? 'bg-white border-slate-200 shadow-sm shadow-slate-100' : 'bg-[#131b2e]/20 border-[#1e293b]'
      }`}>
        <div className="flex justify-between items-center select-none">
          <div>
            <h5 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-850' : 'text-white'}`}>
              <TrendingUp className="w-4 h-4 text-[#8b5cf6]" /> Rendimiento y Curvas de Evolución
            </h5>
            <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>
              Visualización intuitiva del flujo de facturación acumulada durante la última temporada.
            </p>
          </div>

          <div className="flex gap-4 text-[10px] font-semibold text-slate-400 dark:text-[#cbc3d7]/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></span>
              <span>Cobros</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Óptimo</span>
            </div>
          </div>
        </div>

        {/* Bezier SVG Line Curve chart */}
        <div className="h-56 sm:h-64 w-full relative pt-2">
          <svg className="w-full h-full font-mono overflow-visible" viewBox="0 0 1000 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines with dynamic Y-axis scale numbers */}
            {[0, 0.25, 0.5, 0.75, 1].map((level) => {
              const yPos = paddingTop + plotHeight - level * plotHeight;
              const valLabel = level * yScaleMax;
              return (
                <g key={level} className="opacity-90">
                  {/* Grid Line */}
                  <line 
                    x1={paddingLeft} 
                    y1={yPos} 
                    x2={totalSvgWidth - paddingRight} 
                    y2={yPos} 
                    stroke={isLight ? '#E4DEC9' : '#1e293b'} 
                    strokeOpacity={isLight ? '0.7' : '0.5'} 
                    strokeWidth="1" 
                    strokeDasharray="5,5" 
                  />
                  {/* Value Numbers scale text */}
                  <text 
                    x={12} 
                    y={yPos + 4} 
                    fontSize="10" 
                    fontWeight="bold" 
                    className={isLight ? 'fill-slate-600' : 'fill-[#cbc3d7]/60'}
                  >
                    ${Math.round(valLabel).toLocaleString('es-ES')}
                  </text>
                </g>
              );
            })}

            {/* Optimal reference dash curve - progresses gracefully */}
            <path
              d={`M ${paddingLeft},${paddingTop + plotHeight * 0.8} Q ${paddingLeft + plotWidth * 0.5},${paddingTop + plotHeight * 0.4} ${totalSvgWidth - paddingRight},${paddingTop + plotHeight * 0.15}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="6,4"
              strokeOpacity="0.75"
            />

            {/* Bezier Area Fill */}
            {areaPathD && (
              <path
                d={areaPathD}
                fill="url(#curveGrad)"
              />
            )}

            {/* Primary Business line */}
            {linePathD && (
              <path
                d={linePathD}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="4.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points anchors with interactive tooltip guides */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                {/* Outer pulsing ring hover effect */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="10" 
                  className="fill-[#8b5cf6]/10 opacity-0 group-hover:opacity-100 transition-opacity" 
                />
                
                {/* Node circle */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="5.5" 
                  fill={isLight ? '#FFFFFF' : '#131b2e'} 
                  stroke="#8b5cf6" 
                  strokeWidth="3.5" 
                />

                {/* Info bubble label overlay shown on hover */}
                <title>
                  {`${formatDateLabel(p.date)}: ${p.concept} ($${p.amount.toLocaleString()})`}
                </title>

                {/* Node Value text popups */}
                <text
                  x={p.x}
                  y={p.y - 14}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="bold"
                  className={`opacity-0 group-hover:opacity-100 transition-all pointer-events-none ${
                    isLight ? 'fill-[#8b5cf6]' : 'fill-purple-300'
                  }`}
                >
                  ${p.amount.toLocaleString()}
                </text>
              </g>
            ))}

            {/* Dynamic Date and Label X-Axis elements */}
            {points.map((p, idx) => (
              <text
                key={`lbl-${idx}`}
                x={p.x}
                y={totalSvgHeight - 12}
                textAnchor="middle"
                fontSize="9"
                fontWeight="extrabold"
                className={`select-none ${isLight ? 'fill-slate-500' : 'fill-[#cbc3d7]/40'}`}
              >
                {formatDateLabel(p.date)}
              </text>
            ))}
          </svg>

          {/* Sizing status tags */}
          <div className={`flex justify-between text-[9px] font-bold pt-3 select-none leading-none border-t ${
            isLight ? 'text-slate-500 border-[#EBE6DC]/80' : 'text-[#cbc3d7]/35 border-[#1e293b]'
          }`}>
            <span>INICIO TEMPORADA</span>
            <span className="text-[#8b5cf6] font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] inline-block" /> Escala basada en ventas reales en tiempo real
            </span>
            <span>PROYECCIÓN FINANZAS</span>
          </div>
        </div>
      </div>

      {/* Transactions list controller row */}
      <div className={`flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 p-4 rounded-[22px] border ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131b2e]/40 border-[#1e293b]/70'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'
          }`} />
          <input
            type="text"
            placeholder="Buscar por concepto o cliente..."
            value={financeSearch}
            onChange={(e) => setFinanceSearch(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
              isLight ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400' : 'bg-[#131b2e]/50 border-[#1e293b]/50 text-[#dae2fd]'
            }`}
          />
        </div>

        <button
          onClick={handleExportExcel}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm' 
              : 'bg-[#131b2e] border-[#1e293b] text-[#cbc3d7] hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Excel</span>
        </button>
      </div>

       {/* Transaction list grid */}
      <div className={`border rounded-[24px] overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-sm shadow-slate-100/50' : 'bg-[#131b2e]/25 border-[#1e293b]'
      }`}>
        <div className="overflow-x-auto select-none">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className={`border-b ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b1326] border-[#1e293b]/70'}`}>
              <tr className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-550' : 'text-[#cbc3d7]/50'}`}>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">ID TRX</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Producto Vendido / Detalle</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Medio Pago</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Importe Neto</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden xs:table-cell">Fecha</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-[#1e293b]/30'}`}>
              {filteredTrx.length > 0 ? (
                filteredTrx.map((t) => {
                  const isExpanded = expandedTrxId === t.id;

                  return (
                    <React.Fragment key={t.id}>
                      <tr 
                        onClick={() => setExpandedTrxId(isExpanded ? null : t.id)}
                        className={`transition-all cursor-pointer ${isLight ? 'hover:bg-slate-50/50' : 'hover:bg-[#131b2e]/20'} ${isExpanded ? (isLight ? 'bg-purple-50/40' : 'bg-[#8b5cf6]/5') : ''}`}
                      >
                        <td className={`px-3 sm:px-6 py-3 sm:py-4 font-mono text-[10px] sm:text-xs hidden md:table-cell ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/60'}`}>
                          {t.id}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <p className={`text-xs sm:text-sm font-bold truncate max-w-[180px] sm:max-w-none ${isLight ? 'text-slate-800' : 'text-white'}`}>{t.concept}</p>
                          {t.clientName && (
                            <p className={`text-[9px] sm:text-[10px] ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/40'} mt-0.5`}>Cliente: {t.clientName}</p>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-[#cbc3d7]/70'}`}>
                            {t.paymentMethod || 'Tarjeta'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className="text-xs sm:text-sm font-extrabold text-emerald-500">
                            +${t.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className={`px-3 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs hidden xs:table-cell ${isLight ? 'text-slate-555' : 'text-[#cbc3d7]/60'}`}>
                          {t.date}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                          <div className="flex justify-end items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                            {deleteIdConfirm === t.id ? (
                              <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 p-1 rounded-xl">
                                <span className="text-[8px] sm:text-[9px] text-rose-500 font-bold uppercase px-1 font-sans">Eliminar?</span>
                                <button
                                  onClick={() => {
                                    onDeleteTransaction(t.id);
                                    setDeleteIdConfirm(null);
                                  }}
                                  className="p-1 sm:p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                                  title="Sí, eliminar"
                                >
                                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteIdConfirm(null)}
                                  className={`p-1 sm:p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isLight ? 'bg-slate-100 text-slate-500 hover:text-slate-855' : 'bg-[#131b2e] text-[#cbc3d7] hover:text-white'
                                  }`}
                                  title="Cancelar"
                                >
                                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => openEditDrawer(t)}
                                  className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                                    isLight 
                                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-655' 
                                      : 'bg-[#131b2e] hover:bg-white/5 text-[#cbc3d7]'
                                  }`}
                                  title="Modificar transacción"
                                >
                                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8b5cf6]" />
                                </button>
                                <button
                                  onClick={() => setDeleteIdConfirm(t.id)}
                                  className="p-1.5 sm:p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                                  title="Eliminar de finanzas"
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded panel for mobile and quick tap details */}
                      {isExpanded && (
                        <tr className={isLight ? 'bg-slate-50/40' : 'bg-[#0f172a]/20'}>
                          <td colSpan={6} className="px-3 py-3 border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div>
                                <span className={`font-bold block ${isLight ? 'text-slate-700' : 'text-[#dae2fd]'}`}>
                                  Detalles de venta: <span className="text-[#8b5cf6] font-extrabold">{t.concept}</span>
                                </span>
                                <span className={`block text-[10px] ${isLight ? 'text-slate-550' : 'text-[#cbc3d7]/60'} mt-1`}>
                                  ID Transacción: <strong className="font-mono">{t.id}</strong> &bull; Método: {t.paymentMethod || 'Tarjeta'} &bull; Fecha: {t.date}
                                </span>
                                {t.clientName && (
                                  <span className={`block text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/50'}`}>
                                    Cliente Asignado: <strong className="font-semibold">{t.clientName}</strong>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 p-1 bg-purple-500/5 rounded-xl border border-purple-500/10 w-fit self-end" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => openEditDrawer(t)}
                                  className="px-3 py-1.5 bg-[#8b5cf6] text-white hover:bg-[#7c52f5] font-bold rounded-lg flex items-center gap-1 text-[10px] transition-all"
                                >
                                  <Edit2 className="w-3 h-3" /> Editar Datos
                                </button>
                                <button
                                  onClick={() => setDeleteIdConfirm(t.id)}
                                  className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold rounded-lg flex items-center gap-1 text-[10px] transition-all"
                                >
                                  <Trash2 className="w-3 h-3" /> Eliminar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className={`text-center py-10 text-xs ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/35'}`}>
                    No se encontraron transacciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTRAR O MODIFICAR VENTA SLIDE-OUT DRAWER (NEAT FLUID LAYOUT ON THE RIGHT) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Frosted glass backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity z-45"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Body - Slides out neatly from the right to avoid clashing */}
          <div className={`fixed inset-y-0 right-0 w-full max-w-md border-l flex flex-col justify-between shadow-2xl z-50 transition-all duration-300 animate-slide-in ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#131b2e] border-[#1e293b] text-white'
          }`}>
            
            {/* Header */}
            <div className={`px-6 py-5 border-b flex justify-between items-center ${isLight ? 'bg-slate-50 border-slate-150' : 'bg-[#0b1326] border-[#1e293b]/70'}`}>
              <h4 className={`font-black text-md tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {editingTrxId ? 'Modificar Registro de Venta' : 'Registrar Nueva Venta'}
              </h4>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/5 text-slate-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSaveTransaction} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Product selection dropdown linking directly to products */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/60'}`}>
                  Seleccionar Producto del Catálogo
                </label>
                {products.length > 0 ? (
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelectionChange(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#8b5cf6] font-semibold ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-850' : 'bg-[#0b1326] border-[#1e293b] text-[#dae2fd]'
                    }`}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ${p.price.toFixed(2)} USD {p.discount ? `(${p.discount}% OFF)` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 border rounded-xl border-dashed border-rose-500/30 text-rose-500 text-xs">
                    No tienes productos registrados en tu catálogo. Añade productos en el catálogo antes de registrar una venta.
                  </div>
                )}
              </div>

              {/* Amount input block (Pre-calculated automatically but remains tweakable) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/60'}`}>
                    Importe de Venta Individual (USD)
                  </label>
                  <span className="text-[10px] text-[#8b5cf6] font-bold uppercase">Base de Cobro</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amountVal}
                  onChange={(e) => setAmountVal(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#8b5cf6] font-extrabold ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-850' : 'bg-[#0b1326] border-[#1e293b] text-white'
                  }`}
                  placeholder="0.00"
                />
              </div>

              {/* Date Selector */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/60'}`}>
                  Fecha del Pago Consolidado
                </label>
                <input
                  type="date"
                  required
                  value={trxDate}
                  onChange={(e) => setTrxDate(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-850' : 'bg-[#0b1326] border-[#1e293b] text-white'
                  }`}
                />
              </div>

              {/* Restricted Payment Channels Grid (Tarjeta o Efectivo) */}
              <div className="space-y-2 pt-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/60'}`}>
                  Método de Venta (Tarjeta o Efectivo)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Tarjeta')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'Tarjeta'
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#8b5cf6] font-bold ring-1 ring-[#8b5cf6]/35'
                        : (isLight ? 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800' : 'border-[#1e293b] bg-[#0b1326] text-[#cbc3d7]/60 hover:text-white')
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Efectivo')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'Efectivo'
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#8b5cf6] font-bold ring-1 ring-[#8b5cf6]/35'
                        : (isLight ? 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800' : 'border-[#1e293b] bg-[#0b1326] text-[#cbc3d7]/60 hover:text-white')
                    }`}
                  >
                    <Coins className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Efectivo</span>
                  </button>
                </div>
              </div>

              {/* Calculations preview box showing total */}
              <div className="space-y-2 pt-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/60'}`}>
                  Comprobante de Venta Emitido
                </span>
                
                <div className={`p-4.5 rounded-2xl border space-y-3 font-sans text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-750' : 'bg-[#0b1326] border-[#1e293b]/70 text-slate-300'
                }`}>
                  <div className="flex justify-between items-center text-xs">
                    <span>Venta Item:</span>
                    <span className={`font-bold max-w-[180px] truncate ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                      {products.find(p => p.id === selectedProductId)?.name || 'Otros'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Monto Neto:</span>
                    <span className="font-mono font-semibold">${(parseFloat(amountVal) || 0).toFixed(2)} USD</span>
                  </div>

                  <div className={`border-t pt-3 mt-1.5 flex justify-between items-center font-black text-sm ${
                    isLight ? 'border-[#EBE6DC]/80' : 'border-[#1e293b]'
                  }`}>
                    <span className={isLight ? 'text-slate-900' : 'text-white'}>Total Cobrado:</span>
                    <span className="text-emerald-500 font-extrabold text-base">
                      ${(parseFloat(amountVal) || 0).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 p-3 bg-indigo-505 bg-indigo-500/5 text-indigo-400 rounded-xl border border-indigo-500/10 text-[10px] leading-relaxed select-none">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p>Al guardar, la factura bruta se sincronizará automáticamente con las curvas de ventas generales.</p>
                </div>
              </div>

            </form>

            {/* Form actions wrapper */}
            <div className={`p-5 border-t ${isLight ? 'bg-slate-50 border-slate-150' : 'bg-[#0b1326]/40 border-slate-800'}`}>
              <button
                type="button"
                onClick={handleSaveTransaction}
                disabled={!amountVal}
                className="w-full bg-[#8b5cf6] hover:bg-[#7c52f5] text-white py-3.5 rounded-xl font-bold text-xs select-none shadow-md shadow-[#8b5cf6]/10 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingTrxId ? 'Guardar Cambios de Transacción' : 'Registrar Venta Confirmada'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
