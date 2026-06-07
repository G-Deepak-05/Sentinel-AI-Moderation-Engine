import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: "sentinel_user",
  password: "sentinel_password",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  database: "sentinel_db",
});

export async function GET() {
  try {
    const client = await pool.connect();
    // Fetch top 15 most recent items regardless of action
    const result = await client.query(`
      SELECT r.id as "id", req.payload as "payload", req.id as "trackingId",
             r.toxicity_score as "toxicityScore", r.action as "action",
             r.created_at as "createdAt"
      FROM moderation_results r
      JOIN moderation_requests req ON r.request_id = req.id
      ORDER BY r.created_at DESC
      LIMIT 15
    `);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch activity feed" }, { status: 500 });
  }
}
