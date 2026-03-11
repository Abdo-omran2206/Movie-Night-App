import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getActorById, getActorImages } from "../../api/main";
import RenderMovieCard from "../../components/Cards/MovieCard";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/store";
import { LinearGradient } from "expo-linear-gradient";
import ImageViewer from "../../components/ImageViewer";
import { getImageUrl } from "@/app/lib/getImageUrl";
import { onShare as centralOnShare } from "@/app/lib/onShare";
const { width, height } = Dimensions.get("window");

export default function ActorDetails() {
  const { actorID } = useLocalSearchParams();
  const router = useRouter();
  const { webSiteUrl, config, dataSavermood } = useStore();
  const [actor, setActor] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { castImage: profilePoster } = getImageUrl(dataSavermood, "detail");

  const onShare = React.useCallback(async () => {
    await centralOnShare("actor", actor, webSiteUrl, config);
  }, [actor, webSiteUrl, config]);

  useEffect(() => {
    async function loadActor() {
      try {
        if (typeof actorID === "string") {
          const [actorData, imagesData] = await Promise.all([
            getActorById(actorID),
            getActorImages(actorID),
          ]);
          setActor(actorData);
          setImages(imagesData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadActor();
  }, [actorID]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Actor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 👤 Professional Header */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedImage(profilePoster + actor.profile_path)}
          style={{ flex: 1 }}
        >
          <ImageBackground
            source={{
              uri: profilePoster + actor.profile_path,
            }}
            style={styles.coverImage}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
              locations={[0, 0.9, 1]}
              style={styles.overlay}
            />

            {/* Header Buttons */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.actionButton}
              >
                <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Actor Name & Info Overlay */}
            <View style={styles.infoOverlay}>
              <Text style={styles.actorName}>{actor.name}</Text>
              <Text style={styles.subInfo}>
                {actor.birthday ? actor.birthday : "N/A"} •{" "}
                {actor.place_of_birth || "Unknown"}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      {/* 📜 Biography Section */}
      <BiographySection biography={actor.biography} />

      {/* 🎬 Filmography Section */}
      {actor.movie_credits?.cast?.length > 0 && (
        <View style={styles.modernSection}>
          <View
            style={[
              styles.sectionHeader,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <View>
              <Text style={styles.modernSectionHeading}>Filmography</Text>
              <View style={styles.accentLine} />
            </View>
            {actor.movie_credits.cast.length > 7 && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/pages/actordata/Filmography",
                    params: {
                      actorID: actor.id,
                      actorName: actor.name,
                    },
                  })
                }
              >
                <Text
                  style={{
                    color: "#E50914",
                    fontFamily: "BebasNeue",
                    fontSize: 18,
                  }}
                >
                  See All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            horizontal
            data={[...actor.movie_credits.cast, ...actor.tv_credits.cast]
              .sort((a: any, b: any) =>
                (b.release_date || b.first_air_date || "").localeCompare(
                  a.release_date || a.first_air_date || "",
                ),
              )
              .slice(0, 7)}
            renderItem={({ item }) => (
              <RenderMovieCard item={item} starColor="#E50914" />
            )}
            keyExtractor={(item, index) => item.id.toString() + index}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          />
        </View>
      )}

      {/* 📸 Photos Section */}
      {images.length > 0 && (
        <View style={styles.modernSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.modernSectionHeading}>Photos</Text>
            <View style={styles.accentLine} />
          </View>
          <View style={styles.galleryContainer}>
            {/* Split images into columns for masonry effect */}
            <View style={styles.column}>
              {images
                .filter((_, i) => i % 2 === 0)
                .map((item, index) => (
                  <TouchableOpacity
                    key={`left-${index}`}
                    style={[
                      styles.galleryItem,
                      { height: index % 3 === 0 ? 250 : 180 },
                    ]}
                    onPress={() =>
                      setSelectedImage(profilePoster + item.file_path)
                    }
                  >
                    <Image
                      source={{
                        uri: profilePoster + item.file_path,
                      }}
                      style={styles.galleryImage}
                    />
                  </TouchableOpacity>
                ))}
            </View>
            <View style={styles.column}>
              {images
                .filter((_, i) => i % 2 !== 0)
                .map((item, index) => (
                  <TouchableOpacity
                    key={`right-${index}`}
                    style={[
                      styles.galleryItem,
                      { height: index % 2 === 0 ? 200 : 280 },
                    ]}
                    onPress={() =>
                      setSelectedImage(profilePoster + item.file_path)
                    }
                  >
                    <Image
                      source={{
                        uri: profilePoster + item.file_path,
                      }}
                      style={styles.galleryImage}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      )}

      {/* 🖼️ Full Screen Image Viewer */}
      <ImageViewer
        visible={selectedImage !== null}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

type BioSectionProps = {
  biography?: string;
};

function BiographySection({ biography }: BioSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!biography) {
    return (
      <View style={styles.modernSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.modernSectionHeading}>Biography</Text>
          <View style={styles.accentLine} />
        </View>
        <Text style={styles.modernBiography}>
          No biography available for this actor.
        </Text>
      </View>
    );
  }

  const preview = biography.slice(0, 500);

  return (
    <View style={styles.modernSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.modernSectionHeading}>Biography</Text>
        <View style={styles.accentLine} />
      </View>

      <Text style={styles.modernBiography}>
        {expanded ? biography : preview}
        {biography.length > 500 && !expanded && "... "}
      </Text>

      {biography.length > 500 && (
        <Pressable
          style={styles.readMoreContainer}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.readMore}>
            {expanded ? "Show less" : "Read more"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  headerSection: {
    width: width,
    height: height * 0.7,
    borderRadius: 30,
    overflow: "hidden",
  },
  coverImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerActions: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  actionButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoOverlay: {
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  actorName: {
    color: "#fff",
    fontSize: 45,
    fontFamily: "BebasNeue",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  subInfo: {
    color: "#bbb",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "RobotoSlab",
    fontWeight: "bold",
    marginTop: 4,
  },
  modernSection: {
    marginTop: 30,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modernSectionHeading: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "BebasNeue",
    letterSpacing: 1.2,
  },
  accentLine: {
    height: 3,
    width: 40,
    backgroundColor: "#E50914",
    marginTop: 4,
    borderRadius: 2,
  },
  modernBiography: {
    color: "#aaa",
    fontSize: 15,
    fontFamily: "RobotoSlab",
    lineHeight: 24,
    paddingHorizontal: 20,
    textAlign: "left",
  },
  readMoreContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  readMore: {
    marginTop: 4,
    color: "#FFD700",
    fontWeight: "600",
  },
  galleryContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  galleryItem: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    padding: 8,
  },
});
