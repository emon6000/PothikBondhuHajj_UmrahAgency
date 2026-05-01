// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This tells the browser to instantly scroll to the top-left corner
    window.scrollTo(0, 0);
  }, [pathname]); // This runs every time the path (URL) changes

  return null; // It doesn't render any UI
};

export default ScrollToTop;