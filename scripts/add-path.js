#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const DATA_DIR     = path.resolve(__dirname, "../data");
const NODES_FILE   = path.join(DATA_DIR, "nodes.json");
const EDGES_FILE   = path.join(DATA_DIR, "edges.json");
const STORIES_FILE = path.join(DATA_DIR, "stories.json");
const CSV_FILE     = path.join(DATA_DIR, "stories.csv");

const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
const readJSON  = (f, fallback=[]) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fallback);
const writeJSON = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 2), "utf8");

/* ---------- CSV helpers ---------- */
function toCsvRow(cells) {
  return cells.map(c => {
    const s = String(c ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",");
}
function regenerateCsv(stories) {
  // Build path groups keyed by exact path string
  const byPath = new Map();             // key: "A->B->C"  → array of S-ids in chronological order
  const idToPathKey = new Map();
  const idToTitle = new Map();
  for (const s of stories) {
    const key = (s.path || []).join("->");
    idToPathKey.set(s.id, key);
    idToTitle.set(s.id, s.title || "");
    if (!byPath.has(key)) byPath.set(key, []);
    byPath.get(key).push(s.id);
  }
  // Output rows in story-id numeric order
  const rows = [];
  rows.push(toCsvRow(["Story", "Title", "Path"]));
  const sorted = [...stories].sort((a, b) =>
    Number((a.id||"").split("-")[1]) - Number((b.id||"").split("-")[1])
  );
  for (const s of sorted) {
    const key = idToPathKey.get(s.id) || "";
    const group = byPath.get(key) || [];
    // duplicates are *earlier* ids in the same group (so only later rows show them)
    const earlier = group.filter(id => id !== s.id &&
      Number(id.split("-")[1]) < Number(s.id.split("-")[1]));
    const leftCell = earlier.length ? `${s.id} (${earlier.join(", ")})` : s.id;
    rows.push(toCsvRow([leftCell, idToTitle.get(s.id) || "", (s.path || []).join(" -> ")]));
  }
  fs.writeFileSync(CSV_FILE, rows.join("\n") + "\n", "utf8");
}

/* ---------- args parsing ---------- */
const args = process.argv.slice(2);
const readFlag = (flag) => {
  const i = args.indexOf(flag);
  if (i === -1) return "";
  const out = [];
  for (let j = i + 1; j < args.length; j++) {
    if (args[j].startsWith("--")) break;
    out.push(args[j]);
  }
  return out.join(" ").trim();
};

let pathArg  = readFlag("--path");
let titleArg = readFlag("--title");
if (!pathArg || !pathArg.includes(">")) {
  console.error('Usage: npm run path:add -- --path "A->B->C" --title "My Story"');
  process.exit(1);
}

const cleanId = (s) =>
  s.trim()
   .replace(/[–—]/g, "-")       // ndash/mdash → hyphen
   .replace(/[^\w:-]+$/g, "");  // strip trailing junk like a trailing '-'

const ids   = pathArg.replaceAll("→", "->").split("->").map(cleanId).filter(Boolean);
const title = titleArg || `Story ${new Date().toISOString().slice(0,10)}`;

/* ---------- load & ensure data ---------- */
ensureDir(DATA_DIR);
let nodes   = readJSON(NODES_FILE);
let edges   = readJSON(EDGES_FILE);
let stories = readJSON(STORIES_FILE);

/* ---------- allocate next S-id ---------- */
const nextNum = stories.length
  ? Math.max(...stories.map(s => Number((s.id||"").split("-")[1]) || 0)) + 1
  : 1;
const storyId = `S-${String(nextNum).padStart(3, "0")}`;

/* ---------- write story ---------- */
stories.push({ id: storyId, title, path: ids });

/* ---------- ensure nodes (auto image path) ---------- */
for (const id of ids) {
  if (!nodes.find(n => n.id === id)) {
    nodes.push({
      id,
      title: id,
      img: `/images/panels/${id}.jpg`,
      type: id.startsWith("E") ? "ending" : "panel",
    });
  }
}

/* ---------- ensure edges ---------- */
for (let i = 0; i < ids.length - 1; i++) {
  const from = ids[i], to = ids[i+1];
  if (!edges.find(e => e.from === from && e.to === to)) {
    edges.push({ from, to });
  }
}

/* ---------- save all & regenerate CSV ---------- */
writeJSON(NODES_FILE, nodes);
writeJSON(EDGES_FILE, edges);
writeJSON(STORIES_FILE, stories);
regenerateCsv(stories);

console.log(`✅ Added ${storyId}: ${title}`);
console.log(`Path: ${ids.join("->")}`);
console.log(`↻ Updated CSV: ${path.relative(process.cwd(), CSV_FILE)}`);
