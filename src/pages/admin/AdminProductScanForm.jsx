import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Barcode, RefreshCw, Sparkles, X, ArrowDown, 
  Package2, Layers, CheckCircle2, ShieldCheck
} from 'lucide-react';

import { PageContainer, PageHeader } from '../../components/ui/PageContainer';
import AdminMenu from '../../components/nav/AdminMenu';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminProductScanForm = ({ product, onFetchMaster, loadingProduct }) => {
  // Master Barcode & Serial States
  const [masterBarcode, setMasterBarcode] = useState('');
  const [serials, setSerials] = useState([]);
  const [scanMode, setScanMode] = useState('master'); // 'master' | 'serials'
  const [manualInput, setManualInput] = useState('');

  // Form Payload States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [shipping, setShipping] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const barcodeInputRef = useRef(null);
  const bufferRef = useRef('');
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Keep input focused so hardware scanner never drops key presses
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Fetch category list
  useEffect(() => {
    let isMounted = true;
    axios.get('/categories')
      .then(({ data }) => {
        if (isMounted) setCategories(data || []);
      })
      .catch((err) => console.error('Failed to load categories', err));
    return () => { isMounted = false; };
  }, []);

  // Sync loaded product into form & switch mode
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price ? String(product.price) : '');
      setScanMode('serials');
      toast.success('Master details loaded! Ready for child serial scans.');
    }
  }, [product]);

  // Global Keydown Hardware Scanner Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');

      // Ignore normal manual typing into non-barcode fields
      if (isInputFocused && activeElement.dataset.barcodeTarget !== 'true') {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const code = bufferRef.current.trim();
        if (code.length > 2) {
          processScannedCode(code);
        }
        bufferRef.current = '';
      } else if (e.key.length === 1) {
        bufferRef.current += e.key;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          bufferRef.current = '';
        }, 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [scanMode]);

  const processScannedCode = (code) => {
    if (scanMode === 'master') {
      setMasterBarcode(code);
      if (onFetchMaster) onFetchMaster(code);
    } else {
      addSerial(code);
    }
  };

  const addSerial = (code) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setSerials((prev) => {
      if (prev.includes(trimmed)) {
        toast.error(`Serial "${trimmed}" already added!`);
        return prev;
      }
      toast.success(`Tagged Child Serial: ${trimmed}`);
      return [...prev, trimmed];
    });
  };

  const removeSerial = (indexToRemove) => {
    setSerials((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast('Serial removed', { icon: '🗑️' });
  };

  const handleManualKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (manualInput.trim()) {
        processScannedCode(manualInput.trim());
        setManualInput('');
      }
    }
  };

  const handleResetAll = () => {
    setMasterBarcode('');
    setSerials([]);
    setScanMode('master');
    setName('');
    setPrice('');
    setManualInput('');
    toast('Scanner reset to Master mode', { icon: '🔄' });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!photo) return toast.error('Please upload a product image.');
    if (!name.trim()) return toast.error('Please enter a product name.');
    if (!price) return toast.error('Please enter a valid price.');
    if (!category) return toast.error('Please select a category.');
    if (serials.length === 0) return toast.error('Scan at least 1 child serial barcode.');

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('shipping', shipping);
      formData.append('quantity', serials.length);
      formData.append('masterBarcode', masterBarcode);
      formData.append('serials', JSON.stringify(serials));

      const { data } = await axios.post('/product/create', formData);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`Product saved with ${serials.length} child serial numbers!`);
        navigate('/dashboard/admin/products');
      }
    } catch (err) {
      toast.error('Product creation failed. Check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="p-4 sm:p-6 lg:p-8">
      <PageHeader title="QuickScan POS Portal" subtitle="Hardware Barcode Tagging System" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-1">
          <AdminMenu />
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* HARDWARE SCAN CONTROL CARD */}
          <Card className="border-cyan-800 bg-slate-900 text-slate-100 shadow-2xl">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-cyan-950 rounded-xl text-cyan-400 border border-cyan-800">
                    <Barcode className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Fingers W5 Scan Mode Control</CardTitle>
                    <p className="text-xs text-cyan-400">
                      {masterBarcode ? `Master Barcode: ${masterBarcode}` : 'No Master Barcode Scanned'}
                    </p>
                  </div>
                </div>

                <Button onClick={handleResetAll} variant="outline" className="text-xs border-slate-700 text-slate-300">
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset All
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* SCAN MODE TOGGLE UI */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Active Scanner Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScanMode('master')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs transition-all ${
                      scanMode === 'master'
                        ? 'bg-cyan-600 text-white shadow-lg border border-cyan-400'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Package2 className="w-4 h-4" />
                    1. Scan Master Barcode
                  </button>

                  <button
                    type="button"
                    onClick={() => setScanMode('serials')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs transition-all ${
                      scanMode === 'serials'
                        ? 'bg-emerald-600 text-white shadow-lg border border-emerald-400'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    2. Scan Child Serial Numbers
                  </button>
                </div>

                {/* VISIBLE MASTER BARCODE DISPLAY BADGE */}
                {masterBarcode ? (
                  <div className="mt-3 p-3 bg-cyan-950/80 border border-cyan-500 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-cyan-300">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs font-semibold uppercase">Master Product SKU:</span>
                      <span className="font-mono text-sm font-bold text-white tracking-wider">{masterBarcode}</span>
                    </div>
                    <span className="text-[10px] bg-cyan-800 text-cyan-200 px-2 py-0.5 rounded font-medium">LOCKED</span>
                  </div>
                ) : (
                  <div className="mt-3 p-2.5 bg-slate-900 border border-dashed border-slate-700 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Scan Master Barcode first to link child serial numbers.</p>
                  </div>
                )}
              </div>

              {/* ACTIVE HARDWARE INPUT BUFFER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Hardware Scanner Buffer Target Input
                  </label>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${scanMode === 'master' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                    Target: {scanMode === 'master' ? 'MASTER SKU' : 'CHILD SERIAL'}
                  </span>
                </div>
                
                <input
                  ref={barcodeInputRef}
                  data-barcode-target="true"
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={handleManualKeyDown}
                  placeholder={
                    loadingProduct 
                      ? 'Fetching product details...' 
                      : scanMode === 'master' 
                        ? 'Point Fingers W5 & Scan Product Master Barcode...' 
                        : 'Point Fingers W5 & Scan Item Serial Barcode...'
                  }
                  className="w-full bg-slate-950 border-2 border-cyan-500 rounded-xl py-3 px-4 text-sm font-mono text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* TAGGED CHILD SERIALS DISPLAY LIST */}
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Tagged Child Serial Barcodes ({serials.length}):
                  </span>
                </div>

                {serials.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-1">No child serial numbers tagged to this master barcode yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                    {serials.map((serial, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 font-mono text-emerald-300 bg-emerald-950 border border-emerald-700 px-2.5 py-1 rounded-lg text-xs"
                      >
                        <Barcode className="w-3 h-3 text-emerald-400" />
                        {serial}
                        <button type="button" onClick={() => removeSerial(idx)} className="text-slate-400 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CREATE PRODUCT FORM */}
          <Card id="create-product-section" className="shadow-xl">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="flex items-center gap-2">
                <Package2 className="w-5 h-5 text-indigo-500" />
                Product Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setPhoto(e.target.files[0])}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Product Name *" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="Price (INR) *" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      className="w-full rounded-md border p-2 text-sm dark:bg-gray-800"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Choose category</option>
                      {categories.map((c) => (
                        <option key={c._id || c.id} value={c._id || c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input label="Tagged Stock Quantity" type="number" readOnly value={serials.length} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    rows={3}
                    className="w-full p-2 border rounded-md text-sm dark:bg-gray-800"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button type="submit" loading={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl">
                  Save Product & Bind {serials.length} Serials
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminProductScanForm;