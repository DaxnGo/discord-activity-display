"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface CursorTrailProps {
  color?: string;
  size?: number;
  trailLength?: number;
  interval?: number;
  blur?: boolean;
  fadeOut?: boolean;
  shape?: "circle" | "square" | "triangle";
}

const CursorTrail = ({
  color = "#5865F2", // Discord blue color
  size = 12,
  trailLength = 15,
  interval = 10,
  blur = true,
  fadeOut = true,
  shape = "circle",
}: CursorTrailProps) => {
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobileDevice =
    typeof navigator !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  useEffect(() => {
    if (isMobileDevice) return; // Don't show on mobile devices

    const updateCursorPosition = (e: MouseEvent) => {
      if (timeoutRef.current) return; // Throttle updates

      timeoutRef.current = setTimeout(() => {
        setPositions((prev) => {
          const newPositions = [
            { x: e.clientX, y: e.clientY },
            ...prev.slice(0, trailLength - 1),
          ];
          return newPositions;
        });
        timeoutRef.current = null;
      }, interval);
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [trailLength, interval, isMobileDevice]);

  if (isMobileDevice) return null;

  const getShapeClass = () => {
    switch (shape) {
      case "square":
        return "rounded-none";
      case "triangle":
        return "clip-path-triangle";
      default:
        return "rounded-full";
    }
  };

  return (
    <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-50">
      {positions.map((position, i) => (
        <motion.div
          key={`cursor-${i}`}
          className={`absolute ${getShapeClass()}`}
          style={{
            width: Math.max(5, size - i * (size / trailLength)),
            height: Math.max(5, size - i * (size / trailLength)),
            x: position.x - size / 2,
            y: position.y - size / 2,
            backgroundColor: color,
            opacity: fadeOut ? 1 - i / trailLength : 0.7,
            boxShadow: blur && i < 3 ? `0 0 ${8 - i * 2}px ${color}` : "none",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: fadeOut ? 1 - i / trailLength : 0.7,
            rotate: shape === "triangle" ? i * 30 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;
