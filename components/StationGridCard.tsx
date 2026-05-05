import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Station } from "@/constants/stations";
import { usePlayer } from "@/context/PlayerContext";

const COLUMNS = 6;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PADDING = 12;
const GAP = 6;
const CARD_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

export function StationGridCard({ station }: { station: Station }) {
  const { currentStation, isPlaying, isLoading, playStation } = usePlayer();
  const isActive = currentStation?.id === station.id;
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = async () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await playStation(station);
  };

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: station.color,
              shadowColor: isActive ? station.color : "transparent",
              shadowOpacity: isActive ? 0.7 : 0,
              shadowRadius: isActive ? 8 : 0,
              shadowOffset: { width: 0, height: 0 },
              elevation: isActive ? 8 : 2,
              borderWidth: isActive ? 2.5 : 0,
              borderColor: "#fff",
            },
          ]}
        >
          <Text style={styles.initials}>{station.initials}</Text>

          {isActive && isPlaying && (
            <View style={styles.liveIndicator}>
              <Text style={styles.liveDot}>●</Text>
            </View>
          )}
          {isActive && isLoading && (
            <View style={styles.liveIndicator}>
              <Text style={styles.loadingDot}>⋯</Text>
            </View>
          )}
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {station.name}
        </Text>
        <Text style={styles.freq} numberOfLines={1}>
          {station.frequency}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_SIZE,
    marginBottom: 10,
    alignItems: "center",
  },
  iconBox: {
    width: CARD_SIZE - 2,
    height: CARD_SIZE - 2,
    borderRadius: (CARD_SIZE - 2) * 0.28,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  initials: {
    color: "#ffffff",
    fontSize: CARD_SIZE * 0.22,
    fontWeight: "800",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  name: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 11,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  freq: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 7.5,
    textAlign: "center",
    marginTop: 1,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  liveIndicator: {
    position: "absolute",
    top: 2,
    right: 3,
  },
  liveDot: {
    color: "#00FF88",
    fontSize: 8,
  },
  loadingDot: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "900",
  },
});
