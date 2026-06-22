import * as SQLite from "expo-sqlite";

// 🧱 اسم قاعدة البيانات
const DB_NAME = "Movie_Night.db";
let db: SQLite.SQLiteDatabase | null = null;

// ✅ فتح قاعدة البيانات بأمان
export async function getDB(): Promise<SQLite.SQLiteDatabase | null> {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    return db;
  } catch (error) {
    console.error("❌ Failed to open database:", error);
    return null;
  }
}
