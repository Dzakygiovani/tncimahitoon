import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");
db.pragma('journal_mode = WAL'); // Enable WAL mode for better concurrency

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    type TEXT, -- 'comic' or 'novel'
    cover_image TEXT,
    author_name TEXT,
    author_batch TEXT,
    genre TEXT,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_id INTEGER,
    page_number INTEGER,
    content TEXT, -- image base64 for comic, text for novel
    FOREIGN KEY(work_id) REFERENCES works(id)
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    FOREIGN KEY(work_id) REFERENCES works(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    UNIQUE(work_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_id INTEGER,
    user_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(work_id) REFERENCES works(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  -- Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_works_type ON works(type);
  CREATE INDEX IF NOT EXISTS idx_works_genre ON works(genre);
  CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at);
  CREATE INDEX IF NOT EXISTS idx_ratings_work_id ON ratings(work_id);
  CREATE INDEX IF NOT EXISTS idx_comments_work_id ON comments(work_id);
`);

// Migration: Add columns if they don't exist
try {
  const columns = db.prepare("PRAGMA table_info(users)").all() as any[];
  
  const hasLastLogin = columns.some(col => col.name === 'last_login');
  if (!hasLastLogin) {
    db.prepare("ALTER TABLE users ADD COLUMN last_login DATETIME").run();
  }

  const hasCreatedAt = columns.some(col => col.name === 'created_at');
  if (!hasCreatedAt) {
    db.prepare("ALTER TABLE users ADD COLUMN created_at DATETIME").run();
    db.prepare("UPDATE users SET created_at = datetime('now') WHERE created_at IS NULL").run();
  }

  // Check works table
  const worksColumns = db.prepare("PRAGMA table_info(works)").all() as any[];
  const worksHasCreatedAt = worksColumns.some(col => col.name === 'created_at');
  if (!worksHasCreatedAt) {
    db.prepare("ALTER TABLE works ADD COLUMN created_at DATETIME").run();
    db.prepare("UPDATE works SET created_at = datetime('now') WHERE created_at IS NULL").run();
  }
  
  const worksHasViews = worksColumns.some(col => col.name === 'views');
  if (!worksHasViews) {
    db.prepare("ALTER TABLE works ADD COLUMN views INTEGER DEFAULT 0").run();
  }

  // Check comments table
  const commentsColumns = db.prepare("PRAGMA table_info(comments)").all() as any[];
  const commentsHasCreatedAt = commentsColumns.some(col => col.name === 'created_at');
  if (!commentsHasCreatedAt) {
    db.prepare("ALTER TABLE comments ADD COLUMN created_at DATETIME").run();
    db.prepare("UPDATE comments SET created_at = datetime('now') WHERE created_at IS NULL").run();
  }
} catch (error) {
  console.error("Migration error:", error);
}

// Add initial admin if not exists
const checkAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get("2411075");
if (!checkAdmin) {
  const hashedPassword = bcrypt.hashSync("akurareti20090627", 10);
  db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)").run(
    "2411075",
    hashedPassword,
    "admin"
  );
}

// Reset specific user accounts (optional, can be removed if not needed)
db.prepare("DELETE FROM users WHERE email IN (?, ?)").run(
  "2411075@cimahi.tarunanusantara.sch.id",
  "2410880@cimahi.tarunanusantara.sch.id"
);

async function startServer() {
  const app = express();
  app.set('trust proxy', 1); // Trust first proxy (required for rate limiter behind proxy)
  const PORT = 3000;

  // Rate limiter for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: "Terlalu banyak percobaan login, silakan coba lagi nanti." }
  });

  app.use(express.json({ limit: '50mb' }));

  // Auth API
  app.post("/api/login", authLimiter, (req, res) => {
    const { email, password, isAdmin } = req.body;

    if (isAdmin) {
      // STRICT CHECK: Only allow ID "2411075"
      if (email !== "2411075") {
         return res.status(401).json({ success: false, message: "ID Admin tidak dikenali." });
      }

      const adminUser = db.prepare("SELECT * FROM users WHERE email = ? AND role = 'admin'").get("2411075");
      
      // Check if password matches strict requirement or existing hash
      const isPasswordCorrect = (password === "akurareti20090627") || 
                                (adminUser && bcrypt.compareSync(password, adminUser.password));

      if (!isPasswordCorrect) {
         return res.status(401).json({ success: false, message: "Password salah." });
      }

      // Login success
      if (adminUser) {
         // Ensure hash is up to date if plaintext was used
         if (password === "akurareti20090627" && !bcrypt.compareSync(password, adminUser.password)) {
             const newHash = bcrypt.hashSync(password, 10);
             db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newHash, adminUser.id);
         }
         
         db.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(adminUser.id);
         return res.json({ success: true, user: { id: adminUser.id, email: adminUser.email, role: 'admin' } });
      } else {
         // Create if missing
         const newHash = bcrypt.hashSync("akurareti20090627", 10);
         const info = db.prepare("INSERT INTO users (email, password, role, last_login) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").run("2411075", newHash, "admin");
         return res.json({ success: true, user: { id: info.lastInsertRowid, email: "2411075", role: 'admin' } });
      }
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "Akun belum terdaftar. Silakan buat password terlebih dahulu." });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Password salah" });
    }

    // Update last_login
    db.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);

    res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  });

  app.post("/api/register", authLimiter, (req, res) => {
    const { email, password } = req.body;

    if (!email.endsWith("@cimahi.tarunanusantara.sch.id")) {
      return res.status(400).json({ success: false, message: "Format email sekolah salah" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password minimal 8 karakter" });
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare("INSERT INTO users (email, password, role, last_login) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").run(
        email,
        hashedPassword,
        "user"
      );
      res.json({ success: true, message: "Password berhasil dibuat. Silakan login." });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ success: false, message: "Akun sudah memiliki password. Silakan login." });
      }
      res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
  });

  // User Management API (Admin only)
  app.get("/api/users", (req, res) => {
    try {
      // In a real app, verify admin token here
      // TEMPORARY: Including password hash as requested for debugging
      const users = db.prepare("SELECT id, email, password, role, created_at, last_login FROM users ORDER BY created_at DESC").all();
      res.json({ success: true, users });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil data user", error: error.message });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    // In a real app, verify admin token here
    try {
        // Prevent deleting the main admin
        const userToDelete = db.prepare("SELECT email FROM users WHERE id = ?").get(id);
        
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        if (userToDelete.email === "2411075") {
             return res.status(403).json({ success: false, message: "Tidak dapat menghapus akun admin utama." });
        }

        // Use transaction to ensure all related data is deleted
        const deleteUserTransaction = db.transaction((userId) => {
            db.prepare("DELETE FROM ratings WHERE user_id = ?").run(userId);
            db.prepare("DELETE FROM comments WHERE user_id = ?").run(userId);
            db.prepare("DELETE FROM users WHERE id = ?").run(userId);
        });

        deleteUserTransaction(id);

        res.json({ success: true, message: "User berhasil dihapus. User harus mendaftar ulang jika ingin login kembali." });
    } catch (error: any) {
        console.error("Delete user error:", error);
        res.status(500).json({ success: false, message: "Gagal menghapus user: " + error.message });
    }
  });



  // Works API
  app.get("/api/works", (req, res) => {
    const works = db.prepare(`
      SELECT w.*, 
      (SELECT AVG(rating) FROM ratings WHERE work_id = w.id) as avg_rating,
      (SELECT COUNT(*) FROM ratings WHERE work_id = w.id) as total_ratings
      FROM works w 
      ORDER BY created_at DESC
    `).all();
    res.json({ success: true, works });
  });

  app.get("/api/works/:id", (req, res) => {
    const work = db.prepare("SELECT * FROM works WHERE id = ?").get(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: "Karya tidak ditemukan" });
    
    const pages = db.prepare("SELECT * FROM pages WHERE work_id = ? ORDER BY page_number ASC").all(req.params.id);
    const comments = db.prepare(`
      SELECT c.*, u.email as user_email 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.work_id = ? 
      ORDER BY c.created_at DESC
    `).all(req.params.id);

    res.json({ success: true, work, pages, comments });
  });

  app.post("/api/works", (req, res) => {
    const { title, type, cover_image, author_name, author_batch, genre, pages } = req.body;
    
    try {
      const info = db.prepare(`
        INSERT INTO works (title, type, cover_image, author_name, author_batch, genre)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(title, type, cover_image, author_name, author_batch, genre);
      
      const workId = info.lastInsertRowid;
      
      const insertPage = db.prepare("INSERT INTO pages (work_id, page_number, content) VALUES (?, ?, ?)");
      pages.forEach((content: string, index: number) => {
        insertPage.run(workId, index + 1, content);
      });
      
      res.json({ success: true, workId });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengunggah karya" });
    }
  });

  app.post("/api/works/:id/rate", (req, res) => {
    const { userId, rating } = req.body;
    const workId = req.params.id;
    
    try {
      db.prepare(`
        INSERT INTO ratings (work_id, user_id, rating) 
        VALUES (?, ?, ?)
        ON CONFLICT(work_id, user_id) DO UPDATE SET rating = excluded.rating
      `).run(workId, userId, rating);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal memberi rating" });
    }
  });

  app.post("/api/works/:id/comment", (req, res) => {
    const { userId, content } = req.body;
    const workId = req.params.id;
    
    try {
      db.prepare("INSERT INTO comments (work_id, user_id, content) VALUES (?, ?, ?)").run(workId, userId, content);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengirim komentar" });
    }
  });

  app.post("/api/works/:id/view", (req, res) => {
    const workId = req.params.id;
    try {
      db.prepare("UPDATE works SET views = views + 1 WHERE id = ?").run(workId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal update views" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          protocol: 'wss',
          clientPort: 443
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
