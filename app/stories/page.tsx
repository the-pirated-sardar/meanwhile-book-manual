"use client";
import { useDeviceGate } from "@/hooks/useDeviceGate";
import StoriesViewer from "@/app/stories/components/StoriesViewer";
import { useRouter } from "next/navigation";

export default function StoriesPage() {
  const isDesktop = useDeviceGate();
  const router = useRouter();

  if (isDesktop === false) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md w-full rounded border p-6 bg-white shadow">
          <h1 className="text-xl font-semibold mb-2">Experience only available on desktops</h1>
          <p className="text-gray-600 mb-4">Rotate your device or open on a desktop to explore the stories.</p>
          <button onClick={() => router.push("/")} className="px-4 py-2 rounded border hover:bg-gray-50">Go back</button>
        </div>
      </main>
    );
  }

  if (isDesktop === null) return null; // during first paint

  return <StoriesViewer startIndex={0} />;
}
