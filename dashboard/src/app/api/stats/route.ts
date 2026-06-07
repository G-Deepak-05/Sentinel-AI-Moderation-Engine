import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "sentinel_user",
  password: process.env.DB_PASSWORD || "sentinel_password",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  database: "sentinel_db",
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM moderation_results) as total_processed,
        (SELECT COUNT(*) FROM moderation_results WHERE action = 'ALLOW') as allowed_count,
        (SELECT COUNT(*) FROM moderation_results WHERE action = 'BLOCK') as blocked_count,
        (SELECT COUNT(*) FROM moderation_results WHERE action = 'FLAG') as queue_size
    `);
    client.release();
    
    const row = result.rows[0];
    return NextResponse.json({
      totalProcessed: parseInt(row.total_processed, 10) || 0,
      allowed: parseInt(row.allowed_count, 10) || 0,
      blocked: parseInt(row.blocked_count, 10) || 0,
      queueSize: parseInt(row.queue_size, 10) || 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
