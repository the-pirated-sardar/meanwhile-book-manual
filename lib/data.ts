import nodes   from "@/data/nodes.json";
import edges   from "@/data/edges.json";
import stories from "@/data/stories.json";

export type NodeT = { id: string; title: string; img: string | null; tags: string[]; type: "panel" | "ending" };
export type EdgeT = { from: string; to: string; label?: string };
export type StoryT = { id: string; title: string; path: string[]; notes?: string };

export const DATA = {
  nodes: nodes as NodeT[],
  edges: edges as EdgeT[],
  stories: stories as StoryT[]
};

export const nodeById = new Map(DATA.nodes.map(n => [n.id, n]));
export const edgeSet = new Set(DATA.edges.map(e => `${e.from}→${e.to}`));
