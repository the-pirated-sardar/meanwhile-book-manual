#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const DATA_DIR     = path.resolve(__dirname, "../data");
const STORIES_FILE = path.join(DATA_DIR, "stories.json");
const CSV_FILE     = path.join(DATA_DIR, "stories.csv");

const readJSON  = (f, fallback=[]) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fallback);
const writeJSON = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 2), "utf8");

const args = process.argv.slice(2);
const idx  = args.indexOf("--id");
if (idx === -1 || !args[idx+1]) {
  console.error('Usage: npm run story:rm -- --id S-XXX');
  process.exit(1);
}
const id = args[idx+1].trim();

let stories = readJSON(STORIES_FILE, []);
const before = stories.length;
stories = stories.filter(s => (s.id || "").trim() !== id);

if (stories.length === before) {
  console.error(`⚠️  Story ${id} not found`);
  process.exit(1);
}

writeJSON(STORIES_FILE, stories);

// ---- regenerate CSV (same logic as in add script) ----
function toCsvRow(cells) {
  return cells.map(c => {
    const s = String(c ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",");
}
function regenerateCsv(stories) {
  const byPath = new Map();
  const idToPathKey = new Map();
  const idToTitle   = new Map();
  for (const s of stories) {
    const key = (s.path || []).join("->");
    idToPathKey.set(s.id, key);
    idToTitle.set(s.id, s.title || "");
    if (!byPath.has(key)) byPath.set(key, []);
    byPath.get(key).push(s.id);
  }
  const rows = [];
  rows.push(toCsvRow(["Story", "Title", "Path"]));
  const sorted = [...stories].sort((a, b) =>
    Number((a.id||"").split("-")[1]) - Number((b.id||"").split("-")[1])
  );
  for (const s of sorted) {
    const key = idToPathKey.get(s.id) || "";
    const group = byPath.get(key) || [];
    const earlier = group.filter(x =>
      x !== s.id && Number(x.split("-")[1]) < Number(s.id.split("-")[1])
    );
    const left = earlier.length ? `${s.id} (${earlier.join(", ")})` : s.id;
    rows.push(toCsvRow([left, idToTitle.get(s.id) || "", (s.path || []).join(" -> ")]));
  }
  fs.writeFileSync(CSV_FILE, rows.join("\n") + "\n", "utf8");
}
regenerateCsv(stories);

console.log(`🗑️  Removed ${id}`);
console.log(`↻ Updated CSV: ${path.relative(process.cwd(), CSV_FILE)}`);
