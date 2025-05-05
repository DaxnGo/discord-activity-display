"use client";

import { useLanyard } from "@/hooks/useLanyard";
import { useState, useEffect, useRef } from "react";
import { Music } from "lucide-react";
import { useCardAnimation } from "@/hooks/useCardAnimation";
import gsap from "gsap";

// Set your Discord ID here
const DISCORD_ID = "915440078573154324";

export default function DiscordActivity() {
  const { discordData, loading, error } = useLanyard(DISCORD_ID);
  const [currentElapsed, setCurrentElapsed] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const statusDotRef = useRef<HTMLDivElement>(null);
  const { cardRef } = useCardAnimation({
    selector: ".animate-item",
    delay: 0.2,
  });

  // Update elapsed time counter
  useEffect(() => {
    // Only log Discord data for debugging in development mode and limit frequency
    if (
      discordData &&
      process.env.NODE_ENV === "development" &&
      Math.random() < 0.1
    ) {
      console.log("Current Discord data:", discordData);
    }

    if (error) {
      console.error("Discord connection error:", error);
      setDebugInfo(`Error connecting: ${error.message}`);
    }

    if (!discordData || !discordData.currentActivity?.startTime) {
      return;
    }

    setCurrentElapsed(discordData.elapsedTime);

    const timer = setInterval(() => {
      setCurrentElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [discordData, error]);

  // Status dot animation
  useEffect(() => {
    if (statusDotRef.current && discordData?.user?.status === "online") {
      gsap.to(statusDotRef.current, {
        scale: 1.2,
        opacity: 0.7,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, [discordData]);

  // Status color mapping
  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

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

  // Activity icon handler
  const getActivityIcon = () => {
    if (discordData?.spotify) {
      return (
        <div className="w-12 h-12 bg-gray-800 rounded-lg mr-4 flex items-center justify-center overflow-hidden shadow-lg">
          <img
            src={discordData.spotify.albumArt}
            alt={discordData.spotify.album}
            className="w-12 h-12 object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      );
    }

    if (discordData?.currentActivity?.largeImage) {
      let imageUrl = discordData.currentActivity.largeImage;
      if (imageUrl.startsWith("mp:")) {
        imageUrl = `https://media.discordapp.net/${imageUrl.replace("mp:", "")}`;
      } else if (imageUrl.startsWith("spotify:")) {
        imageUrl = `https://i.scdn.co/image/${imageUrl.replace("spotify:", "")}`;
      }

      return (
        <div className="w-12 h-12 bg-gray-800 rounded-lg mr-4 flex items-center justify-center overflow-hidden shadow-lg">
          <img
            src={imageUrl}
            alt={
              discordData.currentActivity.largeText ||
              discordData.currentActivity.name
            }
            className="w-12 h-12 object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 bg-gray-800 rounded-lg mr-4 flex items-center justify-center text-sm shadow-lg backdrop-blur-sm">
        {discordData?.spotify ? (
          <Music className="h-6 w-6" />
        ) : discordData?.currentActivity?.type === "PLAYING" ? (
          "GAME"
        ) : (
          "•••"
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-[#2b2d31] to-[#1e1f22] rounded-xl p-5 text-left w-full shadow-xl border border-white/5 backdrop-blur-md transition-all duration-300">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="ml-3 text-sm text-gray-400 animate-item">
            Connecting to Discord...
          </div>
        </div>
      </div>
    );
  }

  if (error || !discordData) {
    return (
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-[#2b2d31] to-[#1e1f22] rounded-xl p-5 text-left w-full shadow-xl border border-white/5 backdrop-blur-md transition-all duration-300">
        <div className="text-center text-red-400 py-4">
          <div className="font-bold mb-2 animate-item">
            Unable to connect to Discord
          </div>
          <div className="text-sm animate-item">
            Make sure you've joined the Lanyard Discord server:
            <br />
            <a
              href="https://discord.gg/UrXF2cfJ7F"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
              discord.gg/UrXF2cfJ7F
            </a>
          </div>
          {debugInfo && (
            <div className="mt-2 p-2 bg-black/30 rounded text-xs text-left overflow-auto max-h-24 animate-item">
              {debugInfo}
            </div>
          )}
          <div className="mt-3 text-xs opacity-75 animate-item">
            Discord ID: {DISCORD_ID}
          </div>
        </div>
      </div>
    );
  }

  const { user, currentActivity, spotify } = discordData;

  return (
    <div
      ref={cardRef}
      className="bg-gradient-to-br from-[#2b2d31] to-[#1e1f22] rounded-xl p-5 text-left w-full shadow-xl border border-white/5 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-5 animate-item">
        <div className="relative w-14 h-14 mr-4">
          <div className="w-14 h-14 rounded-full bg-gray-800 overflow-hidden ring-2 ring-white/10 shadow-lg">
            <img
              src={user.avatarUrl}
              alt={`${user.username}'s Avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            ref={statusDotRef}
            className={`absolute -bottom-1 -right-1 w-5 h-5 ${
              statusColors[user.status]
            } rounded-full border-2 border-[#1e1f22] shadow-glow`}></div>
        </div>
        <div>
          <div className="font-bold text-lg">{user.username}</div>
          <div className="text-sm opacity-80 capitalize flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full ${statusColors[user.status]} mr-2`}></span>
            {user.status}
          </div>
        </div>
      </div>

      {/* Spotify activity takes precedence */}
      {spotify ? (
        <div className="bg-gradient-to-r from-[#1DB954]/20 to-[#191414]/20 backdrop-blur-md rounded-lg p-4 text-sm transform transition-all duration-300 hover:scale-[1.02] shadow-md animate-item">
          <div className="text-xs font-medium text-[#1DB954] mb-2 uppercase tracking-wider">
            Listening to Spotify
          </div>
          <div className="flex items-center">
            {getActivityIcon()}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white truncate">
                {spotify.song}
              </div>
              <div className="text-xs text-gray-300 truncate">
                by {spotify.artist}
              </div>
              <div className="text-xs text-gray-400 truncate">
                on {spotify.album}
              </div>
            </div>
          </div>
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1DB954] rounded-full"
              style={{
                width: `${((Date.now() - spotify.startTime) / (spotify.endTime - spotify.startTime)) * 100}%`,
              }}></div>
          </div>
        </div>
      ) : currentActivity ? (
        <div className="bg-gradient-to-r from-[#5865F2]/20 to-[#313338]/20 backdrop-blur-md rounded-lg p-4 text-sm transform transition-all duration-300 hover:scale-[1.02] shadow-md animate-item">
          <div className="text-xs font-medium text-[#5865F2] mb-2 uppercase tracking-wider">
            {currentActivity.type}
          </div>
          <div className="flex items-center">
            {getActivityIcon()}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white truncate">
                {currentActivity.name}
              </div>
              {currentActivity.details && (
                <div className="text-xs text-gray-300 truncate">
                  {currentActivity.details}
                </div>
              )}
              {currentActivity.state && (
                <div className="text-xs text-gray-400 truncate">
                  {currentActivity.state}
                </div>
              )}
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
                {formatTime(currentElapsed)} elapsed
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#36393f]/80 backdrop-blur-md rounded-lg p-4 text-sm text-center py-6 animate-item shadow-md">
          <div className="text-gray-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            No activity detected
          </div>
        </div>
      )}
    </div>
  );
}
