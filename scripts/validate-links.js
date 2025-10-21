const fs = require("fs");
const path = require("path");
const DATA = p => path.join(process.cwd(),"data",p);
const edges = JSON.parse(fs.readFileSync(DATA("edges.json"),"utf8"));
const stories = JSON.parse(fs.readFileSync(DATA("stories.json"),"utf8"));
const edgeSet = new Set(edges.map(e => `${e.from}→${e.to}`));
let ok = true;
for (const s of stories) {
  for (let i=0;i<s.path.length-1;i++){
    const k = `${s.path[i]}→${s.path[i+1]}`;
    if (!edgeSet.has(k)) { ok = false; console.error(`Missing edge in ${s.id}: ${k}`); }
  }
}
process.exitCode = ok ? 0 : 1;
