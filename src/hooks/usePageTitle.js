import { useEffect } from 'react';
import useIsMobile from './useIsMobile';
export default function usePageTitle(title) {
    // CHECK MOBILE OR DESTOP
//   const isMobile = useIsMobile();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - Prime Computer & Network` : 'ShopHub - Online Shopping Made Easy';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
