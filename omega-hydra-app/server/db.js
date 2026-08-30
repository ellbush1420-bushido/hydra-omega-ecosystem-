import Database from 'better-sqlite3';

export function openDb(sqlitePath) {
  const db = new Database(sqlitePath);
  db.pragma('journal_mode = WAL');
  return db;
}

export function ensureSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS gate_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      whop_member_id TEXT,
      whop_product_id TEXT,
      tier TEXT NOT NULL,
      manifest_version TEXT NOT NULL,
      metadata_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS gate_entries_user_email
      ON gate_entries(user_email);

    CREATE TABLE IF NOT EXISTS manifest_delivery_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gate_entry_id INTEGER,
      whop_event_id TEXT,
      whop_member_id TEXT,
      whop_product_id TEXT,
      tier TEXT,
      manifest_version TEXT,
      s3_path TEXT,
      status TEXT NOT NULL,
      error_message TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(gate_entry_id) REFERENCES gate_entries(id)
    );
    CREATE INDEX IF NOT EXISTS manifest_delivery_log_created_at
      ON manifest_delivery_log(created_at);
  `);
}

