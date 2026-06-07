"use client";

export function Footer() {
  return (
    <footer className="bg-[#174f4f] text-white ">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Left */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#2bb3ad]">
              Eventify
            </h2>

            <p className="text-sm text-gray-200 leading-relaxed">
              Plan, manage, and enjoy your events with seamless
              registration and QR ticketing.
            </p>
          </div>

          {/* Middle */}
          <div className="space-y-3 text-sm text-gray-200">
            <div>
              <p className="font-medium text-white">For Organizers</p>
              <p>Create and manage your events.</p>
            </div>

            <div className="mt-4">
              <p className="font-medium text-white">For Attendees</p>
              <p>Discover events and register with QR tickets.</p>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-2 text-sm text-gray-200">
            <p className="font-medium text-white mb-2">Support</p>
            <p className="hover:text-white cursor-pointer">Help Center</p>
            <p className="hover:text-white cursor-pointer">Contact Us</p>
            <p className="hover:text-white cursor-pointer">FAQ</p>
          </div>

          

        </div>

        {/* Bottom */}
        <div className="mt-10 text-sm text-gray-300">
          © 2026 Eventify. All rights reserved.
        </div>

      </div>
    </footer>
  );
}