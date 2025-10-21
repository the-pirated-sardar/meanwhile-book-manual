"use client";
import { useRouter } from "next/navigation";
import { useDeviceGate } from "@/hooks/useDeviceGate";
import NextImage from "next/image";

export default function HomePage() {
  const router = useRouter();
  const isDesktop = useDeviceGate();
  const disabled = isDesktop === false;

  return (
    // Fill exactly one viewport and prevent scrolling on this page
    <main className="fixed inset-0 overflow-hidden">
      {/* BG image */}
      <div className="absolute inset-0 z-0">
        <NextImage
          src="/images/landing-bg.jpg"
          alt="Background"
          fill
          priority
          className="object-cover blur-2xl"
        />
        <div className="absolute inset-0 bg-black/40 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,1)_45%,transparent_100%)]" />
      </div>

      {/* Foreground: single-screen grid, no scroll */}
      <div
        className="
          relative z-10 h-screen w-full
          grid grid-rows-[minmax(0,1fr)_auto_auto] gap-4
          items-center justify-items-center
          px-4 sm:px-6"
      >
        {/* Cover (auto-shrinks if space is tight) */}
        <div className="w-full flex items-end justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cover.png"
            alt="Meanwhile book cover"
            className="
              block object-contain drop-shadow-xl
              max-h-[min(58vh,78vw)]
              transition-transform hover:-translate-y-0.5
            "
          />
        </div>

        {/* Text block — sized to fit without creating scroll */}
        <div className="w-full max-w-5xl text-center space-y-3 select-text">
          <p className="
              font-semibold leading-snug
              [font-size:clamp(1.05rem,1.8vw,1.35rem)]
              [color:#fde047] [text-shadow:3px_3px_10px_rgba(0,0,0,0.95)]
            ">
            I asked someone to get me a book I&apos;d like, with a promise to finish it before we
            meet next. She gamed the ask and handed me a book with{" "}
            <span className="underline-pop [color:white] [text-shadow:2px_2px_10px_rgba(0,0,0,1)] font-extrabold">
              3,856
            </span>{" "}
            possibilities.
          </p>

          <p className="
              font-semibold leading-snug
              [font-size:clamp(1.05rem,1.8vw,1.35rem)]
              [color:#fde047] [text-shadow:3px_3px_10px_rgba(0,0,0,0.95)]
            ">
            Let this be my way to <span className="italic">"complete"&nbsp;</span> the book.
          </p>
        </div>

        {/* Big, unmistakable button */}
        <div className="relative">
          <button
            onClick={() => router.push("/stories")}
            disabled={disabled}
            className={`relative group overflow-hidden rounded-2xl
                        border-4 border-yellow-300 bg-yellow-300
                        px-10 py-5 text-2xl font-extrabold tracking-wide text-black
                        shadow-[0_0_25px_rgba(253,224,71,0.7)]
                        transition-transform
                        ${disabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:scale-[1.06] active:scale-[0.98]"}
                       `}
            aria-label="View stories so far"
          >
            <span className="relative z-10">STORIES I FOUND SO FAR →</span>
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"
            />
          </button>

          {disabled && (
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-sm text-rose-200/90 drop-shadow">
              Experience only available on desktops
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
