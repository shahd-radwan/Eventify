"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Calendar,
  Clock,
  Users,
  MapPin,
} from "lucide-react";

import { apiServices } from "@/services/api";
import { Event } from "@/interfaces/event-controller";

interface SessionType {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

export default function InvitationPage() {
  const router = useRouter();

  const params = useParams();
  const invitationToken = params?.token as string;

  const { data: session, status } = useSession();

  const token =
    (session as SessionType | null)?.accessToken ??
    (session as SessionType | null)?.user?.accessToken;

  const [event, setEvent] = useState<Event | null>(null);
  const [invitationId, setInvitationId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!invitationToken) {
      setLoading(false);
      return;
    }

    if (!token) {
      router.push(
        `/auth/login?redirect=/invitation/${invitationToken}`
      );
      return;
    }

    const loadInvitation = async () => {
      try {
        const invitation =
          await apiServices.getByInvitationToken(
            invitationToken
          );

        if (!invitation) {
          setLoading(false);
          return;
        }

        setInvitationId(invitation.invitationId);

        const eventData =
          await apiServices.getEventById(
            token,
            invitation.eventId
          );

        if (eventData) {
          setEvent(eventData);
        }
      } catch (error) {
        console.log("INVITATION ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [
    status,
    token,
    invitationToken,
    router,
  ]);

  const handleRegister = async () => {
    if (
      !event ||
      invitationId === null ||
      !token
    ) {
      return;
    }

    try {
      setRegistering(true);

      const registration =
        await apiServices.createRegistration(
          token,
          {
            eventId: event.id,
            invitationId,
          }
        );

      if (!registration) {
        alert("Registration failed");
        return;
      }

      router.push(
        `/users/attendee/registration-success?token=${registration.registrationToken}`
      );
    } catch (error: unknown) {
      console.log(
        "REGISTRATION ERROR:",
        error
      );

      const status =
        typeof error === "object" && error !== null
          ? (error as { status?: number; response?: { status?: number } }).status ??
            (error as { status?: number; response?: { status?: number } }).response?.status
          : undefined;

      if (status === 409) {
        alert(
          "You are already registered for this event"
        );
        return;
      }

      alert("Something went wrong");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="bg-white p-8 rounded-xl shadow">
          Invitation not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-8">

      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-medium text-[#1c6b68] flex items-center gap-3">
          <span className="w-[5px] h-10 bg-[#6aaeb0] rounded-full"></span>
          Event Invitation
        </h1>

        <p className="text-gray-600 mt-3">
          You have been invited to this event.
        </p>
      </div>

      <div className="max-w-3xl bg-[#e0e0e0] rounded-2xl p-6 shadow-sm">

        <div className="flex justify-end">
          <span className="px-3 py-1 rounded-full text-xs bg-[#6aaeb0] text-white">
            PRIVATE EVENT
          </span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {event.title}
        </h2>

        <p className="text-gray-700 mt-4">
          {event.description}
        </p>

        <div className="mt-6 space-y-4 text-gray-700">

          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(
              event.startDateTime
            ).toLocaleString()}
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} />
            {new Date(
              event.endDateTime
            ).toLocaleString()}
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} />
            {event.capacity}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {event.location}
          </div>

        </div>

        <button
          onClick={handleRegister}
          disabled={registering}
          className="w-full mt-8 bg-[#1c6b68] text-white py-3 rounded-full hover:opacity-80 transition duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registering
            ? "Registering..."
            : "Confirm Registration"}
        </button>

      </div>

    </div>
  );
}