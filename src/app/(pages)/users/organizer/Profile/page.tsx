"use client";

import { useState, useEffect } from "react";

import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { apiServices } from "@/services/api";

import {
  Event,
  GetAllEventsResponse,
} from "@/interfaces/event-controller";

import { User } from "@/interfaces/user-controller";

import {
  Calendar,
  Clock,
  Edit3,
  MapPin,
  Trash2,
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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ================= MODAL =================
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();

  const token = (session as SessionUser | null)?.accessToken;

  // ================= FETCH USER + EVENTS =================
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!token) return;

      try {
        setLoading(true);

        const userRes: User | null = await apiServices.getMe(token);
        setUser(userRes);

        const eventsRes: GetAllEventsResponse =
          await apiServices.getEvents(token);

        if (userRes?.id) {
          const myEvents: Event[] = eventsRes
            .filter((event: Event) => event.organizerId === userRes.id)
            .sort(
              (a: Event, b: Event) =>
                new Date(b.startDateTime).getTime() -
                new Date(a.startDateTime).getTime()
            )
            .slice(0, 3);

          setEvents(myEvents);
        }
      } catch (err) {
        console.log("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, pathname]);

  // ================= EDIT =================
  const handleEdit = (id: number): void => {
    router.push(`/users/organizer/Create-event?edit=${id}`);
  };

  // ================= DELETE =================
  const handleDelete = async (
    id: number,
    eventType: "PUBLIC" | "PRIVATE"
  ): Promise<void> => {
    if (!token) return;

    try {
      setDeletingId(id);

      const success: boolean = await apiServices.deleteEvent(token, id);

      if (!success) {
        setShowDeleteModal(true);

        setDeleteMessage(
          eventType === "PRIVATE"
            ? "This private event cannot be deleted because users are already registered for it."
            : "This event cannot be deleted because users are already registered for it."
        );

        return;
      }

      setEvents((prev: Event[]) =>
        prev.filter((event: Event) => event.id !== id)
      );
    } catch (err) {
      console.log("DELETE ERROR:", err);

      setShowDeleteModal(true);

      setDeleteMessage(
        eventType === "PRIVATE"
          ? "This private event cannot be deleted because users are already registered for it."
          : "This event cannot be deleted because users are already registered for it."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= LOADING =================
 if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">

      {/* ================= PROFILE ================= */}
      <div className="p-6 rounded-xl flex justify-between items-start">

        <div className="flex items-start gap-8">

          
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
  <img
    src="/Ellipse 1.png"
    alt="profile"
    className="w-full h-full object-cover"
  />
</div>

          <div>
            <p className="text-base font-semibold">
              Name :{" "}
              {user?.name || (session as SessionUser)?.user?.name}
            </p>

            <p className="text-sm text-gray-700">
              Email :{" "}
              {user?.email || (session as SessionUser)?.user?.email}
            </p>

            <p className="text-sm mt-2 text-gray-600">
              Event organizer using Eventify to create, manage, and deliver seamless events with efficient registration and QR-based access
            </p>
          </div>

        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="bg-[#1c6b68] text-white px-4 py-1 rounded-full text-sm">
            {user?.role || (session as SessionUser)?.user?.role}
          </p>

          <button
            onClick={() =>
              router.push("/users/organizer/Profile/edit")
            }
            className="border border-[#1c6b68] text-[#1c6b68] px-4 py-1 rounded-full text-sm bg-white"
          >
            Edit
          </button>
        </div>

      </div>

      {/* ================= EVENTS ================= */}
      <div className="mt-10">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-[#1c6b68]">
            <span className="w-1 h-6 bg-[#1c6b68] rounded"></span>
            My Events
          </h2>

          <button
            onClick={() => router.push("/users/organizer/EventsPage")}
            className="bg-[#7fb3b5] text-black px-5 py-2 rounded-full text-md hover:opacity-90 transition"
          >
            View All Events
          </button>
        </div>

        <br />
        <br />

        {events.length === 0 ? (
          <div className="w-full flex items-center justify-center">
            <div className="bg-white w-full h-[220px] rounded-xl shadow border border-gray-100 flex items-center justify-center">

              <button
                onClick={() => router.push("/users/organizer/Create-event")}
                className="bg-[#1c6b68] text-white px-8 py-3 rounded-full text-sm shadow-sm"
              >
                Create Event
              </button>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {events.map((event: Event) => (
              <div
                key={event.id}
                className="bg-[#e0e0e0] rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-all duration-300"
              >

                <div className="flex justify-end">
                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white ${
                      event.eventType === "PRIVATE"
                        ? "bg-[#3E7B7C]"
                        : "bg-[#7BB0B1]"
                    }`}
                  >
                    {event.eventType}
                  </span>
                </div>

                <h2 className="font-semibold text-lg mt-2 text-gray-800">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-700 mt-1">
                  {event.description}
                </p>

                <div className="text-sm text-gray-700 mt-3 space-y-2">

                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    start {new Date(event.startDateTime).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    end {new Date(event.endDateTime).toLocaleString()}
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

                {/* ACTIONS (بدون تغيير) */}
                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() => handleEdit(event.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1c6b68] text-white py-2 rounded-full text-sm hover:opacity-90 transition"
                  >
                    <Edit3 size={16} />
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete(event.id, event.eventType)}
                    disabled={deletingId === event.id}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-500 py-2 rounded-full text-sm hover:bg-red-50 hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deletingId === event.id ? "Deleting..." : "Delete"}
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ================= MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center">

            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="text-red-500" size={28} />
            </div>

            <h2 className="text-lg font-semibold text-[#1c6b68] mb-3">
              Event Cannot Be Deleted
            </h2>

            <p className="text-gray-600 text-sm">
              {deleteMessage}
            </p>

            <button
              onClick={() => setShowDeleteModal(false)}
              className="mt-6 bg-[#1c6b68] text-white px-6 py-2 rounded-full"
            >
              OK
            </button>

          </div>

        </div>
      )}

    </div>
  );
}