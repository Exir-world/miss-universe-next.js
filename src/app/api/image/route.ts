// /app/api/image/route.ts (app dir) or /pages/api/image.ts (pages dir)
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const filename = url.searchParams.get("filename") || process.env.NEXT_GAME_NAME;

  if (!filename) {
    return new NextResponse("Image name is required", { status: 400 });
  }

  // Try different possible paths for the image
  const possiblePaths = [
    join(process.cwd(), "public", "Dubaieid", filename),
    join(process.cwd(), "public", "images", filename),
    join(process.cwd(), "public", filename),
  ];

  let imagePath: string | null = null;

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      imagePath = path;
      break;
    }
  }

  if (!imagePath) {
    return new NextResponse("Image not found", { status: 404 });
  }

  try {
    const imageBuffer = readFileSync(imagePath);

    // Determine content type based on file extension
    const ext = filename.split(".").pop()?.toLowerCase();
    let contentType = "image/jpeg";

    if (ext === "webp") {
      contentType = "image/webp";
    } else if (ext === "png") {
      contentType = "image/png";
    } else if (ext === "gif") {
      contentType = "image/gif";
    } else if (ext === "svg") {
      contentType = "image/svg+xml";
    }

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error reading image:", error);
    return new NextResponse("Error reading image", { status: 500 });
  }
}
