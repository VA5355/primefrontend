import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - Prime Computer & Network` : 'ShopHub - Online Shopping Made Easy';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
