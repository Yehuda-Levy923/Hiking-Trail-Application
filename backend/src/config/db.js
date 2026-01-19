import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Connection event handlers
pool.on("connect", () => {
  console.log("📦 New client connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err);
  process.exit(-1);
});

// Test connection on startup
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    console.log("✅ PostgreSQL connected at:", result.rows[0].now);
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    return false;
  }
};

// Helper for transactions
export const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export default pool;
