import { supabase } from "./supabase";

/* =========================
   🔐 Auth Helper
========================= */
async function requireUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user ?? null;
}

/* =========================
   ➕ Add / Update Bookmark
========================= */
export async function addBookmark(movie: {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  type: "movie" | "tv";
  status: "Watching" | "Watch Later" | "Completed" | "Dropped";
}) {
  try {
    const user = await requireUser();
    if (!user) return;

    // 1️⃣ Upsert movie
    const { error: movieError } = await supabase
      .from("movies")
      .upsert({
        movie_id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        type: movie.type,
      });

    if (movieError) throw movieError;

    // 2️⃣ Upsert bookmark
    const { error: bookmarkError } = await supabase
      .from("bookmark")
      .upsert(
        {
          user_id: user.id,
          movie_id: movie.id,
          status: movie.status,
        },
        { onConflict: "user_id,movie_id" }
      );

    if (bookmarkError) throw bookmarkError;
  } catch (error) {
    console.error("❌ Add bookmark error:", error);
  }
}

/* =========================
   📥 Get All Bookmarks
========================= */
export async function getBookmarks() {
  try {
    const user = await requireUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("bookmark")
      .select(`
        status,
        created_at,
        movies (
          movie_id,
          title,
          overview,
          poster_path,
          backdrop_path,
          type
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Normalize: flatten the movies object and map movie_id to movieID for consistency
    return (data ?? []).map((item: any) => ({
      movieID: item.movies.movie_id,
      title: item.movies.title,
      overview: item.movies.overview,
      poster_path: item.movies.poster_path,
      backdrop_path: item.movies.backdrop_path,
      type: item.movies.type,
      status: item.status,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error("❌ Fetch bookmarks error:", error);
    return [];
  }
}

/* =========================
   ❌ Remove One Bookmark
========================= */
export async function removeBookmark(movieID: number | string) {
  try {
    const user = await requireUser();
    if (!user) return;

    const numericID = typeof movieID === "string" ? parseInt(movieID) : movieID;

    const { error } = await supabase
      .from("bookmark")
      .delete()
      .eq("movie_id", numericID)
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Remove bookmark error:", error);
  }
}

/* =========================
   🗑️ Clear All Bookmarks
========================= */
export async function clearBookmarks() {
  try {
    const user = await requireUser();
    if (!user) return;

    const { error } = await supabase
      .from("bookmark")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Clear bookmarks error:", error);
  }
}

/* =========================
   ✅ Check If Bookmarked
========================= */
export async function isBookmarked(movieID: number | string) {
  try {
    const user = await requireUser();
    if (!user) return null;

    const numericID = typeof movieID === "string" ? parseInt(movieID) : movieID;

    const { data, error } = await supabase
      .from("bookmark")
      .select("status")
      .eq("movie_id", numericID)
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data?.status ?? null;
  } catch (error) {
    console.error("❌ Bookmark check error:", error);
    return null;
  }
}

/* =========================
   🔄 Update Status
========================= */
export async function updateBookmarkStatus(
  movieID: number | string,
  status: "Watching" | "Watch Later" | "Completed" | "Dropped"
) {
  try {
    const user = await requireUser();
    if (!user) return;

    const numericID = typeof movieID === "string" ? parseInt(movieID) : movieID;

    const { error } = await supabase
      .from("bookmark")
      .update({ status })
      .eq("movie_id", numericID)
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Update bookmark error:", error);
  }
}
