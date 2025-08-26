"use client";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";

export default function BackButton({ className = "" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "flex items-center border border-gray-500 mb-4 text-sm text-gray-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-full px-2 pr-3",
        className
      )}
    >
      <Icon icon="mdi:chevron-left" className="inline size-4" />
      Retour
    </button>
  );
}
