"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useAnimation } from "@/context/AnimationContext";
import { useCardAnimation } from "@/hooks/useCardAnimation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load non-critical components
const MusicControls = dynamic(() => import("@/components/MusicControls"), {
  ssr: false,
});
const DiscordActivity = dynamic(() => import("@/components/DiscordActivity"), {
  ssr: false,
});
const VideoBackground = dynamic(() => import("@/components/VideoBackground"), {
  ssr: false,
});
const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false }
);
const ViewCounter = dynamic(() => import("@/components/ViewCounter"), {
  ssr: false,
});

// Initial loading state
const LoadingScreen = ({ onClick }: { onClick: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="loading-overlay fixed inset-0 flex items-center justify-center bg-black/90 z-50 cursor-pointer">
      <div className="glass-card p-8 rounded-xl backdrop-blur-lg bg-white/5 shadow-2xl">
        <h1
          ref={headingRef}
          className="text-5xl font-bold mb-6 text-white text-center">
          click to enter
        </h1>
        <p ref={subTextRef} className="text-xl text-white/70 text-center">
          Curious about me?
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(0.5);
  const [hasEntered, setHasEntered] = useState(false);
  const [age, setAge] = useState(17);
  const [isContentReady, setIsContentReady] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useAnimation();
  const { cardRef } = useCardAnimation({ selector: ".profile-item", delay: 0 });
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Video settings
  const lofiVideoId = "jfKfPfyJRdk"; // YouTube ID as fallback
  const localVideoPath = "/videos/blue-waltz.mp4"; // Path to your actual video file
  const useLocalVideo = true; // Set to true to use local video, false for YouTube

  // Optimize mobile detection
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
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

  // Enhanced entrance animation
  const handleEnterClick = useCallback(() => {
    const overlay = document.querySelector(".loading-overlay");
    const card = document.querySelector(".glass-card");

    if (overlay && card) {
      // Create a simpler exit timeline
      const exitTl = gsap.timeline({
        onComplete: () => {
          setHasEntered(true);
        },
      });

      // Simple fade out animation without scaling up
      exitTl.to(card, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Fade out the overlay with a radial wipe effect
      exitTl.to(
        overlay,
        {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onStart: () => {
            // Create a radial wipe effect
            const wipe = document.createElement("div");
            wipe.style.position = "fixed";
            wipe.style.top = "50%";
            wipe.style.left = "50%";
            wipe.style.transform = "translate(-50%, -50%)";
            wipe.style.width = "10px";
            wipe.style.height = "10px";
            wipe.style.borderRadius = "50%";
            wipe.style.background =
              "radial-gradient(circle, rgba(88, 101, 242, 0.3) 0%, transparent 70%)";
            wipe.style.zIndex = "9998";
            document.body.appendChild(wipe);

            gsap.to(wipe, {
              width: "300vw",
              height: "300vh",
              opacity: 0,
              duration: 1.5,
              ease: "power3.out",
              onComplete: () => {
                document.body.removeChild(wipe);
              },
            });
          },
        },
        "-=0.3"
      );
    } else {
      // Fallback if elements aren't found
      setHasEntered(true);
    }
  }, []);

  const handleVolumeChange = useCallback((muted: boolean) => {
    setIsMuted(muted);
  }, []);

  const handleVolumeLevel = useCallback((level: number) => {
    setVolumeLevel(level);
  }, []);

  // Cursor initialization for both loading screen and main page
  useEffect(() => {
    if (typeof window === "undefined" || isMobileDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;

      // Use requestAnimationFrame for smoother cursor movement
      requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

          // Force visibility
          cursorRef.current.style.opacity = "1";
          cursorRef.current.style.display = "block";
          cursorRef.current.style.visibility = "visible";
        }
      });

      // Check for links/buttons for hover states
      const isOverSocial =
        e.target && (e.target as HTMLElement).closest(".social-link");
      const isOverClickable =
        e.target &&
        ((e.target as HTMLElement).tagName === "A" ||
          (e.target as HTMLElement).closest("a") ||
          (e.target as HTMLElement).closest('[role="button"]'));

      if (cursorRef.current) {
        cursorRef.current.classList.remove("hover", "social-hover");
        if (isOverSocial) {
          cursorRef.current.classList.add("social-hover");
        } else if (isOverClickable) {
          cursorRef.current.classList.add("hover");
        }
      }
    };

    // Initialize cursor position at center of screen
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "1";
      cursorRef.current.style.display = "block";
      cursorRef.current.style.visibility = "visible";
      cursorRef.current.style.transform = `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) translate(-50%, -50%)`;
    }

    // Add event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobileDevice]); // Only depend on isMobileDevice, not hasEntered

  // Add this to your component
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create a style element that will force cursor: none and add custom cursor styles
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .loading-overlay, .loading-overlay *, 
      body * {
        cursor: none !important;
      }
      
      .custom-cursor {
        position: fixed;
        width: 24px;
        height: 24px;
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999999;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, border-color 0.2s;
      }
      
      .custom-cursor.hover {
        width: 60px;
        height: 60px;
        border-color: rgba(255, 255, 255, 0.5);
      }
      
      .custom-cursor.social-hover {
        width: 40px;
        height: 40px;
        border-color: #5865f2;
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

  // Enhanced main page animation setup
  useEffect(() => {
    if (!isLoaded || !hasEntered) return;

    // Create a master timeline for page entrance
    const masterTl = gsap.timeline();

    // Staggered entrance for profile elements
    masterTl.from(".profile-item", {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });

    // Staggered entrance for social links with scale effect
    masterTl.from(
      ".social-link",
      {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.4"
    );

    // More pronounced hover animations for social links
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      const icon = link.querySelector("svg");

      link.addEventListener("mouseenter", () => {
        gsap.to(link, {
          scale: 1.15,
          duration: 0.3,
          ease: "back.out(1.7)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
        });
        if (icon) {
          gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(link, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          boxShadow: "none",
        });
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
    });

    // Title glow effect with improved dynamics
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Profile card hover effect
    const profileCard = document.querySelector(".profile-card");
    if (profileCard) {
      profileCard.addEventListener("mouseenter", () => {
        gsap.to(profileCard, {
          y: -8,
          rotateX: 2,
          boxShadow:
            "0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(88, 101, 242, 0.3)",
          duration: 0.4,
          ease: "power2.out",
        });
      });

      profileCard.addEventListener("mouseleave", () => {
        gsap.to(profileCard, {
          y: 0,
          rotateX: 0,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          duration: 0.7,
          ease: "elastic.out(1, 0.75)",
        });
      });
    }

    return () => {
      // Clean up event listeners
      socialLinks.forEach((link) => {
        link.removeEventListener("mouseenter", () => {});
        link.removeEventListener("mouseleave", () => {});
      });

      if (profileCard) {
        profileCard.removeEventListener("mouseenter", () => {});
        profileCard.removeEventListener("mouseleave", () => {});
      }
    };
  }, [isLoaded, hasEntered]);

  // Force hydration completion detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set a short delay to ensure DOM is fully hydrated before showing content
      setTimeout(() => {
        setIsContentReady(true);

        // Add a class to the body to indicate that content is ready
        document.body.classList.add("content-ready");

        // Directly manipulate DOM elements to ensure visibility
        const socialLinks = document.querySelectorAll(".social-link");
        const nameElement = document.querySelector(".name-gradient");
        const socialContainer = document.querySelector(".social-container");

        if (socialContainer) {
          socialContainer.setAttribute(
            "style",
            "display: flex !important; opacity: 1 !important; visibility: visible !important; z-index: 100; position: relative;"
          );
        }

        if (nameElement) {
          nameElement.setAttribute(
            "style",
            "opacity: 1 !important; visibility: visible !important; display: block !important;"
          );
        }

        socialLinks.forEach((link) => {
          link.setAttribute(
            "style",
            "display: flex !important; opacity: 1 !important; visibility: visible !important;"
          );
        });
      }, 200);
    }
  }, [hasEntered]);

  // When not entered show loading screen
  if (!hasEntered) {
    return (
      <>
        {!isMobileDevice && (
          <div
            ref={cursorRef}
            className="custom-cursor"
            style={{
              opacity: 1,
              visibility: "visible",
              display: "block",
              zIndex: 9999999,
              position: "fixed",
            }}></div>
        )}
        <LoadingScreen onClick={handleEnterClick} />
      </>
    );
  }

  return (
    <>
      {!isMobileDevice && (
        <div
          ref={cursorRef}
          className="custom-cursor"
          style={{
            opacity: 1,
            visibility: "visible",
            display: "block",
            zIndex: 9999999,
            position: "fixed",
          }}></div>
      )}

      <main className="relative min-h-screen w-full flex flex-col items-center justify-center text-white inset-0 overflow-hidden">
        <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
          <VideoBackground
            videoId={lofiVideoId}
            videoSource={localVideoPath}
            isMuted={isMuted}
            volumeLevel={volumeLevel}
            useLocalVideo={useLocalVideo}
          />
        </Suspense>

        <Suspense fallback={null}>
          <ParticleBackground />
        </Suspense>

        {/* Content with enhanced animations */}
        <div
          ref={cardRef}
          className="z-10 px-4 sm:px-5 py-6 sm:py-8 max-w-md w-full perspective-1000">
          <div className="profile-card bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8 transition-all duration-500 profile-item">
            {/* Header Section with Name and Age */}
            <div className="text-center mb-6">
              <motion.h1
                ref={titleRef}
                data-text="Matthew"
                className="text-5xl font-bold profile-item name-gradient text-glow"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  opacity: 1,
                  visibility: "visible",
                  display: "block",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
                  zIndex: 99,
                  position: "relative",
                  marginBottom:
                    "18px" /* Increased space between name and age */,
                }}>
                Matthew
              </motion.h1>
              <motion.p
                className="text-md profile-item"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                }}
                style={{
                  position: "relative",
                  zIndex: 30,
                  paddingBottom: "18px" /* Added space below the age */,
                }}>
                <span className="text-sm gradient-text inline-block">
                  <span className="font-medium">{age}</span> y/o Front-End
                  Developer
                </span>
              </motion.p>
            </div>
            <Suspense
              fallback={
                <div className="h-[200px] animate-pulse bg-white/10 rounded-lg" />
              }>
              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Ensure Discord Activity doesn't block other elements */}
                <div style={{ opacity: 0.99 }}>
                  {isContentReady && <DiscordActivity />}
                </div>
              </div>
            </Suspense>

            {/* Social Links - Ensuring this section is properly defined with improved visibility */}
            <div
              className="flex justify-center space-x-5 mt-6 profile-item opacity-100 social-container"
              style={{
                display: "flex",
                opacity: 1,
                visibility: "visible",
                zIndex: 99,
                position: "relative",
              }}>
              <a
                href="https://www.instagram.com/miws_10/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-pink-500/80 transition-all duration-300 group"
                aria-label="Instagram"
                style={{ display: "flex", visibility: "visible", opacity: 1 }}>
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
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://github.com/DaxnGo/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-purple-500/80 transition-all duration-300 group"
                aria-label="GitHub"
                style={{ display: "flex", visibility: "visible", opacity: 1 }}>
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

        <Suspense fallback={null}>
          <MusicControls
            onVolumeChange={handleVolumeChange}
            onVolumeLevel={handleVolumeLevel}
          />
        </Suspense>

        <Suspense fallback={null}>
          <div className="fixed bottom-6 left-6 z-50 text-white/80 text-xs hover:scale-105 transition-transform duration-300">
            <ViewCounter />
          </div>
        </Suspense>
      </main>
    </>
  );
}
