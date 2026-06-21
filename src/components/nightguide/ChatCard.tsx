import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import NightguideMovieCard from "./NightguideMovieCard";

type ChatCardProps = {
  role: "user" | "model";
  message: string;
  loading?: boolean;
  movies?: any[];
};

const formatMessage = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={{ fontWeight: "bold" }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

export default function ChatCard({ role, message, loading, movies }: ChatCardProps) {
  if (role === "user") {
    return (
      <View style={[style.container, style.user]}>
        <Text style={style.userText}>{message}</Text>
      </View>
    );
  }

  if (role === "model") {
    return (
      <View style={[style.container, style.bot]}>
        <Image
          source={require("@/assets/images/nightguide/NightGuide.png")}
          style={style.avatar}
        />

        <View style={style.botContent}>
          <View style={style.botBubble}>
            {loading ? (
              <Text style={style.loadingText}>Thinking...</Text>
            ) : (
              <Text style={style.botText}>{formatMessage(message)}</Text>
            )}
          </View>

          {movies && movies.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style.movieList}>
              {movies.map((m, idx) => (
                <NightguideMovieCard key={idx} item={m} />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    );
  }

  return null;
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    width: "100%",
  },

  user: {
    alignSelf: "flex-end",
    backgroundColor: "#232323",
    padding: 10,
    borderRadius: 12,
    maxWidth: "80%",
  },

  bot: {
    alignSelf: "flex-start",
    gap: 8,
    width: "85%",
  },
  botContent: {
    flex: 1,
  },
  movieList: {
    marginTop: 8,
  },

  userText: {
    color: "#fff",
    fontFamily: "RobotoSlab",
  },

  botText: {
    color: "#fff",
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 12,
    fontFamily: "RobotoSlab",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  botBubble: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 12,
    maxWidth: "100%",
  },

  loadingText: {
    color: "#888",
    fontStyle: "italic",
  },
});
