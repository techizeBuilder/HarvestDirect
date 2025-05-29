import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../../../shared/schema.ts";

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create neon HTTP client (more reliable than WebSocket)
const sql = neon(process.env.DATABASE_URL);

// Create drizzle instance with schema
export const db = drizzle(sql, { schema });

// Test database connection
export const testConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};