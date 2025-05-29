import { useLayoutEffect, useState } from 'react';

export function isMobileWidth(): boolean | (() => boolean) {
  return typeof window === 'undefined' ? false : !window.matchMedia('(min-width: 768px)').matches;
}

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(isMobileWidth());

  const handleSize = () => {
    setIsMobile(isMobileWidth());
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', handleSize);

    return () => window.removeEventListener('resize', handleSize);
  }, []);

  return isMobile;
};
