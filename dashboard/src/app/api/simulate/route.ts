import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.payload) {
      return NextResponse.json({ error: "Payload is required" }, { status: 400 });
    }

    // Forward the request to the ingestion-gateway container
    const res = await fetch("http://ingestion-gateway:8081/api/v1/moderate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: body.payload }),
    });

    if (!res.ok) {
      throw new Error(`Ingestion gateway responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: "Failed to send payload" }, { status: 500 });
  }
}
