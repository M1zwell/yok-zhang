#!/usr/bin/env node
/**
 * Caching reverse proxy: http://127.0.0.1:4173 → https://jubuddy.com
 * Caches GET bodies under /tmp/planet-proxy-cache so the second load is local.
 * Always sends a real Chrome User-Agent — Vercel/CF return 403 on a generic UA.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";

const PORT = 4173;
const UP = "https://jubuddy.com";
const CACHE = "/tmp/planet-proxy-cache";
const CHROME_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36";
mkdirSync(CACHE, { recursive: true });

function keyFor(url) {
  return createHash("sha1").update(url).digest("hex");
}

function cachePaths(url) {
  const k = keyFor(url);
  return { body: join(CACHE, k), meta: join(CACHE, k + ".json") };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const up = UP + url.pathname + url.search;
  const { body, meta } = cachePaths(up);

  if (req.method === "GET" && existsSync(body) && existsSync(meta)) {
    const m = JSON.parse(readFileSync(meta, "utf8"));
    res.writeHead(200, {
      "content-type": m.type || "application/octet-stream",
      "cache-control": "public, max-age=3600",
      "x-planet-proxy": "hit",
      "access-control-allow-origin": "*",
    });
    res.end(readFileSync(body));
    return;
  }

  try {
    const upRes = await fetch(up, {
      method: req.method,
      headers: {
        "user-agent": req.headers["user-agent"] || CHROME_UA,
        accept: req.headers.accept || "*/*",
        "accept-language": req.headers["accept-language"] || "en-US,en;q=0.9",
        referer: `${UP}/`,
      },
      redirect: "follow",
    });
    const buf = Buffer.from(await upRes.arrayBuffer());
    const type = upRes.headers.get("content-type") || "application/octet-stream";
    if (req.method === "GET" && upRes.ok && buf.length > 0) {
      writeFileSync(body, buf);
      writeFileSync(meta, JSON.stringify({ type, url: up }));
    }
    res.writeHead(upRes.status, {
      "content-type": type,
      "x-planet-proxy": "miss",
      "access-control-allow-origin": "*",
    });
    res.end(buf);
  } catch (err) {
    res.writeHead(502, { "content-type": "text/plain" });
    res.end(String(err));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`planet proxy http://127.0.0.1:${PORT} → ${UP}`);
});
