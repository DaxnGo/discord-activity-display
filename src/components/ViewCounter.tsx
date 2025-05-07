"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function ViewCounter() {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up for unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Create entrance animation for counter
    if (counterRef.current && !isLoading) {
      gsap.fromTo(
        counterRef.current,
        {
          opacity: 0,
          y: 10,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );

      // Add hover effect
      counterRef.current.addEventListener("mouseenter", () => {
        gsap.to(counterRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          background: "rgba(0, 0, 0, 0.4)",
        });
      });

      counterRef.current.addEventListener("mouseleave", () => {
        gsap.to(counterRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          boxShadow: "none",
          background: "rgba(0, 0, 0, 0.3)",
        });
      });
    }
  }, [isLoading]);

  useEffect(() => {
    // Function to increment view count
    const incrementViewCount = async () => {
      try {
        const response = await fetch("/api/views", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to increment view count");
        }

        const data = await response.json();
        if (isMounted.current) {
          setViewCount(data.count);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
        if (isMounted.current) {
          setIsLoading(false);
          // Fallback to GET if POST fails
          getViewCount();
        }
      }
    };

    // Function to get current view count without incrementing
    const getViewCount = async () => {
      try {
        const response = await fetch("/api/views");
        if (!response.ok) {
          throw new Error("Failed to get view count");
        }
        const data = await response.json();
        if (isMounted.current) {
          setViewCount(data.count);
        }
      } catch (error) {
        console.error("Error getting view count:", error);
        // Set a fallback value
        if (isMounted.current) {
          setViewCount(1);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    // Only increment view count once per session
    const hasIncremented = sessionStorage.getItem("viewIncremented");

    if (!hasIncremented) {
      incrementViewCount();
      sessionStorage.setItem("viewIncremented", "true");
    } else {
      getViewCount();
    }
  }, []);

  // Digit animation for each number in the view count
  const animateDigits = () => {
    if (viewCount === null) return null;

    const digits = viewCount.toString().split("");

    return digits.map((digit, index) => (
      <motion.span
        key={`${index}-${digit}`}
        initial={{ opacity: 0, y: 10, rotateX: 90 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          delay: 0.1 * index,
          duration: 0.5,
          type: "spring",
          stiffness: 120,
        }}
        className="inline-block">
        {digit}
      </motion.span>
    ));
  };

  return (
    <div
      ref={counterRef}
      className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center transition-all duration-300 shadow-lg hover:shadow-xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 mr-1.5 text-white/80"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>

      {isLoading ? (
        <span className="text-xs flex items-center">
          <div className="h-1 w-1 bg-white/70 rounded-full animate-pulse mr-0.5"></div>
          <div className="h-1 w-1 bg-white/70 rounded-full animate-pulse delay-100 mr-0.5"></div>
          <div className="h-1 w-1 bg-white/70 rounded-full animate-pulse delay-200"></div>
        </span>
      ) : (
        <span className="text-xs font-medium flex items-center text-white">
          {animateDigits()} <span className="ml-1 opacity-80">visits</span>
        </span>
      )}
    </div>
  );
}
