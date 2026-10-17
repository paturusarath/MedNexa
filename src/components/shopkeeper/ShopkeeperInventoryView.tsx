import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  Package,
  Layers,
  Calendar,
  X,
  Save,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Eye,
  ShieldAlert,
  Check,
  ZoomIn,
  Camera,
  RotateCw,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { Medicine } from '../../types';
import { BottomNavTab } from '../BottomNav';

interface ShopkeeperInventoryViewProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
}

export const ShopkeeperInventoryView: React.FC<ShopkeeperInventoryViewProps> = ({ onNavigate }) => {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, addNotification } = useHealth();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sheetFilter, setSheetFilter] = useState<'all' | 'with_back_photo' | 'low_stock' | 'schedule_h'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [inspectingMed, setInspectingMed] = useState<Medicine | null>(null);
  const [inspectViewSide, setInspectViewSide] = useState<'front' | 'back'>('front');
  const [activeFlippedIds, setActiveFlippedIds] = useState<Record<string, boolean>>({});

  // New Medicine Form State
  const [newName, setNewName] = useState('');
  const [newGeneric, setNewGeneric] = useState('');
  const [newCategory, setNewCategory] = useState<Medicine['category']>('Cardiovascular');
  const [newDosageForm, setNewDosageForm] = useState<Medicine['dosageForm']>('Tablet');
  const [newPrice, setNewPrice] = useState(150);
  const [newStock, setNewStock] = useState(100);
  const [newStrength, setNewStrength] = useState('500mg');
  const [newRequiresRx, setNewRequiresRx] = useState(true);
  const [newManufacturer, setNewManufacturer] = useState('PulseMed Therapeutics Ltd');
  const [newBatchNumber, setNewBatchNumber] = useState('BATCH-2025-01');
  const [newExpiryDate, setNewExpiryDate] = useState('28/08/2027');
  const [newMfgDate, setNewMfgDate] = useState('15/09/2024');

  // Photo State for New Medicine
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'
  );
  const [newBackImage, setNewBackImage] = useState(
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80'
  );

  // Edit Photos inside Inspection Modal
  const [editInspectFront, setEditInspectFront] = useState('');
  const [editInspectBack, setEditInspectBack] = useState('');
  const [isEditingPhotos, setIsEditingPhotos] = useState(false);

  const categories: string[] = [
    'All',
    'Cardiovascular',
    'Antibiotics',
    'Pain Relief',
    'Vitamins & Supplements',
    'Diabetes Care',
    'Respiratory',
    'Thyroid Care',
  ];

  // Quick Photo Presets for Testing
  const photoPresets = [
    {
      name: 'Tablet Blister Strip',
      front: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Capsule Foil Sheet',
      front: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Antibiotic Duo Strip',
      front: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Cardio Protective Foil',
      front: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=80',
    },
  ];

  const handleApplyPreset = (preset: { front: string; back: string }) => {
    setNewImage(preset.front);
    setNewBackImage(preset.back);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'front') {
            setNewImage(reader.result);
          } else {
            setNewBackImage(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInspectFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'front') {
            setEditInspectFront(reader.result);
          } else {
            setEditInspectBack(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFlipCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenInspectModal = (med: Medicine) => {
    setInspectingMed(med);
    setInspectViewSide('front');
    setEditInspectFront(med.image);
    setEditInspectBack(med.backImage || '');
    setIsEditingPhotos(false);
  };

  const handleSaveInspectPhotos = () => {
    if (!inspectingMed) return;
    updateMedicine(inspectingMed.id, {
      image: editInspectFront || inspectingMed.image,
      backImage: editInspectBack || inspectingMed.backImage,
    });
    setInspectingMed((prev) =>
      prev
        ? {
            ...prev,
            image: editInspectFront || prev.image,
            backImage: editInspectBack || prev.backImage,
          }
        : null
    );
    setIsEditingPhotos(false);
    addNotification(
      'Medicine Photos Updated',
      `Front and back packaging pictures saved for ${inspectingMed.name}.`,
      'system',
      'shopkeeper'
    );
  };

  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name: newName.trim(),
      genericName: newGeneric.trim() || newName.trim(),
      category: newCategory,
      manufacturer: newManufacturer.trim() || 'PulseMed Therapeutics Ltd',
      dosageForm: newDosageForm,
      strength: newStrength.trim() || '500mg',
      price: Number(newPrice) || 100,
      discountPrice: Math.round(Number(newPrice) * 0.85),
      requiresPrescription: newRequiresRx,
      stock: Number(newStock) || 50,
      description: `Manufactured under WHO-GMP compliance. Batch ${newBatchNumber}. Expiry: ${newExpiryDate}.`,
      uses: ['Clinical prescription management', 'Doctor directed regimen'],
      sideEffects: ['Follow medical practitioner guidelines'],
      rating: 4.8,
      reviewsCount: 16,
      image: newImage,
      backImage: newBackImage,
      batchNumber: newBatchNumber,
      expiryDate: newExpiryDate,
      mfgDate: newMfgDate,
    };

    addMedicine(newMed);
    addNotification(
      'New Medicine Stock Added',
      `${newMed.name} (Batch: ${newBatchNumber}) added with front & back tablet sheet photos.`,
      'system',
      'shopkeeper'
    );

    setShowAddModal(false);
    setNewName('');
    setNewGeneric('');
  };

  const handleAdjustStock = (id: string, delta: number) => {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;
    const newQty = Math.max(0, med.stock + delta);
    updateMedicine(id, { stock: newQty });
  };

  const handleDeleteSku = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from pharmacy inventory?`)) {
      deleteMedicine(id);
      addNotification('SKU Removed', `${name} removed from active stock.`, 'system', 'shopkeeper');
    }
  };

  const filteredInventory = medicines.filter((med) => {
    if (categoryFilter !== 'All' && med.category !== categoryFilter) return false;

    if (sheetFilter === 'with_back_photo' && !med.backImage) return false;
    if (sheetFilter === 'low_stock' && med.stock >= 30) return false;
    if (sheetFilter === 'schedule_h' && !med.requiresPrescription) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        (med.batchNumber && med.batchNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const countWithBackPhoto = medicines.filter((m) => !!m.backImage).length;
  const countLowStock = medicines.filter((m) => m.stock < 30).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ========================================================================= */}
      {/* 1. INVENTORY HEADER WITH PHOTO & BATCH METRICS                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
              <Pill className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Medicine Inventory &amp; Tablet Sheet Inspection
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Front packaging &amp; back tablet foil verification, batch expiry control, and Schedule H register.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine + Photos</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS STRIP (Tablet Sheet Photos & Stock Health)                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Total Cataloged SKUs</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{medicines.length} Items</div>
          <span className="text-[11px] text-slate-500">100% WHO-GMP Certified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Verified Sheet Back Photos</span>
            <ImageIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {countWithBackPhoto} / {medicines.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            Blister Foil &amp; Batch Print Ready
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Low Stock Reorders</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{countLowStock} SKUs</div>
          <span className="text-[11px] text-rose-600 font-semibold">Under 30 Strips Remaining</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Schedule H Rx Required</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {medicines.filter((m) => m.requiresPrescription).length} Items
          </div>
          <span className="text-[11px] text-slate-500">Antibiotics &amp; Cardiac Drugs</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FILTER TABS & SEARCH BAR                                               */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSheetFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                sheetFilter === 'all'
                  ? 'bg-white text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({medicines.length})
            </button>
            <button
              type="button"
              onClick={() => setSheetFilter('with_back_photo')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                sheetFilter === 'with_back_photo'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>With Strip Back Photo ({countWithBackPhoto})</span>
            </button>
            <button
              type="button"
              onClick={() => setSheetFilter('low_stock')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                sheetFilter === 'low_stock'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Low Stock Alert ({countLowStock})
            </button>
            <button
              type="button"
              onClick={() => setSheetFilter('schedule_h')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                sheetFilter === 'schedule_h'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              Schedule H (Rx)
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, salt, or batch #..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs font-medium"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs transition whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MEDICINE INVENTORY TABLE WITH FRONT / BACK TABLET SHEET PHOTOS         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Medicine Photos (Front / Back Foil)</th>
                <th className="p-3.5">Medicine Name &amp; Generic Salt</th>
                <th className="p-3.5">Category &amp; Form</th>
                <th className="p-3.5">Batch # &amp; Expiry</th>
                <th className="p-3.5">Retail MRP (₹ INR)</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5 text-right">Quick Stock / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Pill className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">No medicines match the selected filter or search.</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((med) => {
                  const isLowStock = med.stock < 30;
                  const isFlipped = activeFlippedIds[med.id] || false;
                  const displayImage = isFlipped && med.backImage ? med.backImage : med.image;

                  return (
                    <tr
                      key={med.id}
                      className="hover:bg-amber-50/20 transition cursor-pointer group"
                      onClick={() => handleOpenInspectModal(med)}
                      title="Click to view packaging and back tablet foil details"
                    >
                      {/* Photo Column with Front/Back Flip Toggle */}
                      <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group/img shrink-0 shadow-2xs">
                          <img
                            src={displayImage}
                            alt={med.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />

                          {/* Flip Button Overlay */}
                          {med.backImage && (
                            <button
                              type="button"
                              onClick={(e) => handleToggleFlipCard(med.id, e)}
                              className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-slate-900 text-white text-[9px] font-bold flex items-center gap-1 backdrop-blur-xs transition cursor-pointer"
                              title="Click to switch between front pack and back tablet foil"
                            >
                              <RotateCw className="w-2.5 h-2.5" />
                              <span>{isFlipped ? 'Back' : 'Front'}</span>
                            </button>
                          )}

                          {!med.backImage && (
                            <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-slate-900/60 text-white text-[8px] font-bold">
                              Front
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Name & Generic */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 group-hover:text-amber-900 transition flex items-center gap-1.5">
                          <span>{med.name}</span>
                          {med.backImage && (
                            <span
                              className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold"
                              title="Back photo of tablet sheet available"
                            >
                              Foil Verified
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          {med.genericName}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Mfg: {med.manufacturer}
                        </div>
                      </td>

                      {/* Category & Form */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {med.category}
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">
                            {med.dosageForm} ({med.strength})
                          </span>
                        </div>
                      </td>

                      {/* Batch & Expiry */}
                      <td className="p-3.5">
                        <div className="font-mono text-xs font-bold text-slate-800">
                          {med.batchNumber || 'BAT-2025-01'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Exp: <strong className="text-slate-700">{med.expiryDate || '28/08/2027'}</strong>
                        </div>
                        {med.requiresPrescription && (
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[9px] font-bold">
                            Schedule H (Rx)
                          </span>
                        )}
                      </td>

                      {/* Price in ₹ INR */}
                      <td className="p-3.5">
                        <div className="font-black text-slate-900 font-mono text-sm">
                          ₹{med.price.toFixed(2)}
                        </div>
                        {med.discountPrice && (
                          <div className="text-[10px] text-emerald-600 font-semibold font-mono">
                            Counter: ₹{med.discountPrice.toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-black font-mono text-sm ${
                              isLowStock ? 'text-rose-600 font-black' : 'text-slate-900'
                            }`}
                          >
                            {med.stock} strips
                          </span>
                          {isLowStock && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-bold animate-pulse">
                              Low
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Location: Rack B-4
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(med.id, -10)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer text-xs"
                            title="Dispense 10 Strips"
                          >
                            -10
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(med.id, 25)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-bold cursor-pointer text-xs"
                            title="Add 25 Strips from Stock"
                          >
                            +25
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenInspectModal(med)}
                            className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 rounded-lg cursor-pointer transition"
                            title="Inspect Tablet Sheet Photos"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSku(med.id, med.name)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-700 rounded-lg cursor-pointer transition"
                            title="Delete SKU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. INSPECT MEDICINE PACKAGING & TABLET SHEET PHOTO MODAL                   */}
      {/* ========================================================================= */}
      {inspectingMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Pill className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {inspectingMed.name}
                  </h3>
                  <p className="text-xs text-slate-500">{inspectingMed.genericName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingMed(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-side or Tabbed Photo Inspector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Tablet Strip &amp; Packaging Verification Desk
                </span>
                <div className="inline-flex p-0.5 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setInspectViewSide('front')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      inspectViewSide === 'front'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Front Packaging
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectViewSide('back')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                      inspectViewSide === 'back'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Back Tablet Sheet (Foil &amp; Batch)</span>
                    {inspectingMed.backImage && <Check className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Large Image Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center min-h-[260px] max-h-[340px]">
                {inspectViewSide === 'front' ? (
                  <img
                    src={editInspectFront || inspectingMed.image}
                    alt="Front Packaging"
                    className="max-h-[320px] w-auto object-contain mx-auto"
                  />
                ) : inspectingMed.backImage || editInspectBack ? (
                  <img
                    src={editInspectBack || inspectingMed.backImage}
                    alt="Back Tablet Sheet Foil"
                    className="max-h-[320px] w-auto object-contain mx-auto"
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <ImageIcon className="w-10 h-10 mx-auto opacity-50 text-slate-500" />
                    <p className="text-xs font-bold">No back picture of tablet sheet uploaded yet.</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingPhotos(true)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold cursor-pointer transition"
                    >
                      + Upload Back Picture of Sheet
                    </button>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-2">
                  <span>
                    {inspectViewSide === 'front'
                      ? 'Front Box / Strip Face'
                      : 'Back Foil Sheet: Batch, Expiry & Composition'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Photo Editor Form */}
            {isEditingPhotos ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Update Medicine Photos</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsEditingPhotos(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Front Packaging Photo URL / File
                    </label>
                    <input
                      type="text"
                      value={editInspectFront}
                      onChange={(e) => setEditInspectFront(e.target.value)}
                      placeholder="Image URL"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <label className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold cursor-pointer">
                      <Upload className="w-3 h-3 text-amber-600" />
                      <span>Upload Front File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInspectFileUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Back Picture of Tablet Sheet (Foil)
                    </label>
                    <input
                      type="text"
                      value={editInspectBack}
                      onChange={(e) => setEditInspectBack(e.target.value)}
                      placeholder="Back foil image URL"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <label className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold cursor-pointer">
                      <Upload className="w-3 h-3 text-amber-600" />
                      <span>Upload Back Sheet File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInspectFileUpload(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveInspectPhotos}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Photo Changes</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingPhotos(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Update Front / Back Photos</span>
                </button>
              </div>
            )}

            {/* Medicine Spec Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Batch Number</span>
                <span className="font-mono font-bold text-slate-900">
                  {inspectingMed.batchNumber || 'BAT-2025-01'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Expiry Date</span>
                <span className="font-mono font-bold text-slate-900">
                  {inspectingMed.expiryDate || '28/08/2027'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Retail Price (MRP)</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{inspectingMed.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Stock</span>
                <span className="font-mono font-bold text-slate-900">
                  {inspectingMed.stock} strips
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectingMed(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ADD MEDICINE MODAL WITH FRONT & BACK TABLET SHEET PHOTO INPUTS         */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Medicine &amp; Strip Photos</h3>
                  <p className="text-xs text-slate-500">
                    Enter clinical particulars and upload front &amp; back tablet sheet pictures
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Strip */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
              <span className="text-[11px] font-bold text-amber-900 block">
                ⚡ 1-Click Photo Presets (Front &amp; Back Tablet Sheet):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {photoPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddNewMedicine} className="space-y-3.5">
              {/* Name & Generic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Augmentin 625 Duo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Generic Salt *
                  </label>
                  <input
                    type="text"
                    value={newGeneric}
                    onChange={(e) => setNewGeneric(e.target.value)}
                    placeholder="e.g. Amoxicillin + Clavulanate"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Category, Dosage Form, Strength */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Medicine['category'])}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {categories
                      .filter((c) => c !== 'All')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Dosage Form</label>
                  <select
                    value={newDosageForm}
                    onChange={(e) => setNewDosageForm(e.target.value as Medicine['dosageForm'])}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Strength</label>
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="e.g. 625mg"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* Batch, Expiry, Mfg Date */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newBatchNumber}
                    onChange={(e) => setNewBatchNumber(e.target.value)}
                    placeholder="AUG-88410"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    placeholder="28/08/2027"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Mfg Date</label>
                  <input
                    type="text"
                    value={newMfgDate}
                    onChange={(e) => setNewMfgDate(e.target.value)}
                    placeholder="15/09/2024"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">MRP in ₹ INR *</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Initial Stock (Strips)</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
              </div>

              {/* ================================================================= */}
              {/* PHOTO UPLOAD & PREVIEW SECTION (FRONT & BACK TABLET SHEET)        */}
              {/* ================================================================= */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>Medicine Packaging &amp; Tablet Sheet Photos</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Upload file or paste image URL
                  </span>
                </div>

                {/* 1. Front Photo Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    1. Front Photo (Box / Face of Strip)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Front packaging image URL"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <label className="shrink-0 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Back Picture of Tablet Sheet Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    2. Back Picture of Tablet Sheet (Foil / Batch / Composition) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBackImage}
                      onChange={(e) => setNewBackImage(e.target.value)}
                      placeholder="Back of tablet sheet image URL"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <label className="shrink-0 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Side-by-Side Previews */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">
                      Front Packaging Preview
                    </span>
                    <div className="w-full h-24 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs flex items-center justify-center">
                      {newImage ? (
                        <img
                          src={newImage}
                          alt="Front Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">
                      Back Tablet Sheet Preview (Foil)
                    </span>
                    <div className="w-full h-24 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs flex items-center justify-center">
                      {newBackImage ? (
                        <img
                          src={newBackImage}
                          alt="Back Foil Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="req-rx-checkbox"
                  checked={newRequiresRx}
                  onChange={(e) => setNewRequiresRx(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label
                  htmlFor="req-rx-checkbox"
                  className="text-xs font-bold text-slate-800 cursor-pointer"
                >
                  Requires Doctor Prescription (Schedule H / H1 Regulatory Flag)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Medicine SKU &amp; Photos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
