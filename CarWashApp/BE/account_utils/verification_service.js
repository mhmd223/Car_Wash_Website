import crypto from "crypto";
import nodemailer from "nodemailer";
import { dbConnection } from "../sql_utils/DBconnection.js";

const CODE_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

// Local development may log codes; production requires configured SMTP.
const transporter =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    : null;

if (process.env.NODE_ENV === "production" && !transporter) {
  throw new Error("SMTP configuration must be complete in production");
}

export async function initializeVerificationTable() {
  await dbConnection.query(`
    CREATE TABLE IF NOT EXISTS email_verification_codes (
      email VARCHAR(255) PRIMARY KEY,
      code_hash CHAR(64) NOT NULL,
      expires_at DATETIME NOT NULL,
      last_sent_at DATETIME NOT NULL,
      attempts TINYINT UNSIGNED NOT NULL DEFAULT 0
    )
  `);
}

function hashCode(code) {
  // Store only a digest so a database leak does not reveal active codes.
  return crypto.createHash("sha256").update(code).digest("hex");
}

/** Create, persist, and deliver a short-lived one-time verification code. */
export async function sendVerificationCode(email) {
  const code = String(crypto.randomInt(100000, 1000000));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CODE_TTL_MINUTES * 60 * 1000);
  const connection = await dbConnection.getConnection();

  try {
    const [existing] = await connection.query(
      "SELECT last_sent_at FROM email_verification_codes WHERE email=?",
      [email],
    );

    if (existing.length) {
      const elapsedSeconds = (now - new Date(existing[0].last_sent_at)) / 1000;
      if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
        return {
          sent: false,
          retryAfter: Math.ceil(RESEND_COOLDOWN_SECONDS - elapsedSeconds),
        };
      }
    }

    await connection.query(
      `INSERT INTO email_verification_codes
       (email, code_hash, expires_at, last_sent_at, attempts)
       VALUES (?, ?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE
       code_hash=VALUES(code_hash), expires_at=VALUES(expires_at),
       last_sent_at=VALUES(last_sent_at), attempts=0`,
      [email, hashCode(code), expiresAt, now],
    );
  } finally {
    connection.release();
  }

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Verify your Car Wash account",
      text: `Your verification code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`,
    });
  } else {
    console.info(`Verification code for ${email}: ${code}`);
  }

  return { sent: true };
}

export async function verifyEmailCode(email, code) {
  // The row lock makes attempt counting and one-time consumption atomic.
  const connection = await dbConnection.getConnection();

  try {
    await connection.beginTransaction();
    const [records] = await connection.query(
      "SELECT code_hash, expires_at, attempts FROM email_verification_codes WHERE email=? FOR UPDATE",
      [email],
    );
    const record = records[0];

    if (
      !record ||
      record.attempts >= 5 ||
      new Date(record.expires_at) <= new Date()
    ) {
      await connection.rollback();
      return { verified: false, code: "INVALID_OR_EXPIRED_CODE" };
    }

    if (hashCode(code) !== record.code_hash) {
      await connection.query(
        "UPDATE email_verification_codes SET attempts=attempts+1 WHERE email=?",
        [email],
      );
      await connection.commit();
      return { verified: false, code: "INVALID_OR_EXPIRED_CODE" };
    }

    const [updated] = await connection.query(
      "UPDATE users SET verified=1 WHERE email=?",
      [email],
    );
    await connection.query(
      "DELETE FROM email_verification_codes WHERE email=?",
      [email],
    );
    await connection.commit();

    return { verified: updated.affectedRows > 0 };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
