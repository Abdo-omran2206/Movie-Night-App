import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ChatCard from "@/src/components/nightguide/ChatCard";
import {
  getGeminiResponse,
  getQuickSuggestions,
} from "@/src/api/nightguide/NightGuide";
import { search } from "@/src/api/tmdb";
import {
  getMessages,
  addMessage,
  clearMessages,
} from "@/src/api/nightguide/NightGuideDBManger";

export interface Chat {
  role: "user" | "model";
  message: string;
  loading?: boolean;
  movies?: any[];
}

export default function NightGuide() {
  const router = useRouter();
  const [chat, setChat] = useState<Chat[]>([
    {
      role: "model",
      message:
        "Hi there! I'm NightGuide 🎬. What kind of movie or TV show are you in the mood for?",
    },
  ]);
  const [text, setText] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const loadOldMessages = async () => {
      const rows = await getMessages();

      if (rows.length === 0) return;

      const formattedMessages: Chat[] = rows.map((row) => ({
        role: row.role,
        message: row.content,
        movies: row.movies,
      }));

      setChat(formattedMessages);
    };

    loadOldMessages();
  }, []);

  const handleSend = async (customText?: string | any) => {
    const messageText = typeof customText === "string" ? customText : text;
    if (!messageText.trim()) return;

    const userMessage: Chat = {
      role: "user",
      message: messageText,
    };

    const loadingMessage: Chat = {
      role: "model",
      message: "Thinking...",
      loading: true,
    };

    const updatedChat = [...chat, userMessage, loadingMessage];

    setChat(updatedChat);
    scrollRef.current?.scrollToEnd({ animated: true });
    setText("");

    try {
      // Save user message to DB
      await addMessage("user", messageText);

      const aiText = await getGeminiResponse(messageText, chat);

      const titles = Array.from(aiText.matchAll(/\*\*(.*?)\*\*/g)).map(
        (m) => m[1],
      );
      let moviesData: any[] = [];
      if (titles.length > 0) {
        const searchPromises = titles.slice(0, 5).map((t) => search(t, 1));
        const results = await Promise.all(searchPromises);
        moviesData = results.map((res) => res[0]).filter(Boolean);
      }

      // Save model response + movies to DB
      await addMessage("model", aiText, moviesData);

      setChat((prev) => {
        const newChat = [...prev];

        // replace last loading message
        const lastIndex = newChat.length - 1;

        newChat[lastIndex] = {
          role: "model",
          message: aiText,
          loading: false,
          movies: moviesData,
        };

        return newChat;
      });
    } catch (err) {
      setChat((prev) => {
        const newChat = [...prev];

        const lastIndex = newChat.length - 1;

        newChat[lastIndex] = {
          role: "model",
          message: "⚠️ Failed to get response",
          loading: false,
        };

        return newChat;
      });
    } finally {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleClearmessages = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearMessages();
            setChat([
              {
                role: "model",
                message:
                  "Hi there! I'm NightGuide 🎬. What kind of movie or TV show are you in the mood for?",
              },
            ]);
          },
        },
      ],
    );
  };

  return (
    <View style={style.mainground}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}
        <View style={style.header}>
          <View style={style.leftheader}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back-circle" size={30} color="#fff" />
            </Pressable>

            <Image
              source={require("@/assets/images/nightguide/NightGuide.png")}
              style={style.avatar}
            />

            <Text style={style.headerText}>NightGuide</Text>
          </View>
          <Pressable onPress={handleClearmessages}>
            <Ionicons name="trash" color="#fff" size={30} />
          </Pressable>
        </View>

        {/* CHAT */}
        <ScrollView
          ref={scrollRef}
          style={style.chatArea}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          {chat.map((item, idx) => (
            <ChatCard
              key={idx}
              role={item.role}
              message={item.message}
              loading={item.loading}
              movies={item.movies}
            />
          ))}
          {chat.length === 1 && text.trim().length === 0 && (
            <View style={style.suggestionsContainer}>
              {getQuickSuggestions().map((suggestion, idx) => (
                <Pressable
                  key={idx}
                  style={style.suggestionBubble}
                  onPress={() => handleSend(suggestion)}
                >
                  <Text style={style.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* INPUT */}
        <View style={style.inputContainer}>
          <TextInput
            placeholder="type your recommendation"
            placeholderTextColor="#888"
            style={style.input}
            value={text}
            onChangeText={setText}
          />

          <Pressable style={style.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const style = StyleSheet.create({
  mainground: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingTop: 45,
    paddingHorizontal: 12,
  },

  /* HEADER */
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  leftheader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },

  headerText: {
    color: "#fff",
    fontSize: 23,
    letterSpacing: 1,
    fontWeight: "600",
    fontFamily: "BebasNeue",
  },

  /* CHAT AREA */
  chatArea: {
    flex: 1,
    marginTop: 10,
  },

  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  suggestionBubble: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  suggestionText: {
    color: "#ccc",
    fontSize: 14,
  },

  /* INPUT */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  // inputContainer: {
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#1a1a1a",
  //   borderRadius: 25,
  //   paddingHorizontal: 10,
  //   paddingVertical: 6,
  //   // marginBottom: 10,
  // },

  input: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 10,
  },

  sendButton: {
    backgroundColor: "#E50914",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
