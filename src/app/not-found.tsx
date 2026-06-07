"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">

      <div className="bg-[#e0e0e0] rounded-2xl p-10 max-w-xl w-full text-center shadow-sm">

        <AlertCircle
          size={80}
          className="mx-auto text-[#1c6b68]"
        />

        <h1 className="text-6xl font-bold text-[#1c6b68] mt-6">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mt-3">
          Page Not Found
        </h2>

        <p className="text-gray-600 mt-4">
          Sorry, the page you are looking for does not exist
          or may have been moved.
        </p>

        <div className="flex flex-col gap-3 mt-8">

          <button
            onClick={() => router.back()}
            className="bg-[#1c6b68] text-white py-3 rounded-full hover:opacity-80 transition duration-500"
          >
            Go Back
          </button>

          <button
            onClick={() => router.push("/")}
            className="border border-[#1c6b68] text-[#1c6b68] py-3 rounded-full hover:bg-[#1c6b68] hover:text-white transition duration-500"
          >
            Back To Home
          </button>

        </div>

      </div>

    </div>
  );
} 