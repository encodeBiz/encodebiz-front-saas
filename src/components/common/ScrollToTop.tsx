// components/ScrollToTop.js
'use client' 
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
 

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };
    if(pathname) handleRouteChange()
  }, [pathname]);

  return null;
};

export default ScrollToTop;