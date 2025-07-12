import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return new NextResponse(JSON.stringify({ 
    message: "API is working",
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_GAME_NAME: process.env.NEXT_PUBLIC_GAME_NAME,
      NEXT_GAME_NAME: process.env.NEXT_GAME_NAME,
    }
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
} 