"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    router.push("/auth/login");
  };

  return (
    <>
      <div className="min-h-screen grid md:grid-cols-2">

        {/* Spinner Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/85 flex flex-col items-center justify-center z-50">
            <div className="w-[50px] h-[50px] border-[4px] border-[#f3f3f3] border-t-[#1c6b68] rounded-full animate-spin mb-[15px]"></div>
            <p className="text-[#1c6b68] font-medium">Loading...</p>
          </div>
        )}

        {/* Left Image */}
        <div className="relative h-screen">
          <Image
            src="/welcomee.PNG"
            alt="Eventify"
            fill
            className="object-cover object-bottom"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center bg-gray-100 p-8">
          <div className="bg-gray-200/70 rounded-xl p-10 max-w-md w-full shadow-sm">

            <h1 className="text-3xl font-semibold text-[#2f6f73] mb-6">
              Eventify
            </h1>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Discover events, manage registrations, and access your
              digital tickets instantly with QR technology
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-center gap-2">
                <Check size={18} className="text-[#2f6f73]" />
                Create and manage events
              </li>

              <li className="flex items-center gap-2">
                <Check size={18} className="text-[#2f6f73]" />
                Send invitations easily
              </li>

              <li className="flex items-center gap-2">
                <Check size={18} className="text-[#2f6f73]" />
                Scan tickets with QR code
              </li>
            </ul>

            <button
              onClick={handleLogin}
              className="bg-[#2f6f73] text-white px-6 py-2 rounded-md transition-all duration-200 hover:bg-[#255a5e] hover:scale-105"
            >
              Login
            </button>

          </div>
        </div>
      </div>

      {/* =================== PUBLIC EVENTS =================== */}
      <div className="bg-gray-100 py-16 px-6">

        <h2 className="text-3xl font-semibold text-center text-[#2f6f73] mb-2">
          Public Events
        </h2>

        <p className="text-center text-gray-600 mb-10">
          Browse events open to everyone and register instantly.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="bg-gray-200/80 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
            >

              {/* Image */}
              <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={`/${index + 1}.png`}
                  alt="event"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-800 mb-2">
                {index % 2 === 0
                  ? "Tech Innovation Conference 2026"
                  : "University Career Fair"}
              </h3>

              {/* Info */}
              <div className="text-sm text-gray-600 space-y-1 mb-2">
                <p>📅 {index % 2 === 0 ? "24 June 2026" : "12 May 2026"}</p>
                <p>⏰ {index % 2 === 0 ? "10:00 AM – 4:00 PM" : "10:00 AM – 3:00 PM"}</p>
                <p>👥 {index % 2 === 0 ? "120 / 200 Seats Available" : "300 / 500 Seats Available"}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {index % 2 === 0
                  ? "Join industry experts to explore the latest trends in technology."
                  : "Meet top companies, explore career opportunities, and expand your network."}
              </p>

              {/* Register Button */}
              <Link href="/auth/register">
                <button className="w-full bg-[#2f6f73] text-white py-2 rounded-md transition-all duration-200 hover:bg-[#255a5e]">
                  Register Now
                </button>
              </Link>

            </div>
          ))}

        </div>
      </div>
    </>
  );
}