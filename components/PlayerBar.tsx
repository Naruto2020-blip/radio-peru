import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePlayer } from "@/context/PlayerContext";

export function PlayerBar() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { currentStation, isPlaying, isLoading, error, togglePlayPause } =
    usePlayer();

  const slideAnim = useRef(new Animated.Value(120)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentStation) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStation, slideAnim]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim]);

  if (!currentStation) return null;

  const onToggle = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await togglePlayPause();
  };

  const barContent = (
    <View
      style={[
        styles.inner,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
      ]}
    >
      <View style={[styles.stationIcon, { backgroundColor: currentStation.color }]}>
        <Text style={styles.stationIconText}>{currentStation.initials}</Text>
      </View>

      <View style={styles.textArea}>
        <Text style={styles.stationName} numberOfLines={1}>
          {currentStation.name}
        </Text>
        <Text style={styles.statusText} numberOfLines={1}>
          {isLoading
            ? "Conectando..."
            : error
            ? "Error de conexión"
            : isPlaying
            ? `🔴 En vivo · ${currentStation.frequency}`
            : `⏸ Pausado · ${currentStation.frequency}`}
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={onToggle}
          style={[styles.playButton, { backgroundColor: currentStation.color }]}
        >
          <Text style={styles.playIcon}>
            {isLoading ? "⋯" : isPlaying ? "⏸" : "▶"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={90}
          tint={colorScheme === "dark" ? "dark" : "light"}
          style={styles.blur}
        >
          {barContent}
        </BlurView>
      ) : (
        <View style={[styles.blur, { backgroundColor: "rgba(20,20,30,0.95)" }]}>
          {barContent}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  blur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  stationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stationIconText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  textArea: {
    flex: 1,
    gap: 2,
  },
  stationName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  statusText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 16,
    color: "#ffffff",
  },
});
