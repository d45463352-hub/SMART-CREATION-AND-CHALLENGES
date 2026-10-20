// Netlify Function: stores content in Netlify Blobs and returns a compact link.
// Requires Netlify Blobs support in the deployed site.
const { getStore } = require("@netlify/blobs");
const crypto = require("crypto");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Use POST." }) };
  try {
    const body = JSON.parse(event.body || "{}");
    const { kind, payload } = body;
    if (!["birthday", "social", "custom"].includes(kind) || !payload || typeof payload !== "object") {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid page data." }) };
    }
    const raw = JSON.stringify({ kind, payload });
    if (Buffer.byteLength(raw, "utf8") > 100000) return { statusCode: 413, headers, body: JSON.stringify({ error: "Content is too large (maximum 100 KB)." }) };
    const id = crypto.randomBytes(5).toString("hex");
    const store = getStore("shared-pages");
    await store.set(id, raw, { metadata: { kind, createdAt: new Date().toISOString() } });
    const origin = event.headers.origin || process.env.URL;
    if (!origin) throw new Error("Netlify site URL is not configured.");
    return { statusCode: 200, headers, body: JSON.stringify({ id, url: `${origin.replace(/\/$/, "")}/?p=${id}` }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Saving failed. Confirm Netlify deployment and Blob storage support." }) };
  }
};