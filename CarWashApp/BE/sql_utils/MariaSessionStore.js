import session from "express-session";
import { dbConnection } from "./DBconnection.js";

/**
 * Minimal express-session store backed by the application's existing mysql2 pool.
 * The pool lifecycle belongs to DBconnection, so close() intentionally does not
 * close it; server shutdown closes the pool after this store is stopped.
 */
export default class MariaSessionStore extends session.Store {
  constructor() {
    super();
    this.ready = this.initialize();
    this.cleanupInterval = setInterval(
      () => this.clearExpired().catch(() => undefined),
      15 * 60 * 1000,
    );
    this.cleanupInterval.unref();
  }

  async initialize() {
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR(128) NOT NULL PRIMARY KEY,
        expires BIGINT UNSIGNED NOT NULL,
        data MEDIUMTEXT NOT NULL
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
    `);
  }

  onReady() {
    return this.ready;
  }

  get(sessionId, callback) {
    dbConnection
      .query("SELECT expires, data FROM sessions WHERE session_id=?", [
        sessionId,
      ])
      .then(([rows]) => {
        const record = rows[0];
        if (!record || Number(record.expires) <= Date.now()) {
          if (record) this.destroy(sessionId, () => undefined);
          callback(null, null);
          return;
        }
        callback(null, JSON.parse(record.data));
      })
      .catch(callback);
  }

  set(sessionId, sessionData, callback) {
    const expires = Date.now() + Number(sessionData.cookie?.maxAge || 86400000);
    dbConnection
      .query(
        `INSERT INTO sessions (session_id, expires, data)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE expires=VALUES(expires), data=VALUES(data)`,
        [sessionId, expires, JSON.stringify(sessionData)],
      )
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  destroy(sessionId, callback) {
    dbConnection
      .query("DELETE FROM sessions WHERE session_id=?", [sessionId])
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  touch(sessionId, sessionData, callback) {
    const expires = Date.now() + Number(sessionData.cookie?.maxAge || 86400000);
    dbConnection
      .query("UPDATE sessions SET expires=? WHERE session_id=?", [
        expires,
        sessionId,
      ])
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  clear(callback) {
    dbConnection
      .query("DELETE FROM sessions")
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  clearExpired() {
    return dbConnection.query("DELETE FROM sessions WHERE expires <= ?", [
      Date.now(),
    ]);
  }

  length(callback) {
    dbConnection
      .query("SELECT COUNT(*) AS count FROM sessions")
      .then(([rows]) => callback(null, Number(rows[0].count)))
      .catch(callback);
  }

  all(callback) {
    dbConnection
      .query("SELECT session_id, data FROM sessions")
      .then(([rows]) => {
        const sessions = Object.fromEntries(
          rows.map((row) => [row.session_id, JSON.parse(row.data)]),
        );
        callback(null, sessions);
      })
      .catch(callback);
  }

  close() {
    clearInterval(this.cleanupInterval);
    return Promise.resolve();
  }
}
