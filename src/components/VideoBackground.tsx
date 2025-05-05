"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  videoId: string;
  videoSource: string;
  isMuted: boolean;
  volumeLevel: number;
  useLocalVideo: boolean;
}

export default function VideoBackground({
  videoId,
  videoSource,
  isMuted,
  volumeLevel,
  useLocalVideo,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Optimize video loading
    video.preload = "metadata";
    video.playsInline = true;

    const handleCanPlay = () => {
      setIsLoaded(true);
      if (video.paused) {
        video.play().catch(() => {
          // Handle autoplay restrictions
          console.log("Autoplay prevented");
        });
      }
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volumeLevel;
    videoRef.current.muted = isMuted;
  }, [volumeLevel, isMuted]);

  return (
    <>
      <div className="fixed inset-0 bg-black -z-10" />{" "}
      {/* Immediate background */}
      <div
        className={`fixed inset-0 -z-10 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover scale-[1.1]"
          loop
          muted={isMuted}
          playsInline
          poster="/images/poster.jpg" // Add a lightweight poster image
        >
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>
    </>
  );
}
