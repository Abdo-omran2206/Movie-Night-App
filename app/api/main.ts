const api_key = process.env.EXPO_PUBLIC_API_KEY;
const base_url = "https://api.themoviedb.org/3";

// Reusable fetch function
export async function fetchMovies(endpoint: string) {
  const separator = endpoint.includes("?") ? "&" : "?";
  try {
    const response = await fetch(
      `${base_url}${endpoint}${separator}&api_key=${api_key}&page=1`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export async function search(query: string, page: number) {
  try {
    const response = await fetch(
      `${base_url}/search/multi?api_key=${api_key}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`
    );

    const data = await response.json();

    const filteredResults = data.results?.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv"
    );

    return filteredResults || [];
  } catch (error) {
    console.error("Error searching movies/tv:", error);
    return [];
  }
}

export async function getMovieReviews(movieId: string) {
  try {
    const response = await fetch(
      `${base_url}/movie/${movieId}/reviews?api_key=${api_key}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews for movie ID: ${movieId}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return [];
  }
}

export async function getTvReviews(tvId: string) {
  try {
    const response = await fetch(
      `${base_url}/tv/${tvId}/reviews?api_key=${api_key}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews for TV ID: ${tvId}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching TV reviews:", error);
    return [];
  }
}

export async function getMovieById(movieid: string) {
  try {
    const response = await fetch(
      `${base_url}/movie/${movieid}?api_key=${api_key}&language=en-US&append_to_response=credits,similar,videos,recommendations`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie with ID: ${movieid}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function getCollectionDetails(collectionId: string) {
  try {
    const response = await fetch(
      `${base_url}/collection/${collectionId}?api_key=${api_key}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch collection for ID: ${collectionId}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching collection details:", error);
    return null;
  }
}
export async function getActorById(actorId: string) {
  try {
    const response = await fetch(
      `${base_url}/person/${actorId}?api_key=${api_key}&language=en-US&append_to_response=movie_credits,tv_credits,images`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch actor with ID: ${actorId}`);
    }

    const data = await response.json();
    return data; // 🧑‍🎤 بيرجع تفاصيل الممثل + الأفلام + الصور
  } catch (error) {
    console.error("Error fetching actor details:", error);
    return null;
  }
}

export async function getActorImages(actorId: string) {
  try {
    const response = await fetch(
      `${base_url}/person/${actorId}/images?api_key=${api_key}`
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
  try {
    // ✅ Fetch TV show details with credits, videos, and similar shows
    const response = await fetch(
      `${base_url}/tv/${tvID}?api_key=${api_key}&append_to_response=credits,videos,similar,recommendations`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV show details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching TV details:", error);
    throw error;
  }
}

export async function fetchTvSeasonDetails(tvID: string, seasonNumber: string | number) {
  try {
    const response = await fetch(
      `${base_url}/tv/${tvID}/season/${seasonNumber}?api_key=${api_key}&language=en-US&append_to_response=credits,videos,images`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch TV season details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TV season details:", error);
    return null;
  }
}

// 🌍 Auto map region to default language
const regionLanguageMap: Record<string, string> = {
  US: "en",
  GB: "en",
  EG: "ar",
  SA: "ar",
  FR: "fr",
  JP: "ja",
  KR: "ko",
  IN: "hi",
  CN: "zh",
  DE: "de",
  ES: "es",
  IT: "it",
  RU: "ru",
  TR: "tr",
  BR: "pt",
  MX: "es",
};

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
    if (["popular", "top_rated", "upcoming", "now_playing"].includes(category)) {
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

