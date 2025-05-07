"use client";

import { useEffect, useState, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
  size: number;
  alpha: number;
  dx: number;
  dy: number;
  theta: number;
  life: number;
  color: number[];
}

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<TrailDot[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const prevMousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const lastEmitTimeRef = useRef(0);

  // Config for trail effect
  const config = {
    dotCount: 15, // Number of dots to emit per movement
    emitDelay: 10, // Minimum delay between emissions in ms
    dotLifespan: 600, // How long dots live in ms
    dotBaseSize: 12, // Base size of dots
    dotSizeVariance: 4, // Random size variance
    dotBaseSpeed: 1.0, // Base speed of dots
    dotSpeedVariance: 0.5, // Random speed variance
    dotBaseAlpha: 0.6, // Base alpha of dots
    maxDistanceEmit: 5, // Min distance before emitting new dots
    primaryColor: [88, 101, 242], // Discord blue RGB
    secondaryColor: [114, 137, 218], // Lighter blue RGB
    colorVariance: 30, // Color variance
    glowIntensity: 3, // Glow effect intensity
  };

  // Initialize trail system
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if we're on a mobile device
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobileDevice) return;

    const canvas = canvasRef.current;
    if (!canvas || isInitializedRef.current) return;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    // Set up canvas
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Set initial mouse position off-screen
    mousePositionRef.current = { x: -100, y: -100 };
    prevMousePositionRef.current = { x: -100, y: -100 };

    isInitializedRef.current = true;

    // Start animation loop
    startAnimation();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Main animation loop
  const startAnimation = () => {
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas with a fade effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      // Calculate mouse movement
      const mousePos = mousePositionRef.current;
      const prevMousePos = prevMousePositionRef.current;
      const dx = mousePos.x - prevMousePos.x;
      const dy = mousePos.y - prevMousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Emit new dots based on movement threshold and time delay
      const now = Date.now();
      if (
        distance > config.maxDistanceEmit &&
        now - lastEmitTimeRef.current > config.emitDelay
      ) {
        // Direction of movement
        let angle = Math.atan2(dy, dx);

        // Create new dots
        for (let i = 0; i < config.dotCount; i++) {
          // Randomize dot properties
          const theta = angle + (Math.random() * 0.5 - 0.25); // Slight angle variance
          const speedMultiplier =
            config.dotBaseSpeed + Math.random() * config.dotSpeedVariance;
          const size =
            config.dotBaseSize + Math.random() * config.dotSizeVariance;

          // Choose between primary and secondary colors with variance
          const baseColor =
            Math.random() > 0.7 ? config.secondaryColor : config.primaryColor;
          const r =
            baseColor[0] +
            (Math.random() * config.colorVariance - config.colorVariance / 2);
          const g =
            baseColor[1] +
            (Math.random() * config.colorVariance - config.colorVariance / 2);
          const b =
            baseColor[2] +
            (Math.random() * config.colorVariance - config.colorVariance / 2);

          // Create new dot
          dotsRef.current.push({
            x: mousePos.x,
            y: mousePos.y,
            size: size,
            alpha: config.dotBaseAlpha,
            dx: Math.cos(theta) * speedMultiplier,
            dy: Math.sin(theta) * speedMultiplier,
            theta: theta,
            life: config.dotLifespan + Math.random() * 300, // Randomize lifespan
            color: [r, g, b],
          });
        }

        lastEmitTimeRef.current = now;
        prevMousePositionRef.current = { ...mousePos };
      }

      // Update and render dots
      const aliveDots: TrailDot[] = [];

      dotsRef.current.forEach((dot) => {
        // Update dot
        dot.life -= 16.67; // Approx milliseconds per frame at 60fps

        if (dot.life > 0) {
          // Update position
          dot.x += dot.dx;
          dot.y += dot.dy;

          // Calculate alpha based on remaining life
          dot.alpha = (dot.life / config.dotLifespan) * config.dotBaseAlpha;

          // Draw dot
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);

          // Glow effect
          const gradient = ctx.createRadialGradient(
            dot.x,
            dot.y,
            0,
            dot.x,
            dot.y,
            dot.size * 1.5
          );

          gradient.addColorStop(
            0,
            `rgba(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]}, ${dot.alpha})`
          );
          gradient.addColorStop(
            1,
            `rgba(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]}, 0)`
          );

          ctx.fillStyle = gradient;
          ctx.fill();

          // Draw inner glow for stronger effect
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]}, ${dot.alpha * 1.5})`;
          ctx.fill();

          aliveDots.push(dot);
        }
      });

      // Update dots reference with only living dots
      dotsRef.current = aliveDots;

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        width: "100vw",
        height: "100vh",
        touchAction: "none",
      }}
    />
  );
};

export default CursorTrail;
