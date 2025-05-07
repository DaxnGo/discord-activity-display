"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  const [isVisible, setIsVisible] = useState(false);

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    if (videoRef.current?.paused) {
      videoRef.current.play().catch(() => {
        console.log("Autoplay prevented");
      });
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    video.preload = "auto";
    video.playsInline = true;
    video.muted = true;

    video.setAttribute("fetchpriority", "high");
    video.setAttribute("loading", "eager");

    video.addEventListener("loadeddata", handleCanPlay);

    const applyVolumeAfterLoad = () => {
      if (video) {
        video.volume = volumeLevel;
        video.muted = isMuted;
      }
    };

    if (isLoaded) {
      applyVolumeAfterLoad();
    }

    return () => {
      video.removeEventListener("loadeddata", handleCanPlay);
    };
  }, [handleCanPlay, isLoaded, isMuted, volumeLevel]);

  useEffect(() => {
    if (videoRef.current && isLoaded) {
      videoRef.current.volume = volumeLevel;
      videoRef.current.muted = isMuted;
    }
  }, [volumeLevel, isMuted, isLoaded]);

  return (
    <>
      <div className="fixed inset-0 bg-black -z-10" />{" "}
      {/* Immediate background */}
      <div
        className={`fixed inset-0 -z-10 transition-opacity duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loop
          muted={true}
          playsInline
          autoPlay
          disablePictureInPicture
          poster="/images/video-poster.jpg">
          {useLocalVideo && (
            <>
              <source
                src={videoSource.replace(".mp4", ".webm")}
                type="video/webm"
              />
              <source src={videoSource} type="video/mp4" />
            </>
          )}
          {!useLocalVideo && <source src={videoSource} type="video/mp4" />}
        </video>
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>
    </>
  );
}
