"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { apiServices } from "@/services/api";
import { Event, GetAllEventsResponse } from "@/interfaces/event-controller";
import { User } from "@/interfaces/user-controller";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

interface SessionUser {
  accessToken: string;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export default function AttendeeProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const token = (session as SessionUser | null)?.accessToken;

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!token) return;

      try {
        setLoading(true);

        const userRes: User | null = await apiServices.getMe(token);
        setUser(userRes);

        const emailInitial =
  session?.user?.email?.charAt(0)?.toUpperCase() ?? "U";

        const eventsRes: GetAllEventsResponse =
          await apiServices.getEvents(token);

        setEvents(eventsRes);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">

     {/* ================= PROFILE ================= */}
<div className="bg-[#f5f5f5] rounded-xl overflow-hidden">

  {/* TOP PROFILE SECTION */}
  <div className="p-6 flex justify-between items-start">

    {/* LEFT SIDE */}
    <div className="flex items-start gap-8">

      {/* PROFILE IMAGE */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
        <img
          src="/Ellipse 1.png"
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
      
      

      {/* USER INFO */}
      <div>
        <p className="text-base font-semibold text-[#2a2a2a]">
          <span className="font-semibold">Name :</span>{" "}
          {user.name || (session as SessionUser)?.user?.name}
        </p>

        <p className="text-sm text-[#2a2a2a]">
          <span className="font-semibold">Email :</span>{" "}
          {user.email || (session as SessionUser)?.user?.email}
        </p>

        <p className="text-sm mt-2 text-gray-600 max-w-md">
          Attendee using Eventify to explore events, register easily,
          and receive invitations in real-time.
        </p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex flex-col items-end gap-2">

      <p className="bg-[#1c6b68] text-white px-4 py-1 rounded-full text-sm">
        {user.role || (session as SessionUser)?.user?.role}
      </p>

      <button
        onClick={() => router.push("/users/attende/Profile/edit")}
        className="border border-[#1c6b68] text-[#1c6b68] px-4 py-1 rounded-full text-sm bg-white"
      >
        Edit
      </button>

    </div>
  </div>
</div>
      {/* ================= EVENTS ================= */}

    
{/* REGISTERED EVENTS SECTION */}
<div className="mt-10">

  <div className="flex justify-between items-start mb-6">

    {/* LEFT */}
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2 text-[#1c6b68]">
        <span className="w-1 h-6 bg-[#1c6b68] rounded"></span>
        My Registered Events
      </h2>

      <p className="text-gray-700 text-[15px] mt-3 ml-3">
        Browse the events you’ve registered for and stay updated on your
        upcoming schedule.
      </p>
    </div>

    {/* BUTTON */}
    <button
      onClick={() => router.push("/users/attende/Events")}
      className="bg-[#7fb3b5] text-black px-5 py-2 rounded-full text-md hover:opacity-90 transition"
    >
      View All Events
    </button>

  </div>

</div>

<br />


     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {events
    .slice(0, 3) // أحدث 3 events فقط
    .map((event: Event) => (
      <div
        key={event.id}
        className="bg-[#e0e0e0] rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition"
      >

        <h2 className="font-semibold text-lg text-gray-800">
          {event.title}
        </h2>

        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
          {event.description}
        </p>

        <div className="text-sm text-gray-700 mt-3 space-y-2">

          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {new Date(event.startDateTime).toLocaleString()}
          </div>

          <div className="flex items-center gap-2">
            <Clock size={14} />
            {new Date(event.endDateTime).toLocaleString()}
          </div>

          <div className="flex items-center gap-2">
            <Users size={14} />
            {event.capacity}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} />
            {event.location}
          </div>

        </div>

        <br />

        {/* ================= FIXED BUTTON ================= */}
        <button
          onClick={() =>
            router.push(`/users/attende/Events`)
          }
          className="mt-auto bg-[#1c6b68] text-white py-2 rounded-full hover:opacity-90 transition"
        >
          Registration
        </button>

      </div>
    ))}

</div>
    </div>
  );
}