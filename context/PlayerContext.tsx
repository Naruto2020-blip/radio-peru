import { Audio } from "expo-av";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Station } from "@/constants/stations";

interface PlayerContextValue {
  currentStation: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playStation: (station: Station) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopPlayer: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const sessionRef = useRef(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const stopPlayer = useCallback(async () => {
    sessionRef.current += 1;
    const prev = soundRef.current;
    soundRef.current = null;
    if (prev) {
      try {
        await prev.stopAsync();
        await prev.unloadAsync();
      } catch (_) {}
    }
    setIsPlaying(false);
  }, []);

  const playStation = useCallback(async (station: Station) => {
    const session = ++sessionRef.current;

    const prev = soundRef.current;
    soundRef.current = null;

    if (prev) {
      try {
        await prev.stopAsync();
        await prev.unloadAsync();
      } catch (_) {}
    }

    if (session !== sessionRef.current) return;

    setCurrentStation(station);
    setIsPlaying(false);
    setIsLoading(true);
    setError(null);

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: station.streamUrl },
        { shouldPlay: true, isLooping: false },
        (status) => {
          if (session === sessionRef.current && status.isLoaded) {
            setIsPlaying(status.isPlaying);
          }
        }
      );

      if (session !== sessionRef.current) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (_) {}
        return;
      }

      soundRef.current = sound;
      setIsPlaying(true);
    } catch (_) {
      if (session === sessionRef.current) {
        setError("No se pudo conectar a la emisora. Intenta de nuevo.");
        setIsPlaying(false);
      }
    } finally {
      if (session === sessionRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (_) {}
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        isLoading,
        error,
        playStation,
        togglePlayPause,
        stopPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
