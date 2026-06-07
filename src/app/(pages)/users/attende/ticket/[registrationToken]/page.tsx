"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";

import {
  Ticket,
  Calendar,
  User,
  Hash,
} from "lucide-react";

import { apiServices } from "@/services/api";
import { RegistrationResponse } from "@/interfaces/registration-controller";

interface SessionType {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

export default function TicketPage() {
  const params = useParams<{ registrationToken: string }>();

  const registrationToken: string | undefined = params?.registrationToken;

  const { data: session } = useSession();

  const token: string | undefined =
    (session as SessionType | null)?.accessToken ??
    (session as SessionType | null)?.user?.accessToken;

  const [registration, setRegistration] =
    useState<RegistrationResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTicket = async (): Promise<void> => {
      if (!token || !registrationToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiServices.getRegistrationByToken(
          token,
          registrationToken
        );

        setRegistration(data);
      } catch (error) {
        console.log("TICKET ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [token, registrationToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="bg-white p-8 rounded-xl shadow">
          Ticket not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-8">

      {/* TITLE */}
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-medium text-[#1c6b68] flex items-center gap-3">
          <span className="w-[5px] h-10 bg-[#6aaeb0] rounded-full"></span>
          My Ticket
        </h1>

        <p className="text-gray-600 mt-3">
          Your event registration ticket.
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-2xl bg-[#e0e0e0] rounded-2xl p-8 shadow-sm mx-auto">

        <div className="flex justify-center mb-6">
          <Ticket size={70} className="text-[#1c6b68]" />
        </div>

        {/* QR CODE */}
        <div className="flex justify-center mb-8">
          <QRCodeCanvas
            value={registration.registrationToken}
            size={180}
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-5 text-gray-800">

          <div className="flex items-center gap-3">
            <Hash size={18} />
            <span>Registration ID: {registration.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <User size={18} />
            <span>User ID: {registration.userId}</span>
          </div>

          <div className="flex items-center gap-3">
            <Ticket size={18} />
            <span>Event ID: {registration.eventId}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={18} />
            <span>
              Registered At:{" "}
              {new Date(registration.registeredAt).toLocaleString()}
            </span>
          </div>

        </div>

        {/* TOKEN */}
        {/* <div className="mt-8">
          <p className="text-sm text-gray-600 mb-2">
            Registration Token
          </p>

          <div className="bg-white p-4 rounded-xl break-all font-mono text-sm">
            {registration.registrationToken}
          </div>
        </div> */}

      </div>

    </div>
  );
}