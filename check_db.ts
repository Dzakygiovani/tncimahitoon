import Database from "better-sqlite3";

const db = new Database("database.sqlite");

try {
  const columns = db.prepare("PRAGMA table_info(users)").all();
  console.log("Users table columns:", columns);
} catch (error) {
  console.error("Error checking schema:", error);
}
