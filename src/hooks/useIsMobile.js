import { useState, useEffect } from 'react';
//  window !==undefined  && window.innerWidth ? window.innerWidth <= breakpoint :   false
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(bk => { if (window) { bk = window.innerWidth <= breakpoint;
                 return bk;
  } else { return false } });

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= breakpoint);
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // run once on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;