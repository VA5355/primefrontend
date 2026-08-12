import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Barcode, Package, Tag, IndianRupee, Hash, Truck, Info } from 'lucide-react';
import { PageContainer, PageHeader } from '../components/ui/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';

const SearchProductScan = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Physical Barcode Listener (auto-detects hardware barcode scanner)
  useEffect(() => {
    let buffer = '';
    let timeout = null;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (buffer.length > 2) {
          handleLookup(buffer);
        }
        buffer = '';
      } else if (e.key.length === 1) {
        buffer += e.key;
        clearTimeout(timeout);
        timeout = setTimeout(() => { buffer = ''; }, 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLookup = async (codeToQuery) => {
    const query = codeToQuery || searchInput;
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');
      setScannedCode(query);

      // Endpoint searches both Master Barcodes and Serial Number Barcodes
      const { data } = await axios.get(`/product/scan-lookup/${encodeURIComponent(query)}`);
      
      if (data) {
        setProductData(data);
      } else {
        setError('No matching product found for scanned barcode.');
        setProductData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Product lookup failed.');
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="p-4 sm:p-6 lg:p-8">
      <PageHeader 
        title="Store Floor Scan" 
        subtitle="Read-only barcode & serial number lookup for store personnel" 
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hardware & Manual Search Bar */}
        <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Barcode className="w-5 h-5 text-cyan-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Scan Product/SN Barcode or enter manually..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                onClick={() => handleLookup()}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Searching...' : 'Lookup'}</span>
              </button>
            </div>
            {scannedCode && (
              <p className="mt-3 text-xs text-cyan-400 font-mono">
                Active Scanned Value: {scannedCode}
              </p>
            )}
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        {/* Read-Only Product Display Form */}
        {productData && (
          <Card className="shadow-2xl border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="w-5 h-5 text-indigo-500" />
                Scanned Product Information (Read-Only)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Product Image Display */}
              {productData.photoUrl && (
                <div className="flex justify-center">
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                    <img 
                      src={productData.photoUrl} 
                      alt={productData.name} 
                      className="w-48 h-48 object-cover" 
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Product Name"
                    value={productData.name || ''}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-80"
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Price (INR)"
                    value={productData.price ? `₹${productData.price}` : '₹0.00'}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-80 pl-8"
                  />
                  <IndianRupee className="absolute left-3 top-9 h-4 w-4 text-gray-500" />
                </div>

                <div>
                  <Input
                    label="Category"
                    value={productData.category?.name || 'Uncategorized'}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-80"
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Available Quantity (Stock)"
                    value={productData.quantity ?? 0}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-80 pl-8"
                  />
                  <Hash className="absolute left-3 top-9 h-4 w-4 text-gray-500" />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Shipping Status"
                    value={productData.shipping ? 'Shipping Allowed' : 'No Shipping (In-Store Only)'}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Description
                </label>
                <textarea
                  value={productData.description || 'No description provided.'}
                  disabled
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-not-allowed opacity-80 resize-none text-sm"
                />
              </div>

            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default SearchProductScan;