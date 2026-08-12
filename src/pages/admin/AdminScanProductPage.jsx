import React, { useState } from 'react';
import axios from 'axios';
import AdminProductScanForm from './AdminProductScanForm';

const AdminScanProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch product metadata based on Master Barcode
  const fetchProductByMasterBarcode = async (code) => {
    setLoading(true);
    try {
      // API call simulation (replace with actual endpoint if needed)
      await new Promise((res) => setTimeout(res, 200));

      if (code === '8906112170698') {
        setProduct({
          name: 'FINGERS QuickScan W5 Barcode Reader',
          category: 'Computer Peripherals',
          price: '1845'
        });
      } else {
        setProduct({
          name: `Sample Master Item (${code})`,
          category: 'General Goods',
          price: '499'
        });
      }
    } catch (err) {
      console.error('Failed to fetch product metadata:', err);
      setProduct({ name: `Item (${code})`, category: '', price: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminProductScanForm
      product={product}
      onFetchMaster={fetchProductByMasterBarcode}
      loadingProduct={loading}
    />
  );
};

export default AdminScanProductPage;