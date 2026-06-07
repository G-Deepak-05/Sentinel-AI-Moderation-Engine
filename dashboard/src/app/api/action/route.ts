import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "sentinel_user",
  password: process.env.DB_PASSWORD || "sentinel_password",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  database: "sentinel_db",
});

export async function POST(request: Request) {
  try {
    const { id, action } = await request.json(); // id = moderation_results.id
    
    const client = await pool.connect();
    
    // Update the action in moderation_results
    await client.query("UPDATE moderation_results SET action = $1 WHERE id = $2", [action, id]);
    
    // Insert into audit_logs
    const auditId = crypto.randomUUID();
    const moderatorId = "moderator-1"; // Hardcoded for V1
    await client.query(`
      INSERT INTO audit_logs (id, result_id, moderator_id, action_taken, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [auditId, id, moderatorId, action]);
    
    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
