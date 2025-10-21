"use client";
import { useEffect, useMemo, useState } from "react";
import { DATA, nodeById } from "@/lib/data";
import Sidebar from "./Sidebar";
import clsx from "clsx";

function ScrollTopBtn() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed left-4 bottom-4 z-50 rounded-full border border-black bg-white px-3 py-2 shadow text-black hover:bg-black hover:text-white transition-colors"
      aria-label="Scroll to top"
    >
      ↑ Top
    </button>
  );
}

function NavBar({
  onPrev,
  onNext,
  idx,
  total,
}: {
  onPrev: () => void;
  onNext: () => void;
  idx: number;
  total: number;
}) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white/90 backdrop-blur px-4 py-2 border-b border-black/20">
      <button
        disabled={idx <= 0}
        onClick={onPrev}
        className={clsx(
          "px-3 py-1 rounded border border-black bg-white text-black font-semibold transition-colors",
          "hover:bg-black hover:text-white",
          "disabled:opacity-60 disabled:bg-white disabled:text-black disabled:border-black disabled:cursor-not-allowed"
        )}
      >
        ← Prev
      </button>

      <div className="text-sm font-bold text-black">
        Story {idx + 1} of {total}
      </div>

      <button
        disabled={idx >= total - 1}
        onClick={onNext}
        className={clsx(
          "px-3 py-1 rounded border border-black bg-white text-black font-semibold transition-colors",
          "hover:bg-black hover:text-white",
          "disabled:opacity-60 disabled:bg-white disabled:text-black disabled:border-black disabled:cursor-not-allowed"
        )}
      >
        Next →
      </button>
    </div>
  );
}

export default function StoriesViewer({ startIndex = 0 }: { startIndex?: number }) {
  const [current, setCurrent] = useState(startIndex);
  const stories = DATA.stories;
  const story = stories[current];

  const titles = useMemo(() => stories.map((s) => s.title || s.id), [stories]);

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(stories.length - 1, c + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Sidebar titles={titles} currentIndex={current} onSelect={setCurrent} />
      <NavBar onPrev={goPrev} onNext={goNext} idx={current} total={stories.length} />

      {/* Story title header */}
      <div className="sticky top-[48px] z-20 bg-white/90 backdrop-blur text-center py-3 border-b border-black/10">
        <h1 className="text-xl font-extrabold text-black uppercase tracking-wide">
          {story.title}
        </h1>
      </div>

      <main className="scroll-snap-y">
        {story.path.map((nodeId, i) => {
          const node = nodeById.get(nodeId);
          const even = i % 2 === 0;
          return (
            <section
              key={`${story.id}-${nodeId}-${i}`}
              className={clsx(
                "snap-section relative flex items-center justify-center px-6",
                even ? "bg-slate-50" : "bg-slate-100",
                "section-connector"
              )}
            >
              <div className="max-w-3xl w-full flex flex-col items-center text-center gap-3">
                <div className="relative">
                  {node?.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={node.img}
                      alt={node.title}
                      className="max-h-[70vh] w-auto rounded shadow border bg-white"
                    />
                  ) : (
                    <div className="h-64 w-64 grid place-items-center rounded border bg-white text-gray-400">
                      No image set for {nodeId}
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold text-black">
                  {node?.title ?? nodeId}
                </div>
                {i < story.path.length - 1 && (
                  <div className="text-xs text-gray-500">continues ↓</div>
                )}
              </div>
            </section>
          );
        })}
      </main>

      <ScrollTopBtn />
    </>
  );
}
