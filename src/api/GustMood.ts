import { getDB } from "../lib/db";

// 🛠️ إنشاء جدول الـ Bookmarks
export async function createBookmarkTable() {
  const database = await getDB();
  if (!database) return;

  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS bookmark (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movieID TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        overview TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        type TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error("❌ Error creating bookmark table:", error);
  }
}

// ➕ إضافة Bookmark جديد
export async function addBookmark(movie: {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  type: string;
  status: string;
}) {
  const database = await getDB();
  if (!database) return;

  try {
    await database.runAsync(
      `INSERT OR IGNORE INTO bookmark (movieID, title, overview, poster_path, backdrop_path, type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.id.toString(),
        movie.title,
        movie.overview,
        movie.poster_path,
        movie.backdrop_path,
        movie.type,
        movie.status,
      ],
    );
  } catch (error) {
    console.error("❌ Error adding bookmark:", error);
  }
}

// 📥 جلب كل الـ Bookmarks
export async function getBookmarks() {
  const database = await getDB();
  if (!database) return [];

  try {
    const rows = await database.getAllAsync<any>(
      `SELECT * FROM bookmark ORDER BY id DESC`,
    );
    return rows;
  } catch (error) {
    console.error("❌ Error fetching bookmarks:", error);
    return [];
  }
}

// ❌ حذف Bookmark واحد
export async function removeBookmark(id: string) {
  const database = await getDB();
  if (!database) return;

  try {
    await database.runAsync(`DELETE FROM bookmark WHERE movieID = ?`, [id]);
  } catch (error) {
    console.error("❌ Error removing bookmark:", error);
  }
}

// 🗑️ حذف كل الـ Bookmarks
export async function clearBookmarks() {
  const database = await getDB();
  if (!database) return;

  try {
    await database.runAsync(`DELETE FROM bookmark`);
  } catch (error) {
    console.error("❌ Error clearing bookmarks:", error);
  }
}

// ✅ التحقق إذا الفيلم موجود بالفعل وجلب الحالة
export async function isBookmarked(movieID: string) {
  const database = await getDB();
  if (!database) return null;

  try {
    const row = await database.getFirstAsync<{ status: string }>(
      `SELECT status FROM bookmark WHERE movieID = ? LIMIT 1`,
      [movieID],
    );

    return row ? row.status : null;
  } catch (error) {
    console.error("❌ Error checking bookmark:", error);
    return null;
  }
}
// 🔄 تحديث حالة الـ Bookmark
export async function updateBookmarkStatus(movieID: string, status: string) {
  const database = await getDB();
  if (!database) return;

  try {
    await database.runAsync(
      `UPDATE bookmark SET status = ? WHERE movieID = ?`,
      [status, movieID],
    );
  } catch (error) {
    console.error("❌ Error updating bookmark status:", error);
  }
}
