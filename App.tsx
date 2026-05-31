import React, { useState, useEffect } from 'react';
import { ScreenType, Product, Transaction, SocialLinks, PageContent } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  DEFAULT_SOCIAL,
  DEFAULT_CONTENT
} from './data';
import Sidenav from './components/Sidenav';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import EditorView from './components/EditorView';
import CatalogView from './components/CatalogView';
import SocialView from './components/SocialView';
import FinanceView from './components/FinanceView';
import { Sparkles, Key, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation states
  const [screen, setScreen] = useState<ScreenType>('login');
  const [password, setPassword] = useState('');
  const [errorOnLogin, setErrorOnLogin] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Clear search on screen change
  useEffect(() => {
    setGlobalSearch('');
  }, [screen]);

  // Theme states
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('modo_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  // Mobile sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Admin Profile and Password states
  const [adminName, setAdminName] = useState<string>(() => {
    return localStorage.getItem('modo_admin_name') || 'Albert';
  });
  const [adminAvatar, setAdminAvatar] = useState<string>(() => {
    return localStorage.getItem('modo_admin_avatar') || '';
  });
  const [editorPassword, setEditorPassword] = useState<string>(() => {
    return localStorage.getItem('modo_admin_password') || '1234';
  });

  // Load initial states from localStorage if available, or fall back to defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('modo_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('modo_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [social, setSocial] = useState<SocialLinks>(() => {
    const saved = localStorage.getItem('modo_social');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIAL;
  });

  const [pageContent, setPageContent] = useState<PageContent>(() => {
    const saved = localStorage.getItem('modo_page_content');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('modo_categories');
    return saved ? JSON.parse(saved) : ['Accesorios', 'Calzado', 'Oficina', 'Iluminación'];
  });

  // Keep state synchronized with localStorage
  useEffect(() => {
    localStorage.setItem('modo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('modo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('modo_social', JSON.stringify(social));
  }, [social]);

  useEffect(() => {
    localStorage.setItem('modo_page_content', JSON.stringify(pageContent));
  }, [pageContent]);

  useEffect(() => {
    localStorage.setItem('modo_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('modo_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('modo_admin_name', adminName);
  }, [adminName]);

  useEffect(() => {
    localStorage.setItem('modo_admin_avatar', adminAvatar);
  }, [adminAvatar]);

  useEffect(() => {
    localStorage.setItem('modo_admin_password', editorPassword);
  }, [editorPassword]);

  // Login handler
  const handleLogin = () => {
    if (password === editorPassword) {
      setScreen('dashboard');
      setErrorOnLogin(false);
      setPassword('');
    } else {
      setErrorOnLogin(true);
    }
  };

  const handleLogout = () => {
    setScreen('login');
    setPassword('');
    setErrorOnLogin(false);
  };

  // State manipulation handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleEditProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddTransaction = (newTrx: Transaction) => {
    setTransactions((prev) => [newTrx, ...prev]);
  };

  const handleEditTransaction = (updatedTrx: Transaction) => {
    setTransactions((prev) => prev.map((t) => t.id === updatedTrx.id ? updatedTrx : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveSocial = (newSocial: SocialLinks) => {
    setSocial(newSocial);
  };

  const handleSaveContent = (newContent: PageContent) => {
    setPageContent(newContent);
  };

  const handleAddCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setCategories((prev) => prev.filter((c) => c !== catToDelete));
  };

  // Humanize header names
  const screenTitles: Record<ScreenType, string> = {
    login: 'Estudio Obsidian Portal de Acceso',
    dashboard: 'Panel de Control Principal',
    editor: 'Editor de Diseño Creativo',
    catalog: 'Catálogo de Productos',
    finance: 'Ventas Simplificadas y Finanzas',
    social: 'Conectividad y Redes Sociales'
  };

  const isLight = theme === 'light';

  if (screen === 'login') {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center transition-colors duration-300 font-sans antialiased overflow-hidden select-none relative ${
        isLight ? 'bg-[#FAF8F5] text-slate-850' : 'bg-[#060c18] text-[#dae2fd]'
      }`}>
        {/* Glow ambient effects background */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[140px] pointer-events-none select-none z-0" />
        <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />

        <div className={`w-full max-w-sm border backdrop-blur-3xl px-10 py-12 rounded-[24px] shadow-2xl relative overflow-hidden text-center flex flex-col gap-8 justify-center min-h-[360px] z-10 mx-4 transition-all ${
          isLight ? 'bg-white/90 border-[#EBE6DC] shadow-slate-100' : 'bg-[#131b2e]/30 border-[#1e293b]/50'
        }`}>
          {/* Glow ambient inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1.5 select-none text-center col-span-1">
            <h1 className={`font-extrabold text-3xl tracking-[0.1em] uppercase font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>
              MODO EDITOR
            </h1>
            <p className={`text-[10px] font-bold tracking-[0.2em] uppercase font-sans ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/40'}`}>
              PANEL ADMINISTRATIVO
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Contraseña de acceso"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorOnLogin(false);
                }}
                className={`w-full border rounded-xl px-5 py-4 text-xs text-center focus:outline-none transition-all font-sans ${
                  errorOnLogin 
                    ? 'border-rose-500/80 focus:border-rose-500' 
                    : isLight 
                      ? 'bg-[#FAF8F5] border-[#EBE6DC] text-slate-800 focus:border-[#8b5cf6]/50 placeholder:text-slate-400'
                      : 'bg-[#131b2e]/60 border-[#1e293b] text-[#dae2fd] focus:border-[#8b5cf6]/50 placeholder:text-[#cbc3d7]/30'
                }`}
              />
              {errorOnLogin ? (
                <p className="text-[11px] text-rose-500 font-semibold select-none text-center animate-shake">
                  Contraseña incorrecta. Intenta de nuevo.
                </p>
              ) : (
                <p className={`text-[10px] font-medium text-center select-none ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/30'}`}>
                  Ingresa tu clave de editor para acceder.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#8c65ff] hover:bg-[#7c52f5] text-white py-4 rounded-xl font-bold text-xs select-none shadow-lg shadow-[#8b5cf6]/10 transition-all active:scale-[0.98] cursor-pointer font-sans"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden select-none font-sans antialiased transition-colors duration-300 ${
      isLight ? 'bg-[#F4F5F8] text-slate-800' : 'bg-[#0b1326] text-[#dae2fd]'
    }`}>
      {/* Sidenav component is always active and sidebar links function as bypass gateways */}
      <Sidenav
        currentScreen={screen}
        setScreen={(scr) => setScreen(scr)}
        logout={handleLogout}
        theme={theme}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        adminName={adminName}
        adminAvatar={adminAvatar}
      />

      <div className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${
        isLight ? 'bg-[#F4F5F8]' : 'bg-[#060c18]'
      }`}>
        {/* Glow ambient effects background */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[140px] pointer-events-none select-none z-0" />
        <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />

        {/* Global application header */}
        <Header 
          title={screenTitles[screen]} 
          theme={theme}
          toggleTheme={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          adminName={adminName}
          adminAvatar={adminAvatar}
          editorPassword={editorPassword}
          onUpdateAdmin={(name, avatar, pass) => {
            setAdminName(name);
            setAdminAvatar(avatar);
            setEditorPassword(pass);
          }}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
        />

        {/* Dynamic Screen Viewport Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 relative z-10 transition-colors">
          {screen === 'dashboard' ? (
            <DashboardView
              setScreen={setScreen}
              products={products}
              transactions={transactions}
              theme={theme}
              adminName={adminName}
            />
          ) : screen === 'editor' ? (
            <EditorView
              pageContent={pageContent}
              onSaveContent={handleSaveContent}
              theme={theme}
              adminName={adminName}
            />
          ) : screen === 'catalog' ? (
            <CatalogView
              products={products}
              categories={categories}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              theme={theme}
              globalSearch={globalSearch}
              onGlobalSearchChange={setGlobalSearch}
            />
          ) : screen === 'social' ? (
            <SocialView
              social={social}
              onSaveSocial={handleSaveSocial}
              theme={theme}
              adminName={adminName}
            />
          ) : (
            <FinanceView
              products={products}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              theme={theme}
              globalSearch={globalSearch}
              onGlobalSearchChange={setGlobalSearch}
              adminName={adminName}
            />
          )}
        </main>
      </div>
    </div>
  );
}
