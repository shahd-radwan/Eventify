
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [registrationToken, setRegistrationToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    setRegistrationToken(token);
  }, [searchParams]);

  const handleTicket = () => {
    if (!registrationToken) return;

    router.push(
      `/users/attende/ticket/${registrationToken}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">

      <div className="bg-[#e0e0e0] rounded-2xl p-10 max-w-xl w-full text-center shadow-sm">

        <CheckCircle size={70} className="mx-auto text-[#1c6b68]" />

        <h1 className="text-3xl font-semibold text-[#1c6b68] mt-6">
          Registration Successful
        </h1>

        <button
          onClick={handleTicket}
          disabled={!registrationToken}
          className="mt-6 bg-[#1c6b68] text-white py-3 px-6 rounded-full disabled:opacity-50"
        >
          My Ticket
        </button>

      </div>
    </div>
  );
}