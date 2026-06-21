import { Share } from "react-native";
import { slugify } from "./slugify";
import { encodeId } from "./hash";

/**
 * Utility function to handle sharing for movies, tv shows, and actors.
 * @param type - The type of content ("movie", "tv", or "actor")
 * @param data - The content data object
 * @param webSiteUrl - Base website URL from store
 * @param config - Remote config from store
 */
export const onShare = async (
  type: "movie" | "tv" | "actor" | "tv_season",
  data: any,
  webSiteUrl: string,
  config: any,
  extraData?: any
) => {
  try {
    if (!data || !webSiteUrl) return;

    let shareUrl = "";
    let shareMessage = "";

    if (type === "movie") {
      const year = data.release_date ? data.release_date.split("-")[0] : "";
      const titleSlug = (slugify(data.title) || "") + (year ? `-${year}` : "");
      shareUrl = `${webSiteUrl}${config?.movie_slug || "/movie/"}${encodeId(data.id)}/${titleSlug || ""}`;

      shareMessage = config?.share_text_template_movie
        ? config.share_text_template_movie
            .replace("{title}", data?.title || "this movie")
            .replace("{url}", shareUrl)
        : `Check out ${data?.title} on Movie Night!\n${shareUrl}`;
    } else if (type === "tv") {
      const year = data.first_air_date ? data.first_air_date.split("-")[0] : "";
      const titleSlug = (slugify(data.name) || "") + (year ? `-${year}` : "");
      shareUrl = `${webSiteUrl}${config?.tv_slug || "/tv/"}${encodeId(data.id)}/${titleSlug || ""}`;

      shareMessage = config?.share_text_template_tv
        ? config.share_text_template_tv
            .replace("{title}", data?.name || "this tv show")
            .replace("{url}", shareUrl)
        : `Check out ${data?.name} on Movie Night!\n${shareUrl}`;
    } else if (type === "tv_season") {
      // For seasons: data is the series, extraData is the season
      const series = data;
      const season = extraData;
      if (!series || !season) return;
      
      shareUrl = `${webSiteUrl}${config?.tv_slug || "/tv/"}season/${series.id}/${season.season_number}`;
      
      shareMessage = config?.share_text_template_tv
        ? config.share_text_template_tv
            .replace("{title}", series?.name || "this tv show")
            .replace("{url}", shareUrl)
        : `Check out ${series?.name} on Movie Night!\n${shareUrl}`;
    } else if (type === "actor") {
      const titleSlug = slugify(data.name) || "";
      shareUrl = `${webSiteUrl}${config?.actor_slug || "/actor/"}${encodeId(data.id)}/${titleSlug || ""}`;

      shareMessage = config?.share_text_template_actor
        ? config.share_text_template_actor
            .replace("{name}", data?.name || "this actor")
            .replace("{url}", shareUrl)
        : `🎬 Check out ${data?.name} on Movie Night!\n\n${shareUrl}`;
    }

    await Share.share({
      title: "Movie Night",
      message: shareMessage,
    });
  } catch (error: any) {
    console.error("Error sharing content:", error.message);
  }
};
