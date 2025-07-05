"use client";
import { cn } from "@/utils/cn";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";

export default function BackButton({ className = "" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "flex items-center border border-rose-900 mb-4 text-sm text-rose-900 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-full px-2 pr-3",
        className
      )}
    >
      <Icon icon="mdi:chevron-left" className="inline size-4" />
      Retour
    </button>
  );
}
