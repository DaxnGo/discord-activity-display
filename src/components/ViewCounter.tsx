"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ViewCounter() {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setViewCount(data.count);
        setIsLoading(false);
      } catch (error) {
        console.error("Error incrementing view count:", error);
        setIsLoading(false);
        // Fallback to GET if POST fails
        getViewCount();
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
        setViewCount(data.count);
      } catch (error) {
        console.error("Error getting view count:", error);
        // Set a fallback value
        setViewCount(1);
      } finally {
        setIsLoading(false);
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1 * index,
          duration: 0.3,
          type: "spring",
          stiffness: 120,
        }}
        className="inline-block">
        {digit}
      </motion.span>
    ));
  };

  return (
    <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 mr-1.5"
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
          <div className="h-1 w-1 bg-white/50 rounded-full animate-pulse mr-0.5"></div>
          <div className="h-1 w-1 bg-white/50 rounded-full animate-pulse delay-100 mr-0.5"></div>
          <div className="h-1 w-1 bg-white/50 rounded-full animate-pulse delay-200"></div>
        </span>
      ) : (
        <span className="text-xs font-medium flex items-center">
          {animateDigits()} visits
        </span>
      )}
    </div>
  );
}
