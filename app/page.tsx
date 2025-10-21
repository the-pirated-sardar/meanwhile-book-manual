"use client";
import { useRouter } from "next/navigation";
import { useDeviceGate } from "@/hooks/useDeviceGate";
import NextImage from "next/image";

export default function HomePage() {
  const router = useRouter();
  const isDesktop = useDeviceGate();
  const disabled = isDesktop === false;

  return (
    <main className="fixed inset-0 overflow-hidden">
      {/* Background */}
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

      {/* Foreground layout */}
      <div
        className="
          relative z-1 h-screen w-full
          flex flex-col items-center justify-start
          px-4 sm:px-6 pt-[7vh] gap-10
        "
      >
        {/* Cover image */}
        <div className="w-full flex justify-center">
          <img
            src="/images/cover.png"
            alt="Meanwhile book cover"
            className="
              block object-contain drop-shadow-xl
              max-h-[min(55vh,68vw)]
              transition-transform hover:-translate-y-1.5
            "
          />
        </div>

        {/* Text section */}
        <div className="w-full max-w-3xl text-center space-y-4 select-text">
          <p
            className="
              font-semibold leading-snug
              [font-size:clamp(1.05rem,1.8vw,1.35rem)]
              [color:#fde047] [text-shadow:3px_3px_10px_rgba(0,0,0,0.95)]
            "
          >
            I was given a book with
            <span className="underline-pop [color:white] [text-shadow:2px_2px_10px_rgba(0,0,0,1)] font-extrabold">
              &nbsp;3,856
            </span>{" "}
            possible story paths...
          </p>

          <p
            className="
              font-semibold leading-snug
              [font-size:clamp(1.05rem,1.8vw,1.35rem)]
              [color:#fde047] [text-shadow:3px_3px_10px_rgba(0,0,0,0.95)]
            "
          >
            My programmer brain took over and now the fun is to{" "}
            <span className="italic">solve&nbsp;</span>
            the whole book. Probably a DFS backtracking problem? Still figuring that out.
          </p>
        </div>

        {/* Button (closer to text now) */}
        <div className="relative mt-2">
          <button
            onClick={() => router.push("/stories")}
            disabled={disabled}
            className={`relative group overflow-hidden rounded-2xl
                        border-4 border-yellow-300 bg-yellow-300
                        px-10 py-5 text-2xl font-extrabold tracking-wide text-black
                        shadow-[0_0_25px_rgba(253,224,71,0.7)]
                        transition-transform
                        ${
                          disabled
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:scale-[1.06] active:scale-[0.98]"
                        }
                       `}
            aria-label="View stories so far"
          >
            <span className="relative z-10">STORIES FOUND SO FAR →</span>
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
