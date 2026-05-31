import React, { useState } from 'react';
import { Product } from '../types';
import {
  Plus,
  Search,
  Check,
  X,
  Trash2,
  Edit2,
  Boxes,
  Percent,
  Image as ImageIcon,
  FolderEdit,
  AlertCircle,
  Upload,
  HardDrive
} from 'lucide-react';
import {
  calcularEspacioUsado,
  verificarLimite,
  bloquearSubida,
  obtenerTamanioImagenKB,
  comprimirImagenBase64,
  MAX_STORE_SPACE_MB,
  MAX_PHOTO_SIZE_KB,
  MAX_PHOTOS_PER_PRODUCT,
  AUTO_COMPRESS_THRESHOLD_KB
} from '../utils/storage';

interface CatalogViewProps {
  products: Product[];
  categories: string[];
  theme: 'dark' | 'light';
  onAddProduct: (prod: Product) => void;
  onEditProduct: (updatedProd: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (newCat: string) => void;
  onDeleteCategory: (catToDelete: string) => void;
  globalSearch?: string;
  onGlobalSearchChange?: (val: string) => void;
}

export default function CatalogView({
  products,
  categories,
  theme,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  globalSearch,
  onGlobalSearchChange
}: CatalogViewProps) {
  const isLight = theme === 'light';
  
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const searchTerm = globalSearch !== undefined ? globalSearch : localSearchTerm;
  const setSearchTerm = onGlobalSearchChange !== undefined ? onGlobalSearchChange : setLocalSearchTerm;

  // Form states (can be creating or editing)
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Accesorios');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodDiscount, setProdDiscount] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');

