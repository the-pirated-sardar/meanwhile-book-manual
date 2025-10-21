import { useEffect, useState } from "react";

/** Desktop if width >= 1024 and orientation is landscape */
export function useDeviceGate() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      const isWide = window.matchMedia("(min-width: 1024px)").matches;
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      setIsDesktop(isWide && isLandscape);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check as any);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check as any);
    };
  }, []);
  return isDesktop; // null means unknown on first render
}
