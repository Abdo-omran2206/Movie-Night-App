import { router } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import generateMovieAvatar from "../../lib/generateMovieAvatar";
import { SvgXml } from "react-native-svg";
import { useStore } from "@/app/store/store";
import { getImageUrl } from "@/app/lib/getImageUrl";

import { Cast } from "../../constant/interfaces";

type CastProps = {
  item: Cast;
};

const RenderCastCard = React.memo(({ item }: CastProps) => {
  const [imgError, setImgError] = React.useState(false);
  const { dataSavermood } = useStore();

  const { castImage: posterUrl } = getImageUrl(dataSavermood, "card");

  const fallbackAvatarSvg = React.useMemo(() =>
    generateMovieAvatar(item.name || "Untitled Actor", 512),
    [item.name]
  );

  const handlePress = React.useCallback(() => {
    router.push({
      pathname: "/pages/actordata/[actorID]",
      params: { actorID: item.id.toString() },
    });
  }, [item.id]);

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        {!imgError && item.profile_path ? (
          <Image
            source={{ uri: posterUrl + item.profile_path }}
            style={styles.image}
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={{ width: 140, height: 180, overflow: "hidden" }}>
            <SvgXml xml={fallbackAvatarSvg} width="100%" height="100%" />
          </View>
        )}
        <View style={styles.textField}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.character}>{item.character}</Text>
          <Text style={styles.department}>{item.known_for_department}</Text>
        </View>
      </View>
    </Pressable>
  );
});

RenderCastCard.displayName = "RenderCastCard";

export default RenderCastCard;

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    margin: 10,
    backgroundColor: "#131313ff",
    marginHorizontal: 10,
    width: 140,
    borderRadius: 5,
    paddingBottom: 10,
  },
  image: {
    width: 140,
    height: 180,
    borderRadius: 10,
    marginBottom: 6,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  character: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
  },
  department: {
    color: "gray",
    fontSize: 11,
    textAlign: "center",
  },
  textField: {
    padding: 5,
  },
});
