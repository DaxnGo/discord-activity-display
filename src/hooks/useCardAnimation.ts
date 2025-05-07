"use client";

import { useRef, useEffect } from "react";
import { useAnimation } from "@/context/AnimationContext";
import gsap from "gsap";

interface UseCardAnimationProps {
  selector: string;
  delay?: number;
}

export const useCardAnimation = ({
  selector,
  delay = 0,
}: UseCardAnimationProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useAnimation();
  // Add reference to track if animation has already played
  const animationPlayedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !cardRef.current) return;

    // Skip animation if it's already been played
    if (animationPlayedRef.current) return;

    // Check if this component has already been animated
    if (cardRef.current.getAttribute("data-animated") === "true") {
      animationPlayedRef.current = true;
      return;
    }

    const tl = gsap.timeline();

    // Initial state
    gsap.set(cardRef.current, { opacity: 0, y: 20 });

    // Main card animation
    tl.to(cardRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: delay,
      onComplete: () => {
        // Mark that animation has played
        animationPlayedRef.current = true;
        // Set attribute on DOM element as a backup
        if (cardRef.current) {
          cardRef.current.setAttribute("data-animated", "true");
        }
      },
    });

    // Inner elements animation
    const elements = cardRef.current.querySelectorAll(selector);
    gsap.fromTo(
      elements,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        delay: delay + 0.3,
      }
    );

    return () => {
      tl.kill();
    };
  }, [isLoaded, selector, delay]);

  return { cardRef };
};
