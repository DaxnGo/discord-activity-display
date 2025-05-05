"use client";

import { useState, useEffect } from "react";

// Lanyard API types
export interface LanyardData {
  success: boolean;
  data: {
    spotify?: {
      track_id: string;
      timestamps: {
        start: number;
        end: number;
      };
      song: string;
      artist: string;
      album_art_url: string;
      album: string;
    };
    listening_to_spotify: boolean;
    discord_user: {
      id: string;
      username: string;
      avatar: string;
      discriminator: string;
      public_flags: number;
    };
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: Array<{
      type: number;
      state: string;
      name: string;
      id: string;
      details?: string;
      created_at: number;
      timestamps?: {
        start?: number;
        end?: number;
      };
      assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
      };
    }>;
    active_on_discord_desktop: boolean;
    active_on_discord_mobile: boolean;
    active_on_discord_web: boolean;
  };
}

// Activity type mapping
const ACTIVITY_TYPES = {
  0: "PLAYING",
  1: "STREAMING",
  2: "LISTENING",
  3: "WATCHING",
  4: "CUSTOM",
  5: "COMPETING",
};

// Convert Discord timestamp to elapsed time in seconds
const getElapsedTime = (timestamp: number) => {
  if (!timestamp) return 0;
  return Math.floor((Date.now() - timestamp) / 1000);
};

// Cache management
let dataCache: LanyardData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export function useLanyard(discordId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if we can use cached data
        const now = Date.now();
        if (dataCache && now - lastFetchTime < CACHE_DURATION) {
          // Use cached data if it's recent enough
          setData(dataCache);
          setLoading(false);
          return;
        }

        // Only log in development
        if (process.env.NODE_ENV === "development") {
          console.log(`Fetching Discord data for ID: ${discordId}`);
          console.log(
            `API URL: https://api.lanyard.rest/v1/users/${discordId}`
          );
        }

        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${discordId}`,
          {
            cache: "no-store",
            next: { revalidate: 30 },
          }
        );

        if (!response.ok) {
          if (process.env.NODE_ENV === "development") {
            console.error(
              `API Error: ${response.status} ${response.statusText}`
            );
          }
          throw new Error(`Failed to fetch Discord status: ${response.status}`);
        }

        const result = await response.json();

        if (process.env.NODE_ENV === "development") {
          console.log("API Response:", result);
        }

        // Update cache
        dataCache = result;
        lastFetchTime = now;

        setData(result);
        setLoading(false);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Lanyard API Error:", err);
        }
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling - increase to 30 seconds to reduce requests
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [discordId]);

  // Format the data to match our app's structure
  const formatDiscordData = () => {
    if (!data || !data.success) {
      // Don't log on production
      if (process.env.NODE_ENV === "development") {
        console.log("No data or unsuccessful response, using fallback");
      }
      return {
        user: {
          username: "adidmyo",
          avatarUrl: "https://i.pravatar.cc/100",
          status: "offline" as const,
        },
        currentActivity: null,
        elapsedTime: 0,
      };
    }

    const { discord_status, activities, discord_user } = data.data;

    // Find gaming or custom activity (excluding Spotify which is handled separately)
    const activity = activities?.find((a) => a.type === 0 || a.type === 4);

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Found activity:", activity);
    }

    return {
      user: {
        username: discord_user.username,
        avatarUrl: `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`,
        status: discord_status,
      },
      currentActivity: activity
        ? {
            type: ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES],
            name: activity.name,
            details: activity.details || undefined,
            state: activity.state || undefined,
            startTime: activity.timestamps?.start,
            endTime: activity.timestamps?.end,
            largeImage: activity.assets?.large_image,
            largeText: activity.assets?.large_text,
            smallImage: activity.assets?.small_image,
            smallText: activity.assets?.small_text,
          }
        : null,
      spotify: data.data.spotify
        ? {
            song: data.data.spotify.song,
            artist: data.data.spotify.artist,
            album: data.data.spotify.album,
            albumArt: data.data.spotify.album_art_url,
            startTime: data.data.spotify.timestamps.start,
            endTime: data.data.spotify.timestamps.end,
          }
        : null,
      elapsedTime: activity?.timestamps?.start
        ? getElapsedTime(activity.timestamps.start)
        : 0,
    };
  };

  return {
    discordData: formatDiscordData(),
    loading,
    error,
  };
}
