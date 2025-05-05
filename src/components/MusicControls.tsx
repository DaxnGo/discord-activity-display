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

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    onVolumeChange(newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent event from propagating
    e.preventDefault();
    e.stopPropagation();

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
    setShowVolumeSlider(!showVolumeSlider);
  };

  return (
    <div
      className={`fixed ${isMobile ? "bottom-16 right-4" : "bottom-4 right-4"} z-30 flex items-center gap-2`}>
      {/* Volume slider - shown when button is clicked */}
      {showVolumeSlider && (
        <div
          className="bg-black/70 backdrop-blur-md p-2 rounded-full h-10 flex items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volumeLevel}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
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
        }}
        onMouseEnter={isMobile ? undefined : () => setShowVolumeSlider(true)}
        onTouchStart={
          isMobile
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleVolumeSlider(e as unknown as React.MouseEvent);
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
