// components/GlobalSchema.jsx
import React from 'react';

export const GlobalSchema = () => {
  const domain = 'https://primecomputernetwork.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Prime Computer Network',
    'url': domain,
    'logo': `${domain}/logo.png`,
    'sameAs': [
      'https://twitter.com/primecomputernetwork',
      'https://facebook.com/primecomputernetwork'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Prime Computer Network',
    'url': domain,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${domain}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
  const localBusiness = {
    "@context": "https://schema.org",
  "@type": "ComputerStore",
  "@id": "https://primecomputernetwork.com/#organization",
  "name": "Prime Computer & Networking",
  "url": "https://primecomputernetwork.com",
  "logo": "https://primecomputernetwork.com/logo.png",
  "image": "https://primecomputernetwork.com/logo.png",
  "description": "Prime Computers & Networking is a local IT service and computer repair shop located in Wakad, Pune, offering hardware fixes, tech support, and network setups.",
  "telephone": "+91-9767665232",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop No 2, Pristine Grandeur, near Naturals Ice Cream, Shankar Kalat Nagar, Wakad",
    "addressLocality": "Pimpri-Chinchwad",
    "addressRegion": "Maharashtra",
    "postalCode": "411057",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 18.5987,
    "longitude": 73.7628
  },
  "sameAs": [
    "https://www.justdial.com/Pune/Prime-Computer-Networking-Near-Subway-Wakad/020PXX20-XX20-180112181512-I2E4_BZDET"
  ]


  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  );
};
