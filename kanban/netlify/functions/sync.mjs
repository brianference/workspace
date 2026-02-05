import { getStore } from "@netlify/blobs";

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const store = getStore("kanban");

    if (req.method === "GET") {
      const data = await store.get("cards");
      return new Response(data || "[]", { headers });
    }

    if (req.method === "POST") {
      const body = await req.text();
      // Basic validation
      const parsed = JSON.parse(body);
      if (!Array.isArray(parsed)) {
        return new Response('{"error":"Expected array"}', { status: 400, headers });
      }
      await store.set("cards", body);
      return new Response('{"ok":true}', { headers });
    }

    return new Response('{"error":"Method not allowed"}', { status: 405, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
};

export const config = { path: "/api/sync" };
