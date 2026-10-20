const { getStore } = require("@netlify/blobs");
exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  if (event.httpMethod !== "GET") return { statusCode: 405, headers, body: JSON.stringify({ error: "Use GET." }) };
  const id = (event.queryStringParameters || {}).id || "";
  if (!/^[a-f0-9]{10}$/.test(id)) return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid link ID." }) };
  try {
    const store = getStore("shared-pages");
    const raw = await store.get(id);
    if (!raw) return { statusCode: 404, headers, body: JSON.stringify({ error: "This shared page was not found." }) };
    return { statusCode: 200, headers, body: raw };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Could not load shared page." }) };
  }
};