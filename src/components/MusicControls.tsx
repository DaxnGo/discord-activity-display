"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Volume1 } from "lucide-react";

type MusicControlsProps = {
  onVolumeChange: (isMuted: boolean) => void;
  onVolumeLevel?: (level: number) => void;
};

export default function MusicControls({
  onVolumeChange,
  onVolumeLevel = () => {},
}: MusicControlsProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(0.5); // Default to 50% volume
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
  }, []);

  // Completely isolate volume control events
  const toggleMute = (e: React.MouseEvent) => {
    // Stop all event propagation to prevent animation retriggering
    e.preventDefault();
    e.stopPropagation();

    // Mark this event to prevent it from affecting other components
    e.currentTarget.setAttribute("data-internal-event", "true");

    // Use a callback to ensure we have the latest state
    setIsMuted((prev) => {
      const newMutedState = !prev;
      onVolumeChange(newMutedState);
      return newMutedState;
    });

    // Return false to prevent any default browser behavior
    return false;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent event from propagating
    e.preventDefault();
    e.stopPropagation();

    // Mark this event to prevent it from affecting other components
    e.currentTarget.setAttribute("data-internal-event", "true");

    const newLevel = parseFloat(e.target.value);
    setVolumeLevel(newLevel);
    onVolumeLevel(newLevel);

    // If volume is set to 0, mute the audio
    if (newLevel === 0 && !isMuted) {
      setIsMuted(true);
      onVolumeChange(true);
    }
    // If volume is raised from 0 and is muted, unmute
    else if (newLevel > 0 && isMuted) {
      setIsMuted(false);
      onVolumeChange(false);
    }
  };

  // Show/hide volume slider based on device type
  const toggleVolumeSlider = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Mark this event to prevent it from affecting other components
    e.currentTarget.setAttribute("data-internal-event", "true");

    setShowVolumeSlider(!showVolumeSlider);
    return false;
  };

  return (
    <div
      className={`fixed ${isMobile ? "bottom-16 right-4" : "bottom-4 right-4"} z-30 flex items-center gap-2 music-controls`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}>
      {/* Volume slider - shown when button is clicked */}
      {showVolumeSlider && (
        <div
          className="bg-black/70 backdrop-blur-md p-2 rounded-full h-10 flex items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.setAttribute("data-internal-event", "true");
          }}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volumeLevel}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.setAttribute("data-internal-event", "true");
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.currentTarget.setAttribute("data-internal-event", "true");
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.currentTarget.setAttribute("data-internal-event", "true");
            }}
          />
        </div>
      )}

      {/* Mute/unmute button with volume display */}
      <button
        onClick={toggleMute}
        onTouchEnd={(e) => {
          // For mobile: prevent default and stop propagation
          e.preventDefault();
          e.stopPropagation();
          toggleMute(e as unknown as React.MouseEvent);
          return false;
        }}
        onMouseEnter={
          isMobile
            ? undefined
            : (e) => {
                e.stopPropagation();
                setShowVolumeSlider(true);
              }
        }
        onTouchStart={
          isMobile
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleVolumeSlider(e as unknown as React.MouseEvent);
                return false;
              }
            : undefined
        }
        className="p-3 rounded-full bg-black/70 backdrop-blur-md border border-white/10 transition-colors hover:bg-black/50 shadow-lg flex items-center justify-center"
        aria-label={isMuted ? "Unmute music" : "Mute music"}>
        {isMuted ? (
          <VolumeX className="h-6 w-6 text-white/70" />
        ) : volumeLevel < 0.5 ? (
          <Volume1 className="h-6 w-6 text-white" />
        ) : (
          <Volume2 className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  );
}