  // Storage limit management states for automated Supabase preparation
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionFeedback, setCompressionFeedback] = useState<string | null>(null);

  // New Category input
  const [newCategoryName, setNewCategoryName] = useState('');

  // Delete safety
  const [deleteIdConfirm, setDeleteIdConfirm] = useState<string | null>(null);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Read local file elements, compress automatically if > 100 KB, check limits, and enforce constraints
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setStorageError(null);
    setCompressionFeedback(null);

    // 1. Check if store overall upload is already blocked at 40MB limit
    if (bloquearSubida(products)) {
      setStorageError("Límite alcanzado. Elimina productos para liberar espacio.");
      return;
    }

    setIsCompressing(true);

    try {
      const addedList: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Count pre-existing images plus what we're adding inside this modal form
        const currentCount = prodImages.length + addedList.length;
        if (currentCount >= MAX_PHOTOS_PER_PRODUCT) {
          setStorageError(`Solo puedes subir un máximo de ${MAX_PHOTOS_PER_PRODUCT} fotos por producto.`);
          break;
        }

        // Convert file representation to raw Base64 Data URL
        const base64Str = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error("Error leyendo el archivo"));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        const originalSizeKB = obtenerTamanioImagenKB(base64Str);

        // 1. Soporta hasta tres imágenes máximo, 500 kilobytes por foto (límite del archivo original)
        if (originalSizeKB > 500) {
          setStorageError(`La foto "${file.name}" supera el límite de subida de 500 KB (pesa ${originalSizeKB.toFixed(1)} KB).`);
          break;
        }

        let finalBase64 = base64Str;
        let wasCompressed = false;
        let compressedSizeKB = originalSizeKB;

        // 2. Compresión automática si supera los 100 KB
        if (originalSizeKB > AUTO_COMPRESS_THRESHOLD_KB) {
          const result = await comprimirImagenBase64(base64Str);
          finalBase64 = result.output;
          wasCompressed = result.compressed;
          compressedSizeKB = result.compressedSizeKB;
        }

        // 3. Recuerda que el máximo es 100 kilobytes por foto (comprobación de tamaño final)
        if (compressedSizeKB > 100) {
          setStorageError(`La foto "${file.name}" supera el límite final de 100 KB (pesa ${compressedSizeKB.toFixed(1)} KB).`);
          break;
        }

        // 4. Verify store global capacity before storing
        if (verificarLimite(products, finalBase64)) {
          setStorageError("Límite alcanzado. Elimina productos para liberar espacio.");
          break;
        }

        addedList.push(finalBase64);
        
        if (wasCompressed) {
          setCompressionFeedback(
            `"${file.name}" comprimido de ${originalSizeKB.toFixed(0)}KB a ${compressedSizeKB.toFixed(0)}KB con éxito.`
          );
        }
      }

      if (addedList.length > 0) {
        setProdImages(prev => {
          const filtered = addedList.filter(img => !prev.includes(img));
          const newList = [...prev, ...filtered].slice(0, MAX_PHOTOS_PER_PRODUCT);
          
          // Set cover image automatically to first image if current is empty
          if (!prodImage && newList.length > 0) {
            setProdImage(newList[0]);
          }
          return newList;
        });
      }
    } catch (err: any) {
      setStorageError("No se pudo procesar la imagen.");
      console.error(err);
    } finally {
      setIsCompressing(false);
      // Clean input target element so it can be clicked again
      e.target.value = '';
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'Todos' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      p.name.toLowerCase().includes(term) || 
      p.id.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  const openAddModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory(categories.filter(c => c !== 'Todos')[0] || 'Accesorios');
    setProdPrice('');
    setProdStock('');
    setProdDesc('');
    setProdImage('');
    setProdImages([]);
    setProdDiscount('');
    setStorageError(null);
    setCompressionFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price.toString());
    setProdStock(p.stock.toString());
    setProdDesc(p.description);
    setProdImage(p.image);
    setProdImages(p.images || []);
    setProdDiscount(p.discount ? p.discount.toString() : '');
    setStorageError(null);
    setCompressionFeedback(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    if (editingProductId) {
      // Editing Mode
      const updatedProduct: Product = {
        id: editingProductId,
        name: prodName,
        category: prodCategory,
        price: parseFloat(prodPrice) || 0,
        stock: parseInt(prodStock) || 0,
        description: prodDesc || 'Sin descripción.',
        image: prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
        images: prodImages,
        discount: prodDiscount ? Math.min(100, Math.max(0, parseInt(prodDiscount))) : undefined
      };
      
      // Verification before saving edit
      onEditProduct(updatedProduct);
    } else {
      // Create Mode
      const idSuffix = Math.floor(1000 + Math.random() * 9000);
      const newProduct: Product = {
        id: `MDO-${idSuffix}`,
        name: prodName,
        category: prodCategory,
        price: parseFloat(prodPrice) || 0,
        stock: parseInt(prodStock) || 0,
        description: prodDesc || 'Sin descripción.',
        image: prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
        images: prodImages,
        discount: prodDiscount ? Math.min(100, Math.max(0, parseInt(prodDiscount))) : undefined
      };
      onAddProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  const addImageToCollection = () => {
    if (!tempImageUrl) return;
    setStorageError(null);
    setCompressionFeedback(null);

    if (prodImages.length >= MAX_PHOTOS_PER_PRODUCT) {
      setStorageError(`Solo puedes agregar un máximo de ${MAX_PHOTOS_PER_PRODUCT} fotos por producto.`);
      return;
    }

    if (bloquearSubida(products)) {
      setStorageError("Límite alcanzado. Elimina productos para liberar espacio.");
      return;
    }

    if (verificarLimite(products, tempImageUrl)) {
      setStorageError("Límite alcanzado. Elimina productos para liberar espacio.");
      return;
    }

    setProdImages([...prodImages, tempImageUrl]);
    if (!prodImage) {
      setProdImage(tempImageUrl);
    }
    setTempImageUrl('');
  };

  const removeImageFromCollection = (index: number) => {
    setStorageError(null);
    setCompressionFeedback(null);
    const removedImg = prodImages[index];
    const filtered = prodImages.filter((_, i) => i !== index);
    setProdImages(filtered);
    
    // If we delete the cover image, set cover image to the next available from collection
    if (prodImage === removedImg) {
      setProdImage(filtered[0] || '');
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      alert('La categoría ya existe.');
      return;
    }
    onAddCategory(trimmed);
    setNewCategoryName('');
  };

  return (
    <div className="space-y-8 animate-fade-in text-sans">
      {/* Header and buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Catálogo de Productos
          </h4>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/60'}`}>
            Control de inventario, gestión de categorías, stock en tiempo real y descuentos aplicados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 border hover:scale-[1.01] active:scale-95 transition-all cursor-pointer ${
              isLight ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 'bg-[#131b2e]/50 text-slate-300 border-[#1e293b]'
            }`}
          >
            <FolderEdit className="w-4 h-4 text-[#8b5cf6]" />
            <span>Editar categorías</span>
          </button>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c52f5] text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 shadow-lg shadow-[#8b5cf6]/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Producto</span>
          </button>
        </div>
      </div>

      {/* Catalog status / Quick stats - 3-columns layout optimized for mobile/tablet */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className={`border p-3 sm:p-5 rounded-xl sm:rounded-[20px] transition-colors relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-sm shadow-slate-100/50' : 'bg-[#131b2e]/60 border-[#1e293b]'
        }`}>
          <span className={`text-[8px] sm:text-[10px] uppercase font-bold block mb-0.5 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>Total en Catálogo</span>
          <span className={`text-sm sm:text-lg md:text-xl font-extrabold ${isLight ? 'text-slate-800' : 'text-white'}`}>{products.length} productos</span>
        </div>
        <div className={`border p-3 sm:p-5 rounded-xl sm:rounded-[20px] transition-colors relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-sm shadow-slate-100/50' : 'bg-[#131b2e]/60 border-[#1e293b]'
        }`}>
          <span className={`text-[8px] sm:text-[10px] uppercase font-bold block mb-0.5 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>Alerta de Inventario</span>
          <span className="text-sm sm:text-lg md:text-xl font-extrabold text-amber-500 block">
            {products.reduce((acc, p) => acc + p.stock, 0)} en stock
          </span>
          <span className={`text-[9px] sm:text-[10.5px] mt-0.5 block font-medium ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/40'}`}>
            ({products.filter((p) => p.stock <= 5).length} con bajo stock)
          </span>
        </div>
        <div className={`border p-3 sm:p-5 rounded-xl sm:rounded-[20px] transition-colors relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-sm shadow-slate-100/50' : 'bg-[#131b2e]/60 border-[#1e293b]'
        }`}>
          <span className={`text-[8px] sm:text-[10px] uppercase font-bold block mb-0.5 ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>Moneda Oficial</span>
          <span className={`text-sm sm:text-lg md:text-xl font-extrabold ${isLight ? 'text-slate-800' : 'text-white'}`}>USD ($)</span>
        </div>
      </div>

      {/* Catalog Search & Category selection row */}
      <div className={`flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 p-4 rounded-[22px] border ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131b2e]/40 border-[#1e293b]/70'
      }`}>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setActiveCategory('Todos')}
            className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              activeCategory === 'Todos'
                ? 'bg-[#8b5cf6] text-white'
                : (isLight 
                    ? 'bg-white border border-[#EBE6DC] hover:bg-[#FAF8F5] text-slate-700' 
                    : 'bg-[#131b2e] hover:bg-[#131b2e]/90 text-[#cbc3d7]')
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                activeCategory === cat
                  ? 'bg-[#8b5cf6] text-white'
                  : (isLight 
                      ? 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700' 
                      : 'bg-[#131b2e] hover:bg-[#131b2e]/90 text-[#cbc3d7]')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#cbc3d7]/50 absolute top-1/2 -translate-y-1/2 left-3.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, ID o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#131b2e]/50 border-[#1e293b]/50 text-[#dae2fd]'
            }`}
          />
        </div>
      </div>

      {/* Grid container of products database list */}
      <div className={`border rounded-[24px] overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-sm shadow-slate-100/50' : 'bg-[#131b2e]/25 border-[#1e293b]'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className={`border-b select-none ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b1326] border-[#1e293b]/70'}`}>
              <tr className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-[#cbc3d7]/50'}`}>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Producto</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">ID</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Categoría</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center sm:text-left">Precio</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden xs:table-cell">Disponibilidad</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-[#EBE6DC]/60' : 'divide-[#1e293b]/30'}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const hasDiscount = p.discount !== undefined && p.discount > 0;
                  const discountedPrice = hasDiscount ? p.price * (1 - p.discount! / 100) : p.price;
                  const isExpanded = expandedProductId === p.id;

                  return (
                    <React.Fragment key={p.id}>
                      <tr 
                        onClick={() => setExpandedProductId(isExpanded ? null : p.id)}
                        className={`transition-colors cursor-pointer ${isLight ? 'hover:bg-[#FAF8F5]/80' : 'hover:bg-[#131b2e]/20'} ${isExpanded ? (isLight ? 'bg-purple-50/40' : 'bg-[#8b5cf6]/5') : ''}`}
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2.5 sm:gap-3.5">
                            <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border flex-shrink-0 ${
                              isLight ? 'bg-[#FAF8F5] border-[#EBE6DC]' : 'bg-[#131b2e] border-[#1e293b]/50'
                            }`}>
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs sm:text-sm font-semibold leading-normal truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>{p.name}</p>
                              <p className={`text-[10px] sm:text-xs max-w-xs truncate hidden sm:block ${isLight ? 'text-slate-450' : 'text-[#cbc3d7]/50'}`}>{p.description}</p>
                              {/* Tags or discount indication */}
                              {hasDiscount && (
                                <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 mt-0.5 bg-rose-500/10 text-rose-500 text-[8px] sm:text-[10px] font-extrabold rounded-md border border-rose-500/10 uppercase tracking-widest">
                                  <Percent className="w-2.5 h-2.5" /> {p.discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 py-3 sm:py-4 font-mono text-[10px] sm:text-xs hidden md:table-cell ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/60'}`}>
                          {p.id}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                            isLight 
                              ? 'bg-slate-100 text-[#8b5cf6] border-[#8b5cf6]/10' 
                              : 'bg-[#8b5cf6]/10 text-[#d0bcff] border-[#8b5cf6]/20'
                          }`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center sm:text-left">
                          {hasDiscount ? (
                            <div className="flex flex-col">
                              <span className={`text-[10px] sm:text-xs line-through ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/40'}`}>
                                ${p.price.toFixed(2)}
                              </span>
                              <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-rose-600' : 'text-[#dae2fd]'}`}>
                                ${discountedPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-slate-800' : 'text-[#dae2fd]'}`}>
                              ${p.price.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden xs:table-cell">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-400' : p.stock > 0 ? 'bg-amber-400' : 'bg-rose-500'}`} />
                            <span className={`text-[11px] sm:text-xs ${isLight ? 'text-slate-700' : 'text-[#dae2fd]'}`}>
                              {p.stock > 0 ? `${p.stock} uds` : 'Sin stock'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                          <div className="flex justify-end items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                            {deleteIdConfirm === p.id ? (
                              <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 p-1 rounded-xl">
                                <span className="text-[8px] sm:text-[9px] text-rose-500 font-bold uppercase px-1 font-sans">Eliminar?</span>
                                <button
                                  onClick={() => {
                                    onDeleteProduct(p.id);
                                    setDeleteIdConfirm(null);
                                  }}
                                  className="p-1 sm:p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                                  title="Confirmar"
                                >
                                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteIdConfirm(null)}
                                  className={`p-1 sm:p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isLight ? 'bg-slate-100 text-slate-500 hover:text-slate-800' : 'bg-[#131b2e] text-[#cbc3d7] hover:text-white'
                                  }`}
                                  title="Cancelar"
                                >
                                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => openEditModal(p)}
                                  className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                                    isLight 
                                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-650' 
                                      : 'bg-[#131b2e] hover:bg-white/5 text-[#cbc3d7]'
                                  }`}
                                  title="Editar producto"
                                >
                                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8b5cf6]" />
                                </button>
                                <button
                                  onClick={() => setDeleteIdConfirm(p.id)}
                                  className="p-1.5 sm:p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500/80 rounded-xl transition-all cursor-pointer"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded mini-panel for easy view / interaction on mobile and tap */}
                      {isExpanded && (
                        <tr className={isLight ? 'bg-slate-50/40' : 'bg-[#0f172a]/20'}>
                          <td colSpan={6} className="px-3 py-3 border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div>
                                <span className={`font-bold block ${isLight ? 'text-slate-700' : 'text-[#dae2fd]'}`}>
                                  Detalles rápidos: <span className="text-[#8b5cf6] font-extrabold">{p.name}</span>
                                </span>
                                <span className={`block text-[10px] ${isLight ? 'text-slate-550' : 'text-[#cbc3d7]/60'} mt-1`}>
                                  ID: <strong className="font-mono">{p.id}</strong> &bull; Categoría: {p.category} &bull; Stock: {p.stock} unidades
                                </span>
                                {p.description && (
                                  <span className={`block text-[10px] mt-1 italic ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/40'}`}>
                                    "{p.description}"
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 p-1 bg-purple-500/5 rounded-xl border border-purple-500/10 w-fit self-end" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => openEditModal(p)}
                                  className="px-3 py-1.5 bg-[#8b5cf6] text-white hover:bg-[#7c52f5] font-bold rounded-lg flex items-center gap-1 text-[10px] transition-all"
                                >
                                  <Edit2 className="w-3 h-3" /> Editar Datos
                                </button>
                                <button
                                  onClick={() => setDeleteIdConfirm(p.id)}
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
                  <td colSpan={6} className={`text-center py-12 text-xs ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/30'}`}>
                    No se encontraron productos registrados en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CATEGORY MANAGER MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm shadow-xl" onClick={() => setIsCategoryModalOpen(false)}></div>
          
          <div className={`w-full max-w-md rounded-[24px] overflow-hidden relative z-10 shadow-2xl border flex flex-col max-h-[85vh] transition-all ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#131b2e] border-[#1e293b]'
          }`}>
            <div className={`p-5 border-b flex justify-between items-center ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-[#0b1326] border-[#1e293b]'}`}>
              <div className="flex items-center gap-2">
                <FolderEdit className="w-4 h-4 text-[#8b5cf6]" />
                <h4 className={`font-bold text-sm ${isLight ? 'text-slate-800' : 'text-white'}`}>Sectores y Categorías</h4>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/5 text-slate-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content list & Form to add more */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Form inside modal */}
              <form onSubmit={handleCreateCategory} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nueva categoría (ej: Coleccionables)"
                  className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-white'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c52f5] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                >
                  Añadir
                </button>
              </form>

              <div className="space-y-1.5 pt-2">
                <label className={`text-[10px] uppercase font-bold tracking-wider block ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/50'}`}>
                  Categorías Disponibles
                </label>
                {categories.filter(c => c !== 'Todos').length > 0 ? (
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {categories.filter(c => c !== 'Todos').map((cat) => (
                      <div key={cat} className={`flex justify-between items-center px-3.5 py-2.5 rounded-xl border text-xs font-semibold ${
                        isLight ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-[#182236] border-[#222e47] text-slate-100'
                      }`}>
                        <span>{cat}</span>
                        {deleteCategoryConfirm === cat ? (
                          <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 p-1 rounded-lg">
                            <span className="text-[9px] text-rose-500 font-bold uppercase px-1.5 font-sans">¿Desvincular?</span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteCategory(cat);
                                setDeleteCategoryConfirm(null);
                              }}
                              className="p-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors cursor-pointer"
                              title="Confirmar eliminación"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCategoryConfirm(null)}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                isLight ? 'bg-slate-150 text-slate-650 hover:text-slate-800' : 'bg-[#131b2e] hover:bg-[#131b2e]/90 text-slate-305'
                              }`}
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteCategoryConfirm(cat)}
                            className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all cursor-pointer"
                            title="Eliminar categoría"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#cbc3d7]/35 py-4 text-center">No hay categorías específicas guardadas. Agrega una arriba.</p>
                )}
              </div>
            </div>
            
            <div className={`p-4 border-t flex items-center gap-2 ${
              isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-[#0b1326]/50 border--[#1e293b]/50 text-[#cbc3d7]/40'
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#8b5cf6]" />
              <p className="text-[10px] leading-normal font-sans">
                La eliminación de categorías no borra los productos asociados; los moverá automáticamente a la primera disponible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE OR EDIT PRODUCT MODAL (Supports Discounts & Multi-Images) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className={`w-full max-w-xl rounded-[24px] overflow-hidden relative z-10 shadow-2xl border flex flex-col max-h-[92vh] ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#131b2e] border-[#1e293b]'
          }`}>
            {/* Header */}
            <div className={`p-5 border-b flex justify-between items-center ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-[#0b1326] border-[#1e293b]'}`}>
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#8b5cf6]" />
                <h4 className={`font-bold text-md ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  {editingProductId ? 'Modificar Datos de Producto' : 'Añadir Nuevo Producto'}
                </h4>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/5 text-slate-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/65'}`}>
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-white'
                  }`}
                  placeholder="Ej: Teclado Mecánico Pro Alunite"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/65'}`}>
                    Categoría
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-white'
                    }`}
                  >
                    {categories.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/65'}`}>
                    Precio de Lista (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-white'
                    }`}
                    placeholder="99.99"
                  />
                </div>
              </div>

              {/* Stock and Discounts Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/65'}`}>
                    Stock Disponible
                  </label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-white'
                    }`}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/65'}`}>
                      Descuento (%) Opcional
                    </label>
                    <span className="text-[10px] font-semibold text-emerald-500">Ahorro Activo</span>
                  </div>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={prodDiscount}
                    onChange={(e) => setProdDiscount(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#8b5cf6] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-white'
                    }`}
                    placeholder="15 (para 15% OFF)"
                  />
                </div>
              </div>

              {/* MULTIPLE IMAGES SECTION - Drag or input URLs dynamically */}
              <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0b1326]/30 border-[#1e293b]'}`}>
                <div className="flex items-center gap-1 text-xs font-bold leading-none select-none">
                  <ImageIcon className="w-4 h-4 text-[#8b5cf6]" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>Galería Multimedia del Producto</span>
                  <span className="text-[9px] font-medium text-[#8b5cf6] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded ml-auto">Varios archivos</span>
                </div>

                {/* Storage Meter inside the Modal */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] ${
                  isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-[#0b1326]/50 border-[#1e293b]/50 text-[#cbc3d7]/60'
                }`}>
                  <div className="flex items-center gap-1 font-bold">
                    <HardDrive className="w-3.5 h-3.5 text-[#8b5cf6]" />
                    <span>Límite de Almacenamiento Estático (Supabase Prep):</span>
                  </div>
                  <span className="font-extrabold text-[#8b5cf6]">
                    {calcularEspacioUsado(products)} MB / {MAX_STORE_SPACE_MB} MB
                  </span>
                </div>

                {/* Storage Alert Message Banner */}
                {storageError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 flex items-start gap-2.5 text-xs animate-shake">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-extrabold block">Alerta de límites:</span>
                      <span className="font-medium">{storageError}</span>
                    </div>
                  </div>
                )}

                {/* Compression Success Message Banner */}
                {compressionFeedback && !storageError && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 flex items-start gap-2.5 text-xs">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-extrabold block">Optimización Automática:</span>
                      <span className="font-medium text-[11px]">{compressionFeedback}</span>
                    </div>
                  </div>
                )}

                {/* Compressor state display */}
                {isCompressing && (
                  <div className="p-3 bg-[#8b5cf6]/10 border border-[#8b5cf6]/35 rounded-xl text-[#8b5cf6] flex items-center gap-2.5 text-xs">
                    <div className="w-4 h-4 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    <span className="font-bold">Comprimiendo imagen a &lt;100 KB para Supabase...</span>
                  </div>
                )}

                {/* File Uploader supporting multiple files */}
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#8b5cf6]/35 rounded-xl p-4 text-center cursor-pointer hover:bg-[#8b5cf6]/5 transition-colors group">
                    <Upload className="w-5 h-5 text-[#8b5cf6] mb-1 group-hover:scale-110 transition-transform" />
                    <span className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-100'}`}>Seleccionar imágenes del dispositivo</span>
                    <span className={`text-[9px] ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/40'}`}>SOPORTA HASTA {MAX_PHOTOS_PER_PRODUCT} IMÁGENES &bull; MÁX 500 KB POR FOTO</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleLocalImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Mini Thumbnails Preview */}
                {prodImages.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <span className={`text-[9px] uppercase font-bold tracking-wider block ${isLight ? 'text-slate-400 mb-1' : 'text-[#cbc3d7]/50 mb-1'}`}>
                      Toca o haz clic en una foto para elegirla de portada principal:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {prodImages.map((imgUrl, i) => (
                        <div 
                          key={i} 
                          onClick={() => setProdImage(imgUrl)}
                          className={`group relative w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-all select-none ${
                            prodImage === imgUrl 
                              ? 'border-[#8b5cf6] ring-2 ring-[#8b5cf6]/20 ring-offset-1' 
                              : 'border-slate-200/60 dark:border-slate-800/60 hover:border-[#8b5cf6]/50'
                          }`}
                          title="Haz clic para seleccionar como portada principal"
                        >
                          <img src={imgUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                          {prodImage === imgUrl && (
                            <div className="absolute bottom-1 left-1 bg-[#8b5cf6] text-white rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider shadow-sm">
                              Portada
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImageFromCollection(i);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all font-bold text-xs"
                            title="Eliminar foto"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200/40 dark:border-slate-800/40 p-4 rounded-xl text-center">
                    <p className={`text-[10px] font-medium leading-relaxed ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/30'}`}>
                      No has agregado imágenes todavía. Selecciona fotos desde la sección superior "Seleccionar imágenes del dispositivo".
                    </p>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-[#cbc3d7]/65'}`}>
                  Descripción Detallada
                </label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-[#8b5cf6] resize-none ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-white'
                  }`}
                  placeholder="Detalla conectores, materiales, empaque, etc."
                />
              </div>

              {/* Calculations Box */}
              {prodPrice && (
                <div className={`p-3.5 rounded-xl border text-xs font-semibold ${
                  isLight ? 'bg-purple-50/50 border-purple-100/70 text-slate-800' : 'bg-[#0b1326] border-[#1e293b] text-slate-300'
                }`}>
                  <div className="flex justify-between items-center">
                    <span>Precio de Lista:</span>
                    <span>${(parseFloat(prodPrice) || 0).toFixed(2)} USD</span>
                  </div>
                  {prodDiscount && parseFloat(prodDiscount) > 0 && (
                    <div className="flex justify-between items-center text-rose-500 mt-1">
                      <span>Ahorro del Descuento ({prodDiscount}%):</span>
                      <span>-${((parseFloat(prodPrice) || 0) * (parseFloat(prodDiscount) / 100)).toFixed(2)} USD</span>
                    </div>
                  )}
                  <div className={`flex justify-between items-center pt-2 mt-2 border-t font-extrabold ${isLight ? 'border-purple-100' : 'border-[#1e293b]'}`}>
                    <span className={isLight ? 'text-slate-900' : 'text-white'}>Precio de Venta Final:</span>
                    <span className="text-emerald-500 text-sm">
                      ${((parseFloat(prodPrice) || 0) * (1 - (prodDiscount ? parseFloat(prodDiscount) / 100 : 0))).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#8b5cf6] hover:bg-[#7c52f5] text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-[#8b5cf6]/20 transition-all cursor-pointer"
                >
                  {editingProductId ? 'Guardar Cambios del Producto' : 'Guardar Producto en el Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
