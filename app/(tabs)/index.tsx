import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlayerBar } from "@/components/PlayerBar";
import { StationGridCard } from "@/components/StationGridCard";
import { STATIONS } from "@/constants/stations";
import { usePlayer } from "@/context/PlayerContext";

const COLUMNS = 6;
const GAP = 6;

export default function StationsScreen() {
  const insets = useSafeAreaInsets();
  const { error } = usePlayer();
  const topPad = Platform.OS === "web" ? 40 : insets.top;

  const renderItem = ({ item }: { item: (typeof STATIONS)[0] }) => (
    <StationGridCard station={item} />
  );

  return (
    <ImageBackground
      source={require("../../assets/images/simpsons_bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.45)", "rgba(10,5,30,0.82)", "rgba(10,5,30,0.95)"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.header}>
          <View style={styles.flagAccent}>
            <View style={[styles.flagBar, { backgroundColor: "#C8102E" }]} />
            <View style={[styles.flagBar, { backgroundColor: "#FFFFFF" }]} />
            <View style={[styles.flagBar, { backgroundColor: "#C8102E" }]} />
          </View>
          <View>
            <Text style={styles.title}>Radio Perú</Text>
            <Text style={styles.subtitle}>19 emisoras en vivo</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <FlatList
          data={STATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={COLUMNS}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={[
            styles.grid,
            { paddingBottom: 130 + (Platform.OS === "web" ? 0 : insets.bottom) },
          ]}
          showsVerticalScrollIndicator={false}
        />

        <PlayerBar />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  flagAccent: {
    flexDirection: "row",
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: "hidden",
  },
  flagBar: {
    flex: 1,
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  errorBanner: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(200,16,46,0.25)",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
  },
  grid: {
    paddingHorizontal: 12,
    gap: GAP,
  },
});
