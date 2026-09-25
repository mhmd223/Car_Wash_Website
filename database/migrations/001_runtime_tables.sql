-- Runtime tables created automatically in development and reproducibly in deployment.

CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(128) NOT NULL PRIMARY KEY,
  expires BIGINT UNSIGNED NOT NULL,
  data MEDIUMTEXT NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS email_verification_codes (
  email VARCHAR(255) PRIMARY KEY,
  code_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  last_sent_at DATETIME NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL DEFAULT 0
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- Upgrade databases created by older session stores that used INT expires.
ALTER TABLE sessions MODIFY expires BIGINT UNSIGNED NOT NULL;