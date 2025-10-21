const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const DATA = p => path.join(process.cwd(),"data",p);
const stories = JSON.parse(fs.readFileSync(DATA("stories.json"),"utf8"));
const sig = p => crypto.createHash("sha1").update(p.join("→")).digest("hex");
const seen = new Map();
let dupes = 0;
for (const s of stories) {
  const g = sig(s.path);
  if (seen.has(g)) { console.error(`Duplicate: ${s.id} repeats ${seen.get(g)}`); dupes++; }
  else seen.set(g, s.id);
}
process.exitCode = dupes ? 1 : 0;
