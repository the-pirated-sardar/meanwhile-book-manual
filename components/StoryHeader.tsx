"use client";

type Props = {
  index: number;  // 1-based
  total: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export default function StoryHeader({ index, total, onPrev, onNext, canPrev, canNext }: Props) {
  return (
    <div className="fixed top-3 inset-x-0 z-50">
      <div
        className="
          mx-auto max-w-6xl
          flex items-center justify-between gap-2
          rounded-full px-2 py-1.5
          bg-white/90 ring-1 ring-black/20 backdrop-blur-lg
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          text-black
        "
      >
        <NavBtn dir="prev" onClick={onPrev} disabled={!canPrev} />
        <div
          className="
            px-4 py-1 rounded-full text-sm md:text-base font-extrabold tracking-wide
            bg-white ring-1 ring-black/20 shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]
          "
        >
          STORY <span className="text-black">{index}</span>
          <span className="opacity-70"> OF {total}</span>
        </div>
        <NavBtn dir="next" onClick={onNext} disabled={!canNext} />
      </div>
    </div>
  );
}

function NavBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled?: boolean;
  onClick: () => void;
}) {
  const label = dir === "prev" ? "PREV" : "NEXT";
  const Arrow = () =>
    dir === "prev" ? (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="-ml-0.5">
        <path fill="currentColor" d="M15.5 19 8.5 12l7-7" />
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="-mr-0.5">
        <path fill="currentColor" d="m8.5 5 7 7-7 7" />
      </svg>
    );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm
        font-extrabold tracking-widest uppercase transition
        ${dir === "prev" ? "flex-row" : "flex-row-reverse"}
        ${disabled ? "opacity-35 cursor-not-allowed" : "hover:translate-y-[-1px] active:translate-y-[0px]"}
        bg-black text-white ring-1 ring-black/20 shadow-[0_6px_14px_rgba(0,0,0,0.35)]
      `}
      aria-label={label}
    >
      <Arrow />
      <span className="select-none">{label}</span>
    </button>
  );
}
