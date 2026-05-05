import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { Station } from "@/constants/stations";
import { usePlayer } from "@/context/PlayerContext";

interface StationCardProps {
  station: Station;
}

function LiveDots({ color }: { color: string }) {
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.dotsRow}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { backgroundColor: color, opacity: dot }]}
        />
      ))}
    </View>
  );
}

export function StationCard({ station }: StationCardProps) {
  const colors = useColors();
  const { currentStation, isPlaying, isLoading, playStation } = usePlayer();
  const isActive = currentStation?.id === station.id;
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = async () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await playStation(station);
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: isActive ? station.color : colors.border,
            borderWidth: isActive ? 1.5 : 1,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: station.color + "22" }]}>
          <Text style={[styles.avatarText, { color: station.color }]}>
            {station.initials}
          </Text>
          <View style={[styles.colorBar, { backgroundColor: station.color }]} />
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text
              style={[styles.stationName, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {station.name}
            </Text>
            {isActive && isPlaying && (
              <LiveDots color={station.color} />
            )}
            {isActive && isLoading && (
              <View style={[styles.loadingBadge, { backgroundColor: station.color + "22" }]}>
                <Text style={[styles.loadingText, { color: station.color }]}>
                  Cargando...
                </Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.genreBadge, { backgroundColor: station.color + "18" }]}>
              <Text style={[styles.genreText, { color: station.color }]}>
                {station.genre}
              </Text>
            </View>
            <Text style={[styles.frequency, { color: colors.mutedForeground }]}>
              {station.frequency}
            </Text>
          </View>

          <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={1}>
            {station.description}
          </Text>
        </View>

        <View style={[styles.playBtn, { backgroundColor: isActive ? station.color : colors.secondary }]}>
          <Text style={[styles.playIcon, { color: isActive ? "#fff" : colors.mutedForeground }]}>
            {isActive && isPlaying ? "❚❚" : "▶"}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    overflow: "hidden",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  colorBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stationName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  genreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  genreText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  frequency: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  description: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 12,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  loadingBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  loadingText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
