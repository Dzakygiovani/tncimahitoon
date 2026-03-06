import Database from "better-sqlite3";

const db = new Database("database.sqlite");

try {
  const columns = db.prepare("PRAGMA table_info(users)").all() as any[];
  const hasCreatedAt = columns.some(col => col.name === 'created_at');
  
  if (!hasCreatedAt) {
    console.log("Adding created_at column to users table...");
    // Add column without default value first to avoid SQLite error
    db.prepare("ALTER TABLE users ADD COLUMN created_at DATETIME").run();
    
    // Update existing rows with current timestamp
    console.log("Updating existing rows...");
    db.prepare("UPDATE users SET created_at = datetime('now') WHERE created_at IS NULL").run();
    
    console.log("Column added and populated successfully.");
  } else {
    console.log("created_at column already exists.");
  }
} catch (error) {
  console.error("Migration failed:", error);
}
