"use client";

import { useEffect, useState, useRef } from "react";

type VideoBackgroundProps = {
  videoSource?: string;
  videoId?: string;
  isMuted?: boolean;
  volumeLevel?: number;
  useLocalVideo?: boolean;
  lowQualitySource?: string; // Add option for low quality preview
};

export default function VideoBackground({
  videoSource = "/videos/蒼のワルツ - Eve MV (3).mp4",
  videoId,
  isMuted = true,
  volumeLevel = 0.5,
  useLocalVideo = true,
  lowQualitySource,
}: VideoBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lowQualityVideoRef = useRef<HTMLVideoElement>(null);

  // Start preloading the video immediately when the component mounts
  useEffect(() => {
    // Instead of using invalid "as=video", use fetchpriority attribute
    const resourceHint = document.createElement("link");
    resourceHint.rel = "preconnect";
    resourceHint.href = videoSource.startsWith("http")
      ? new URL(videoSource).origin
      : window.location.origin;
    document.head.appendChild(resourceHint);

    // Start loading the video in the background
    const preloadVideo = document.createElement("video");
    preloadVideo.src = videoSource;
    preloadVideo.preload = "auto";
    preloadVideo.muted = true;
    preloadVideo.style.display = "none";
    preloadVideo.load(); // Start loading the data

    setIsClient(true);

    return () => {
      // Clean up
      document.head.removeChild(resourceHint);
      preloadVideo.remove();
    };
  }, [videoSource]);

  // Initialize video playback with better error handling
  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    const video = videoRef.current;

    // Preload video aggressively
    video.preload = "auto";
    video.load(); // Explicitly call load to start buffering immediately

    // Set higher buffer size
    if ("mediaSource" in window) {
      try {
        // @ts-ignore - This is a non-standard but useful attribute
        video.bufferSize = 60; // buffer up to 60 seconds
      } catch (e) {
        console.log("Buffer size setting not supported");
      }
    }

    // Force browser to keep video in memory
    video.setAttribute("disablePictureInPicture", "true");
    video.setAttribute("disableRemotePlayback", "true");

    // Use hardware acceleration where available
    video.style.transform = "translateZ(0)";
    video.style.willChange = "transform";

    // Add high priority media resource hint
    const resourceHint = document.createElement("link");
    resourceHint.rel = "preconnect";
    resourceHint.href = videoSource.startsWith("http")
      ? new URL(videoSource).origin
      : window.location.origin;
    document.head.appendChild(resourceHint);

    // Function to handle loading progress
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        const percentLoaded = (bufferedEnd / duration) * 100;

        if (percentLoaded > 30) {
          // Once 30% is loaded, consider it playable
          setVideoLoaded(true);
        }

        if (percentLoaded > 95) {
          // Once fully loaded, mark as complete
          setFullyLoaded(true);
        }
      }
    };

    // Function to handle successful loading
    const handleCanPlay = () => {
      setVideoLoaded(true);
      setVideoError(false);
      console.log("Video can play now");
      // Set initial volume state
      video.muted = isMuted;
      if (!isMuted) {
        video.volume = volumeLevel;
      }
      // Start playing
      video.play().catch(console.error);
    };

    // Function to handle successful play start
    const handlePlaying = () => {
      console.log("Video is playing");
      setVideoLoaded(true);
    };

    // Function to handle playback errors
    const handleError = (e: Event) => {
      console.error("Video playback error:", e);
      setVideoError(true);

      // Try switching to low quality version if available
      if (lowQualitySource && lowQualityVideoRef.current) {
        const lowVideo = lowQualityVideoRef.current;
        lowVideo.style.opacity = "1";
        lowVideo
          .play()
          .catch((err) => console.error("Low quality fallback error:", err));
      }
    };

    // Add event listeners
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("progress", handleProgress);

    // Cleanup
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("progress", handleProgress);
      document.head.removeChild(resourceHint);
    };
  }, [isClient, videoSource, lowQualitySource]);

  // Separate effect for handling volume changes
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.muted = isMuted;
    if (!isMuted) {
      video.volume = volumeLevel;
    }
  }, [isMuted, volumeLevel]);

  if (!isClient) return <div className="absolute inset-0 bg-black"></div>;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
      {useLocalVideo ? (
        <>
          {/* Low quality version for instant playback - ONLY if file exists */}
          {lowQualitySource && (
            <video
              ref={lowQualityVideoRef}
              className="absolute inset-0 w-full h-full object-cover scale-[1.1]"
              autoPlay
              loop
              muted
              playsInline>
              <source src={lowQualitySource} type="video/mp4" />
            </video>
          )}

          {/* Main high quality video - no poster until you add it */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover scale-[1.1] ${
              videoLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-1000`}
            autoPlay
            loop
            playsInline>
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Fallback or loading indicator */}
          {(!videoLoaded || videoError) && (
            <div className="absolute inset-0 bg-black flex items-center justify-center flex-col">
              <div className="w-16 h-16 border-t-4 border-white/30 border-l-4 border-white rounded-full animate-spin mb-4"></div>
              {videoError && (
                <p className="text-white/70 text-sm">
                  Video playback issue. Retrying...
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&modestbranding=1`}
          title="Background Music"
          className="absolute inset-0 w-full h-full scale-[1.1]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen></iframe>
      )}

      {/* Lighter overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
}
