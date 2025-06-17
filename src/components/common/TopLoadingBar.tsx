'use client';

import LoadingBar from 'react-top-loading-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function TopLoadingBar() {
  const loadingBarRef = useRef<any>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
      setTimeout(() => {
        loadingBarRef.current.complete();
      }, 500);
    }
  }, [pathname, searchParams]);

  return (
    <LoadingBar
      ref={loadingBarRef}
      color="#7C3AED"
      height={3}
      shadow={true}
      className="loading-bar"
    />
  );
} 