"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

type AnimationContextType = {
  lenis: Lenis | null;
  gsapInstance: typeof gsap;
  isLoaded: boolean;
};

const AnimationContext = createContext<AnimationContextType>({
  lenis: null,
  gsapInstance: gsap,
  isLoaded: false,
});

export const useAnimation = () => useContext(AnimationContext);

export const AnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // Initialize Lenis for smooth scrolling
      const lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      setLenis(lenisInstance);

      // Animation frame loop
      let rafId: number;
      const raf = (time: number) => {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);

      // Set up GSAP defaults
      gsap.config({
        autoSleep: 60,
        force3D: true,
        nullTargetWarn: false,
      });

      // Page load animation sequence
      const tl = gsap.timeline({
        onComplete: () => setIsLoaded(true),
      });

      tl.to(".page-loader", {
        opacity: 0,
        duration: 0.5,
        pointerEvents: "none",
        delay: 0.5,
      });

      // Cleanup
      return () => {
        if (lenisInstance) {
          lenisInstance.destroy();
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    } catch (error) {
      console.error("Failed to initialize animations:", error);
      // Still set isLoaded to true even if animations fail
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Skip cursor setup for mobile devices
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const hasCoarsePointer = mediaQuery.matches;

    // If it's a mobile device, don't set up cursor effects
    if (isTouchDevice || hasCoarsePointer) return;

    // Your existing cursor setup code...
  }, []);

  return (
    <AnimationContext.Provider value={{ lenis, gsapInstance: gsap, isLoaded }}>
      <div className="page-loader fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="loader-content">
          <div className="animate-pulse text-2xl font-bold text-white">
            Loading...
          </div>
        </div>
      </div>
      {children}
    </AnimationContext.Provider>
  );
};
