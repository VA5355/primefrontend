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
    </>
  );
};
