import { getDB } from "@/src/lib/db";

export async function CreatTableNightGuide() {
  const database = await getDB();
  if (!database) return;
  try {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS ai_messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        movies_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
  } catch (err) {
    console.error("❌ Error creating ai_messages table:", err);
  }
}

export async function addMessage(role: string, message: string, movies?: any[]) {
  const database = await getDB();
  if (!database) return;
  try {
    const moviesJson = movies && movies.length > 0 ? JSON.stringify(movies) : null;
    await database.runAsync(
      `INSERT INTO ai_messages (role, content, movies_json) VALUES(?, ?, ?)`,
      [role, message, moviesJson],
    );
  } catch (err) {
    console.error("❌ Error adding to ai_message:", err);
  }
}

export async function getMessages() {
  const database = await getDB();
  if (!database) return [];

  try {
    const rows = await database.getAllAsync<any>(
      `SELECT role, content, movies_json FROM ai_messages ORDER BY id ASC`,
    );
    return rows.map((row: any) => ({
      role: row.role,
      content: row.content,
      movies: row.movies_json ? JSON.parse(row.movies_json) : undefined,
    }));
  } catch (error) {
    console.error("❌ Error fetching ai_message:", error);
    return [];
  }
}

export async function clearMessages() {
  const database = await getDB();
  if (!database) return;

  try {
    await database.runAsync(`DELETE FROM ai_messages`);
  } catch (error) {
    console.error("❌ Error clearing ai_messages:", error);
  }
}

