import fetchWithCache from "../lib/CachManger";
import { base_url, regionLanguageMap } from "../types/main";

const api_key = process.env.EXPO_PUBLIC_API_KEY;


// Reusable fetch function with caching
export function fetchMovies(endpoint: string) {
  const separator = endpoint.includes("?") ? "&" : "?";

  return fetchWithCache(
    `movies:${endpoint}`,
    `${base_url}${endpoint}${separator}api_key=${api_key}&page=1`
  );
}

export async function search(query: string, page: number) {
  try {
    const response = await fetch(
      `${base_url}/search/multi?api_key=${api_key}&language=en-US&query=${encodeURIComponent(
        query,
      )}&page=${page}&include_adult=false`,
    );

    const data = await response.json();

    const filteredResults = data.results?.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv",
    );

    return filteredResults || [];
  } catch (error) {
    console.error("Error searching movies/tv:", error);
    return [];
  }
}

export async function getMovieReviews(movieId: string) {
  return fetchWithCache(
    `reviews:${movieId}`,
    `${base_url}/movie/${movieId}/reviews?api_key=${api_key}`,
  );
}

export async function getTvReviews(tvId: string) {
  return fetchWithCache(
    `reviews:${tvId}`,
    `${base_url}/tv/${tvId}/reviews?api_key=${api_key}`,
  );
}

export async function getMovieById(movieid: string) {
  return fetchWithCache(
    `movie:${movieid}`,
    `${base_url}/movie/${movieid}?api_key=${api_key}&append_to_response=credits,videos,similar,recommendations`,
  );
}

export async function getCollectionDetails(collectionId: string) {
  return fetchWithCache(
    `collection:${collectionId}`,
    `${base_url}/collection/${collectionId}?api_key=${api_key}&language=en-US`,
  );
}

export async function getActorById(actorId: string) {
  return fetchWithCache(
    `actor:${actorId}`,
    `${base_url}/person/${actorId}?api_key=${api_key}&append_to_response=movie_credits,tv_credits,images`
  );
}

export async function getActorImages(actorId: string) {
  try {
    const response = await fetch(
      `${base_url}/person/${actorId}/images?api_key=${api_key}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch images for actor ID: ${actorId}`);
    }

    const data = await response.json();
    return data.profiles || [];
  } catch (error) {
    console.error("Error fetching actor images:", error);
    return [];
  }
}

export async function getTvById(tvID: string) {
  return fetchWithCache(
    `tv:${tvID}`,
    `${base_url}/tv/${tvID}?api_key=${api_key}&append_to_response=credits,videos,similar,recommendations`
  );
}

export async function fetchTvSeasonDetails(
  tvID: string,
  seasonNumber: string | number
) {
  return fetchWithCache(
    `tv:${tvID}:season:${seasonNumber}`,
    `${base_url}/tv/${tvID}/season/${seasonNumber}?api_key=${api_key}&language=en-US&append_to_response=credits,videos,images`
  );
}


export async function fetchFilter({
  type = "movie", // movie | tv
  category = "popular", // popular | top_rated | upcoming | now_playing
  region = "US", // e.g. US, EG, JP, FR
  genre,
  year,
  page = 1,
}: {
  type?: "movie" | "tv";
  category?: "popular" | "top_rated" | "upcoming" | "now_playing";
  region?: string;
  genre?: string;
  year?: string;
  page?: number;
}) {
  try {
    const language = regionLanguageMap[region] || "en";
    let endpoint = "";
    let params: Record<string, string> = {
      api_key: api_key || "",
      region: region || "US",
      language: language || "en",
      page: String(page),
    };

    // 🧭 Use discover endpoint for better filtering and localization
    if (
      ["popular", "top_rated", "upcoming", "now_playing"].includes(category)
    ) {
      endpoint = `discover/${type}`;
      if (category === "popular") params["sort_by"] = "popularity.desc";
      if (category === "top_rated") params["sort_by"] = "vote_average.desc";
      if (category === "now_playing")
        params["release_date.lte"] = new Date().toISOString().split("T")[0];
      if (category === "upcoming")
        params["release_date.gte"] = new Date().toISOString().split("T")[0];
    } else {
      endpoint = `discover/${type}`;
    }

    // 🎭 Add genre filtering
    if (genre) {
      params["with_genres"] = genre;
    }

    // 📅 Add year filtering
    if (year) {
      if (type === "movie") {
        params["primary_release_year"] = year;
      } else {
        params["first_air_date_year"] = year;
      }
    }

    // 🌐 Add language hint
    params["with_original_language"] = language;

    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value || "")}`)
      .join("&");

    const url = `${base_url}/${endpoint}?${query}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB Error: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("❌ fetchFilter error:", error);
    return { results: [] };
  }
}
