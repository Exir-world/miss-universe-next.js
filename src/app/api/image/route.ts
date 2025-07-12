export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || !url.startsWith("https://token.ex.pro")) {
    return new Response(JSON.stringify({ error: "Invalid URL" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Image fetch failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new Response(Buffer.from(buffer), {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Image fetch failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
