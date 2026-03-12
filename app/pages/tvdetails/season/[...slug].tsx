import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { fetchTvSeasonDetails, getTvById } from "../../../api/main";
import generateMovieAvatar from "../../../lib/generateMovieAvatar";
import TrailerModal from "@/app/components/ShowTrailer";
import { useStore } from "../../../store/store";
import StreamModel from "../../../components/StreamModel";
import ImageViewer from "@/app/components/ImageViewer";
import { getImageUrl } from "@/app/lib/getImageUrl";
import { onShare as centralOnShare } from "@/app/lib/onShare";
const { width, height } = Dimensions.get("window");

export default function SeasonDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  const router = useRouter();
  const [season, setSeason] = useState<any>(null);
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showStreams, setShowStreams] = useState(false);
  const { webSiteUrl, config, dataSavermood } = useStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { posterImage, backdropImage: stillBase } = getImageUrl(
    dataSavermood,
    "detail",
  );

  const onShare = React.useCallback(async () => {
    if (!series || !season) return;
    await centralOnShare("tv_season", series, webSiteUrl, config, season);
  }, [series, season, webSiteUrl, config]);

  const fallbackSvg = React.useMemo(() => {
    if (!season) return "";
    return generateMovieAvatar(
      season.name || `Season ${season.season_number}`,
    );
  }, [season]);

  const hasTrailer = React.useMemo(() => {
    return Boolean(
      season?.videos?.results?.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube",
      )?.key || season?.videos?.results?.[0]?.key,
    );
  }, [season]);

  const episodeCount = React.useMemo(
    () => season?.episodes?.length ?? 0,
    [season],
  );
  const airYear = React.useMemo(
    () => (season?.air_date ? season.air_date.substring(0, 4) : null),
    [season],
  );

  const tvID = Array.isArray(slug) && slug.length >= 1 ? slug[0] : undefined;
  const seasonNumber =
    Array.isArray(slug) && slug.length >= 2 ? slug[1] : undefined;
  useEffect(() => {
    async function load() {
      if (!tvID || seasonNumber === undefined) {
        setLoading(false);
        return;
      }
      try {
        const [seasonData, seriesData] = await Promise.all([
          fetchTvSeasonDetails(tvID, seasonNumber),
          getTvById(tvID),
        ]);
        setSeason(seasonData);
        setSeries(seriesData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tvID, seasonNumber]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!season || !series) {
    return (
      <View style={styles.center}>
        <Text style={styles.errText}>Season not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* 🎬 Backdrop + Poster (same as [tvID]) */}
      <View style={styles.posterSection}>
        <ImageBackground
          source={{ uri: stillBase + series.backdrop_path }}
          style={styles.cover}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
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

          <View style={styles.posterWrapper}>
            {!imgError ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setSelectedImage(posterImage + series.poster_path)
                }
                style={styles.movieposter}
              >
                <Image
                  source={{
                    uri: posterImage + series.poster_path,
                  }}
                  style={styles.movieposter}
                  onError={() => setImgError(true)}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.posterPlaceholder}>
                <SvgXml xml={fallbackSvg} width="100%" height="100%" />
              </View>
            )}
          </View>
        </ImageBackground>
      </View>

      {/* 🎞 Title row (series + season) */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {series.name} — {season.name || `Season ${season.season_number}`}
        </Text>
      </View>

      {/* 📅 Metadata pills (same as [tvID] metaRow) */}
      <View style={styles.metaRow}>
        {airYear && <Text style={styles.metaBox}>{airYear}</Text>}
        <Text style={styles.metaBox}>{episodeCount} Episodes</Text>
        <Text style={styles.metaBox}>
          <Ionicons name="star" size={15} color="#FFD700" />{" "}
          {season.vote_average?.toFixed(1) ?? "—"}/10
        </Text>
      </View>

      {/* 🧾 Overview (same as [tvID]) */}
      {(season.overview || "").trim() ? (
        <>
          <Text style={styles.sectionHeading}>OVERVIEW</Text>
          <Text style={styles.overview}>{season.overview}</Text>
        </>
      ) : null}

      {/* ▶️ Watch Trailer (same as [tvID]) */}
      {hasTrailer && (
        <View
          style={{
            alignItems: "flex-start",
            marginBottom: 20,
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowTrailer(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#E50914",
              paddingVertical: 12,
              paddingHorizontal: 25,
              borderRadius: 30,
              elevation: 5,
            }}
          >
            <Ionicons name="play-circle-outline" size={24} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: 17,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Watch Trailer
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 📺 Episodes (same section pattern as Cast/Seasons on [tvID]) */}
      <View style={styles.castSection}>
        <Text style={styles.castTitle}>Episodes</Text>
        <View style={styles.underline} />
        {(season.episodes || []).map((ep: any) => (
          <TouchableOpacity
            key={ep.id}
            style={styles.episodeRow}
            activeOpacity={0.7}
            onPress={() => {
              setShowStreams(true);
            }}
          >
            <View style={styles.episodeStillWrap}>
              {ep.still_path ? (
                <Image
                  source={{ uri: stillBase + ep.still_path }}
                  style={styles.episodeStill}
                />
              ) : (
                <View
                  style={[styles.episodeStill, styles.episodeStillPlaceholder]}
                >
                  <Ionicons name="film-outline" size={32} color="#444" />
                </View>
              )}
              <View style={styles.episodeBadge}>
                <Text style={styles.episodeBadgeText}>
                  E{ep.episode_number}
                </Text>
              </View>
            </View>
            <View style={styles.episodeContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.episodeTitle} numberOfLines={2}>
                  {ep.name}
                </Text>
                <View
                  style={{
                    alignItems: "flex-end",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  {ep.runtime && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons name="time-outline" size={12} color="#E50914" />
                      <Text style={styles.episodeMeta}>{ep.runtime} min</Text>
                    </View>
                  )}
                  {ep.air_date && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={12}
                        color="#fff"
                      />
                      <Text style={styles.episodeMeta}>{ep.air_date}</Text>
                    </View>
                  )}
                </View>
              </View>
              {ep.overview ? (
                <Text style={styles.episodeOverview} numberOfLines={2}>
                  {ep.overview}
                </Text>
              ) : null}
              {ep.vote_average > 0 && (
                <View style={styles.episodeRating}>
                  <Ionicons name="star" size={12} color="#E50914" />
                  <Text style={styles.episodeRatingText}>
                    {ep.vote_average.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TrailerModal
        visible={showTrailer}
        onClose={() => setShowTrailer(false)}
        movie={season}
      />
      <StreamModel
        contentId={tvID ? parseInt(tvID) : 0}
        contentType="tv"
        seasonNumber={season.season_number}
        episodeNumber={1}
        visible={showStreams}
        onClose={() => setShowStreams(false)}
      />
      <ImageViewer
        visible={selectedImage !== null}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E50914",
    borderRadius: 8,
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  posterSection: {
    flex: 1,
    width: "100%",
  },
  cover: {
    width: width,
    height: height * 0.35,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerActions: {
    position: "absolute",
    top: 35,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  posterWrapper: {
    alignItems: "flex-start",
    marginLeft: 25,
    marginBottom: -70,
  },
  movieposter: {
    width: 150,
    height: 220,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  posterPlaceholder: {
    width: 150,
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 100,
    marginHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontFamily: "BebasNeue",
    letterSpacing: 1,
    flex: 1,
    marginRight: 10,
  },
  sectionHeading: {
    color: "#E50914",
    fontSize: 30,
    letterSpacing: 2,
    fontFamily: "BebasNeue",
    marginTop: 10,
    marginHorizontal: 20,
  },
  overview: {
    color: "#ccc",
    fontSize: 15,
    fontFamily: "RobotoSlab",
    marginTop: 8,
    marginHorizontal: 20,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  metaBox: {
    backgroundColor: "#E5091440",
    borderColor: "#E50914",
    borderWidth: 1,
    color: "#fff",
    fontFamily: "BebasNeue",
    letterSpacing: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
    fontSize: 15,
  },
  castSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  castTitle: {
    fontFamily: "BebasNeue",
    color: "#fff",
    fontSize: 35,
    letterSpacing: 1,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  underline: {
    height: 3,
    width: 80,
    backgroundColor: "#E50914",
    marginTop: 0,
    marginLeft: 16,
    marginBottom: 12,
    borderRadius: 2,
  },
  episodeRow: {
    flexDirection: "column",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  episodeStillWrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    position: "relative",
  },
  episodeStill: {
    width: "100%",
    height: "100%",
  },
  episodeStillPlaceholder: {
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  episodeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#E50914",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  episodeBadgeText: {
    color: "#fff",
    fontFamily: "RobotoSlab",
    fontSize: 11,
    fontWeight: "bold",
  },
  episodeContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  episodeTitle: {
    color: "#fff",
    fontFamily: "RobotoSlab",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  episodeMeta: {
    color: "#888",
    fontFamily: "RobotoSlab",
    fontSize: 12,
    marginBottom: 4,
  },
  episodeOverview: {
    color: "#aaa",
    fontFamily: "RobotoSlab",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  episodeRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  episodeRatingText: {
    color: "#E50914",
    fontSize: 12,
    fontFamily: "RobotoSlab",
  },
});
