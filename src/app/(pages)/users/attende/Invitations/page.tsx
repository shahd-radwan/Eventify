"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Mail, CheckCircle, Calendar, Clock, Users, MapPin } from "lucide-react";

import { apiServices } from "@/services/api";
import { Invitation } from "@/interfaces/invitation-controller";
import { Event } from "@/interfaces/event-controller";

export default function InvitationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [events, setEvents] = useState<Record<number, Event>>({});
  const [registerLoadingId, setRegisterLoadingId] = useState<number | null>(null);

  const token = (session as any)?.accessToken;

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }

    if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const invitationsData = await apiServices.getMyInvitations(token);

      if (!invitationsData || invitationsData.length === 0) {
        setInvitations([]);
        setEvents({});
        return;
      }

      setInvitations(invitationsData);

      const eventsMap: Record<number, Event> = {};

      await Promise.all(
        invitationsData.map(async (invitation) => {
          try {
            const event = await apiServices.getEventById(
              token,
              invitation.eventId
            );

            if (event) {
              eventsMap[event.id] = event;
            }
          } catch (err) {
            console.log(err);
          }
        })
      );

      setEvents(eventsMap);
    } catch (error) {
      console.log(error);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  // const handleRegister = async (invitation: Invitation) => {
  //   if (!token) return;

  //   try {
  //     const response = await apiServices.createRegistration(token, {
  //       eventId: invitation.eventId,
  //       invitationId: invitation.id,
  //     });

  //     if (!response?.registrationToken) {
  //       console.log("Registration response missing token");
  //       return;
  //     }

  //     localStorage.setItem(
  //       `registered_invitation_${invitation.id}`,
  //       "true"
  //     );

  //     router.push(
  //       `/users/attende/registration-success?token=${response.registrationToken}`
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleRegister = async (invitation: Invitation) => {
  if (!token) return;

  try {
    setRegisterLoadingId(invitation.id); // 🔥 start loading

    const response = await apiServices.createRegistration(token, {
      eventId: invitation.eventId,
      invitationId: invitation.id,
    });

    localStorage.setItem(
      `registered_invitation_${invitation.id}`,
      "true"
    );

    if (!response || !response.registrationToken) {
      console.log("Registration response missing token");
      return;
    }

    router.push(
      `/users/attende/registration-success?token=${response.registrationToken}`
    );
  } catch (error) {
    console.log(error);
  } finally {
    setRegisterLoadingId(null); // 🔥 stop loading
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      
       <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-medium text-[#1c6b68] flex items-center gap-3">
          <span className="w-[5px] h-10 bg-[#6aaeb0] rounded-full"></span>
          My Invitations
        </h1>
         <p className="text-gray-600 mt-3 text-sm lg:text-base">
          View and manage the Privet events you've joined.
        </p>
        </div>
        

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {invitations.map((invitation) => {
          const event = events[invitation.eventId];

          const isRegistered =
            typeof window !== "undefined" &&
            (localStorage.getItem(
              `registered_invitation_${invitation.id}`
            ) === "true" ||
              invitation.status === "ACCEPTED");

          return (
            <div
              key={invitation.id}
              className="bg-[#e0e0e0] rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition"
            >
              {/* TYPE BADGE */}
              <div className="flex justify-end mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs text-white ${
                    invitation.status === "PENDING"
                      ? "bg-[#6aaeb0]"
                      : invitation.status === "ACCEPTED"
                      ? "bg-green-800"
                      : "bg-gray-500"
                  }`}
                >
                  {invitation.status}
                </span>
              </div>

              {/* TITLE */}
              <h2 className="font-semibold text-lg text-gray-800">
                {event?.title ?? "Event"}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {event?.description ?? "No description"}
              </p>

              {/* INFO */}
              <div className="text-sm text-gray-700 mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {event?.startDateTime
                    ? new Date(event.startDateTime).toLocaleString()
                    : "N/A"}
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {event?.endDateTime
                    ? new Date(event.endDateTime).toLocaleString()
                    : "N/A"}
                </div>

                <div className="flex items-center gap-2">
                  <Users size={14} />
                  {event?.capacity ?? "-"}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {event?.location ?? "-"}
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  {invitation.email}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-auto flex gap-3 pt-6">
                {isRegistered ? (
                  <button
                    disabled
                    className="flex-1 bg-green-800 text-white py-2 rounded-full"
                  >
                    Registered
                  </button>
                ) : (
                 <button
  onClick={() => handleRegister(invitation)}
  disabled={registerLoadingId === invitation.id}
  className={`flex-1 py-2 rounded-full text-white transition ${
    registerLoadingId === invitation.id
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-[#1c6b68] hover:opacity-90"
  }`}
>
  {registerLoadingId === invitation.id
    ? "Loading..."
    : "Register"}
</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    
  );
  
}