"use client";

import { useState, useEffect, useRef } from "react";
import MusicControls from "@/components/MusicControls";
import DiscordActivity from "@/components/DiscordActivity";
import VideoBackground from "@/components/VideoBackground";
import ParticleBackground from "@/components/ParticleBackground";
import { useAnimation } from "@/context/AnimationContext";
import { useCardAnimation } from "@/hooks/useCardAnimation";
import gsap from "gsap";
import ViewCounter from "@/components/ViewCounter";
import { motion } from "framer-motion";

export default function Home() {
  // Add a state to detect if the device is mobile/touch
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Existing state variables
  const [isMuted, setIsMuted] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(0.5);
  const [hasEntered, setHasEntered] = useState(false);
  const [age, setAge] = useState(17);
  const cursorRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useAnimation();
  const { cardRef } = useCardAnimation({ selector: ".profile-item", delay: 0 });
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Video settings
  const lofiVideoId = "jfKfPfyJRdk"; // YouTube ID as fallback
  const localVideoPath = "/videos/蒼のワルツ - Eve MV (3).mp4"; // Path to your actual video file
  const useLocalVideo = true; // Set to true to use local video, false for YouTube

  // Detect mobile/touch device on mount
  useEffect(() => {
    // Check if device is touch-based
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    // Check if device has coarse pointer (typical for mobile)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const hasCoarsePointer = mediaQuery.matches;

    // Set state based on detection
    setIsMobileDevice(isTouchDevice || hasCoarsePointer);
  }, []);

  // Calculate age function
  const calculateAge = () => {
    const today = new Date();
    const birthYear = 2007; // Born in 2007
    const birthMonth = 10; // November (0-indexed in JS Date, so 10 = November)
    const birthDay = 10;

    // Get current age based on birth year
    let calculatedAge = today.getFullYear() - birthYear;

    // If this year's birthday hasn't occurred yet, subtract one year
    if (
      today.getMonth() < birthMonth ||
      (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
      calculatedAge--;
    }

    // Force age to be 17 until November 10, 2025
    const is2025BirthdayPassed =
      today.getFullYear() >= 2025 &&
      (today.getMonth() > birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() >= birthDay));

    // You're 17 in 2024, and will turn 18 on Nov 10, 2025
    if (!is2025BirthdayPassed) {
      return 17;
    }

    return calculatedAge;
  };

  // Update age on component mount and when date changes
  useEffect(() => {
    // Set initial age
    setAge(calculateAge());

    // Check for date changes (runs at midnight)
    const checkDate = () => {
      setAge(calculateAge());
    };

    // Set up interval to check date daily
    const interval = setInterval(checkDate, 86400000); // 24 hours

    // Also check when window gains focus in case computer was asleep on birthday
    window.addEventListener("focus", checkDate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkDate);
    };
  }, []);

  // Animate the loading page text - smoother animation
  useEffect(() => {
    if (!hasEntered && loaderTextRef.current) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(loaderTextRef.current, {
        opacity: 1,
        duration: 2,
        ease: "sine.inOut",
      }).to(loaderTextRef.current, {
        opacity: 0.5,
        duration: 2,
        ease: "sine.inOut",
      });
    }
  }, [hasEntered]);

  const handleVolumeChange = (muted: boolean) => {
    setIsMuted(muted);
  };

  const handleVolumeLevel = (level: number) => {
    setVolumeLevel(level);
  };

  const handleEnterClick = () => {
    // Immediately set hasEntered to true to ensure the transition works
    setHasEntered(true);

    // The rest of the animations will still work, but we prioritize the state change
    if (loaderTextRef.current) {
      // Animations can continue, but the state is already changed
      gsap.to(loaderTextRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(".loading-overlay", {
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    }
  };

  // A more robust version of the cursor implementation
  useEffect(() => {
    if (!cursorRef.current || isMobileDevice) return;

    // Add the cursor-none class to the body to help with CSS overrides
    document.body.classList.add("using-custom-cursor");

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Direct DOM manipulation for best performance
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

        // Always show cursor
        cursorRef.current.style.opacity = "1";

        // Prevent hover effect on loading page
        if (!hasEntered) {
          // Force remove hover class on loading page
          cursorRef.current.classList.remove("hover");
          cursorRef.current.classList.remove("social-hover");

          // Find and force remove any pointer cursors
          const clickableElements = document.querySelectorAll(
            'a, button, [role="button"], .loading-overlay, .loading-overlay *'
          );
          clickableElements.forEach((el) => {
            (el as HTMLElement).style.cursor = "none";
          });
        } else {
          // Regular cursor behavior for main page
          const isOverSocial =
            e.target &&
            (e.target as HTMLElement).closest(".social-link") !== null;

          const isOverClickable =
            e.target &&
            ((e.target as HTMLElement).tagName === "A" ||
              (e.target as HTMLElement).closest("a") ||
              (e.target as HTMLElement).closest('[role="button"]'));

          cursorRef.current.classList.remove("hover", "social-hover");

          if (isOverSocial) {
            cursorRef.current.classList.add("social-hover");
          } else if (isOverClickable) {
            cursorRef.current.classList.add("hover");
          }
        }
      }
    };

    // Add event listener
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Set initial state
    if (!hasEntered) {
      // Initial setup for loading page - force cursor none on all clickable elements
      const clickableElements = document.querySelectorAll(
        'a, button, [role="button"], .loading-overlay, .loading-overlay *'
      );
      clickableElements.forEach((el) => {
        (el as HTMLElement).style.cursor = "none";
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove("using-custom-cursor");
    };
  }, [hasEntered, isMobileDevice]);

  // Apply hover animations directly
  useEffect(() => {
    if (!isLoaded || !hasEntered) return;

    const elements = document.querySelectorAll(".social-link");

    const enterListeners = new Map();
    const leaveListeners = new Map();

    elements.forEach((el) => {
      const enterListener = () => {
        gsap.to(el, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      };

      const leaveListener = () => {
        gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
      };

      enterListeners.set(el, enterListener);
      leaveListeners.set(el, leaveListener);

      el.addEventListener("mouseenter", enterListener);
      el.addEventListener("mouseleave", leaveListener);
    });

    // Title glow effect
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        textShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", enterListeners.get(el));
        el.removeEventListener("mouseleave", leaveListeners.get(el));
      });
    };
  }, [isLoaded, hasEntered]);

  // Add this near the beginning of your Home component
  useEffect(() => {
    // Ensure cursor is visible immediately on page load
    if (cursorRef.current && !isMobileDevice) {
      cursorRef.current.style.opacity = "1";
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Add this useEffect right before the return statement
  useEffect(() => {
    // Only run on client side and when not entered yet
    if (typeof window === "undefined" || hasEntered) return;

    // Helper function to remove hand cursors
    const removeHandCursors = () => {
      // Target all elements that might have a hand cursor
      const elements = document.querySelectorAll(
        '.loading-overlay, .loading-overlay *, [role="button"]'
      );
      elements.forEach((el) => {
        (el as HTMLElement).style.cursor = "none";
      });
    };

    // Run immediately
    removeHandCursors();

    // Also run on a small delay to catch any updates
    const timerId = setTimeout(removeHandCursors, 100);

    // Clean up
    return () => clearTimeout(timerId);
  }, [hasEntered]);

  // Add this to your component
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create a style element that will force cursor: none
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .loading-overlay, .loading-overlay *, body:not(.has-entered) * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    // When user enters, add class to body
    if (hasEntered) {
      document.body.classList.add("has-entered");
    } else {
      document.body.classList.remove("has-entered");
    }

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [hasEntered]);

  return (
    <>
      {/* Only render the custom cursor for non-mobile devices */}
      {!isMobileDevice && <div ref={cursorRef} className="custom-cursor"></div>}

      {!hasEntered ? (
        // Loading page with improved transitions - use inline styles to ensure cursor: none
        <div
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-black to-gray-900 z-50 loading-overlay"
          onClick={handleEnterClick}
          onKeyDown={(e) => e.key === "Enter" && handleEnterClick()}
          role="button"
          tabIndex={0}>
          <div className="relative text-center px-4 transition-all duration-500">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-white opacity-5 blur-3xl rounded-full"></div>

            {/* Text with ref for animation */}
            <div ref={loaderTextRef} className="relative">
              <h1 className="text-white text-4xl md:text-5xl font-bold mb-2 tracking-wide">
                click to enter...
              </h1>

              {/* Subtle hint text */}
              <p className="text-white/40 text-sm mt-4">
                portfolio & personal space
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Main application - update this className
        <main className="relative min-h-screen w-full flex flex-col items-center justify-center text-white inset-0 overflow-hidden">
          {/* Video Background with volume control */}
          <VideoBackground
            videoId={lofiVideoId}
            videoSource={localVideoPath}
            // Only include lowQualitySource when you have the file
            // lowQualitySource="/videos/video-low.mp4"
            isMuted={isMuted}
            volumeLevel={volumeLevel}
            useLocalVideo={useLocalVideo}
          />

          {/* Interactive Particle Effect */}
          <ParticleBackground />

          {/* Content */}
          <div
            ref={cardRef}
            className="z-10 px-4 sm:px-5 py-6 sm:py-8 max-w-md w-full perspective-1000">
            <div className="profile-card bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8 transition-all duration-500 profile-item">
              <div className="mb-4 sm:mb-6 text-center">
                <motion.h1
                  ref={titleRef}
                  data-text="Matthew"
                  className="text-5xl font-bold mb-2 profile-item name-gradient text-glow"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}>
                  Matthew
                </motion.h1>
                <motion.p
                  className="text-md profile-item"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.8,
                  }}>
                  <span className="text-sm gradient-text inline-block">
                    {age} y/o Front-End Developer
                  </span>
                </motion.p>
              </div>
              {/* Discord Activity */}
              <DiscordActivity />

              {/* Social Links */}
              <div className="flex justify-center space-x-5 mt-6 profile-item">
                <a
                  href="https://www.instagram.com/miws_10/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-pink-500/80 transition-all duration-300 group"
                  aria-label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:scale-110 transition-transform">
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://github.com/DaxnGo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-purple-500/80 transition-all duration-300 group"
                  aria-label="GitHub">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:scale-110 transition-transform">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a
                  href="https://x.com/hellopassingby/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-blue-500/80 transition-all duration-300 group"
                  aria-label="Twitter">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:scale-110 transition-transform">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/matthew-pangemanan-581bb2312/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-blue-700/80 transition-all duration-300 group"
                  aria-label="LinkedIn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:scale-110 transition-transform">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Music Controls with volume slider - moved outside other container */}
          <MusicControls
            onVolumeChange={handleVolumeChange}
            onVolumeLevel={handleVolumeLevel}
          />

          {/* View Counter */}
          <div className="absolute bottom-4 left-4 z-20 text-white/50 text-xs">
            <ViewCounter />
          </div>
        </main>
      )}
    </>
  );
}
