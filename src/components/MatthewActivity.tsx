"use client";

import { useState, useEffect, useRef } from "react";
import { useCardAnimation } from "@/hooks/useCardAnimation";
import gsap from "gsap";
import { motion } from "framer-motion";

export default function MatthewActivity() {
  const [currentElapsed, setCurrentElapsed] = useState(0);
  const statusDotRef = useRef<HTMLDivElement>(null);
  const scrollingTextRef = useRef<HTMLDivElement>(null);
  const { cardRef } = useCardAnimation({
    selector: ".animate-item",
    delay: 0.2,
  });

  // Update elapsed time counter
  useEffect(() => {
    setCurrentElapsed(0);

    const timer = setInterval(() => {
      setCurrentElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Status dot animation
  useEffect(() => {
    if (statusDotRef.current) {
      gsap.to(statusDotRef.current, {
        scale: 1.2,
        opacity: 0.7,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Scrolling text animation
    if (scrollingTextRef.current) {
      gsap.to(scrollingTextRef.current, {
        x: "-100%",
        duration: 15,
        repeat: -1,
        ease: "linear",
        repeatDelay: 0,
      });
    }
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Skills array
  const skills = [
    "JavaScript",
    "React",
    "Next.js",
    "TailwindCSS",
    "HTML5",
    "CSS3",
    "TypeScript",
    "Node.js",
    "Git",
  ];

  return (
    <div
      ref={cardRef}
      className="bg-gradient-to-br from-[#2b2d31] to-[#1e1f22] rounded-xl p-5 text-left w-full shadow-xl border border-white/5 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-5 animate-item">
        <div className="relative w-14 h-14 mr-4">
          <div className="w-14 h-14 rounded-full bg-gray-800 overflow-hidden ring-2 ring-white/10 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <div
            ref={statusDotRef}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1e1f22] shadow-glow"></div>
        </div>
        <div>
          <div className="font-bold text-lg">Matthew</div>
          <div className="text-sm opacity-80 capitalize flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Online
          </div>
        </div>
      </div>

      {/* Skills Activity */}
      <div className="bg-gradient-to-r from-[#5865F2]/20 to-[#313338]/20 backdrop-blur-md rounded-lg p-4 text-sm transform transition-all duration-300 hover:scale-[1.02] shadow-md animate-item">
        <div className="text-xs font-medium text-[#5865F2] mb-2 uppercase tracking-wider">
          FRONT-END DEVELOPER
        </div>

        {/* Running text animation */}
        <div className="overflow-hidden whitespace-nowrap my-2">
          <div
            className="flex space-x-4"
            ref={scrollingTextRef}
            style={{ width: "200%" }}>
            {[...skills, ...skills].map((skill, index) => (
              <motion.div
                key={index}
                className="px-2 py-1 bg-white/10 rounded-md text-white">
                {skill}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center mt-3">
          <div className="w-12 h-12 bg-gray-800 rounded-lg mr-4 flex items-center justify-center overflow-hidden shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white truncate">
              Coding Portfolio
            </div>
            <div className="text-xs text-gray-300 truncate">
              Building awesome websites
            </div>
            <div className="text-xs text-[#b9bbbe] mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTime(currentElapsed)} online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
