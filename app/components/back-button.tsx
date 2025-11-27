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
        "inline-flex items-center text-sm gap-2 pr-3 pl-2 py-1 my-4 rounded-xl text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300",
        className
      )}
    >
      <Icon
        icon="mdi:chevron-left"
        className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1"
      />
      Retour
    </button>
  );
}
