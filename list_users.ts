import Database from "better-sqlite3";

const db = new Database("database.sqlite");

try {
  const users = db.prepare("SELECT * FROM users").all();
  console.log("Users:", users);
} catch (error) {
  console.error("Error fetching users:", error);
}
