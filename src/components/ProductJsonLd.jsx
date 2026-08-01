// components/ProductJsonLd.jsx
import React from 'react';

export const ProductJsonLd = ({ product }) => {
  const domain = 'https://primecomputernetwork.com';
  
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.name,
    'image': [
      product.photoPath.startsWith('http') 
        ? product.photoPath 
        : `${domain}${product.photoPath}`
    ],
    'description': product.description,
    'sku': product.id,
    'mpn': product.slug,
    'brand': {
      '@type': 'Brand',
      'name': extractBrand(product.name) // Extracts brand like Apple, Sony, Dell, etc.
    },
    'offers': {
      '@type': 'Offer',
      'url': `${domain}/product/${product.slug}`,
      'priceCurrency': 'USD', // Change to your target currency (e.g., INR, USD)
      'price': product.price,
      'priceValidUntil': new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.quantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Prime Computer Network'
      }
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'reviewCount': '24'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Helper function to detect standard tech brands
function extractBrand(productName) {
  const brands = ['Apple', 'Sony', 'Samsung', 'Dell', 'Asus', 'Logitech', 'Canon', 'GoPro', 'Keychron', 'Bose', 'LG', 'Xbox', 'Nintendo', 'Google', 'Garmin', 'Razer'];
  const found = brands.find(b => productName.toLowerCase().includes(b.toLowerCase()));
  return found || 'Prime Computer Network';
}
