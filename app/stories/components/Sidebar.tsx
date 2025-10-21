"use client";

import { useEffect, useRef, useState } from "react";
import { computeVisibleIndices } from "@/lib/storyListLogic";
import clsx from "clsx";

type Props = {
  titles: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
  /** Offset to start below a sticky header (px). Default 96. */
  topOffset?: number;
};

export default function Sidebar({ titles, currentIndex, onSelect, topOffset = 96 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [capacity, setCapacity] = useState(8);

  useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      const h = ref.current.clientHeight;
      const itemH = 44; // px per item
      setCapacity(Math.max(3, Math.floor(h / itemH)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const idxs = computeVisibleIndices(titles.length, capacity);

  return (
    <div
      className="group/sidebar fixed right-0 z-40"
      style={{ top: topOffset, height: `calc(100vh - ${topOffset}px)` }}
      aria-label="Stories list sidebar"
    >
      {/* Hover rail (hit-target) */}
      <div
        className="
          h-full w-10 transition-all duration-200
          bg-white/80 backdrop-blur-md border-l border-black/20
          group-hover/sidebar:w-64
        "
      />

      {/* Content panel (collapses with rail) */}
      <div
        ref={ref}
        className="
          pointer-events-none group-hover/sidebar:pointer-events-auto
          fixed right-0
          w-64 pr-3 pl-2 pt-3 pb-3
          overflow-hidden
          transition-all
        "
        style={{ top: topOffset, height: `calc(100vh - ${topOffset}px)` }}
      >
        <div
          className="
            h-full overflow-y-auto
            opacity-0 translate-x-10
            group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0
            transition-all duration-200
          "
        >
          {idxs.map((idx, i) =>
            idx === -1 ? (
              <div key={`ellipsis-${i}`} className="flex items-center justify-center py-2 text-black/50">⋮</div>
            ) : (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={clsx(
                  "block w-full text-left px-3 py-2 rounded-md mb-2 border transition",
                  "shadow-sm",
                  idx === currentIndex
                    ? "bg-black text-white border-black"
                    : "bg-white hover:bg-black/5 border-black/20 text-black"
                )}
              >
                <span className="font-extrabold">Story {idx + 1}</span>
                <span className="opacity-70"> — {titles[idx]}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
