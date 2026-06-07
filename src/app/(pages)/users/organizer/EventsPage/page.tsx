"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { apiServices } from "@/services/api";

import {
  Event,
  GetAllEventsResponse,
} from "@/interfaces/event-controller";

import {
  Calendar,
  Clock,
  Users,
  Edit3,
  Trash2,
} from "lucide-react";

interface SessionUser {
  accessToken: string;
}

interface MeResponse {
  id: number;
}

export default function OrganizerEventsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const token = (session as SessionUser | null)?.accessToken;

  const [events, setEvents] = useState<GetAllEventsResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // ================= FETCH EVENTS =================
  const fetchEvents = async (): Promise<void> => {
    if (!token) return;

    try {
      setLoading(true);

      const me = (await apiServices.getMe(token)) as MeResponse | null;
      const data: GetAllEventsResponse = await apiServices.getEvents(token);

      if (!me) {
        setEvents([]);
        return;
      }

      const myEvents: Event[] = data.filter(
        (event: Event) => event.organizerId === me.id
      );

      setEvents(myEvents);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  // ================= DELETE EVENT =================
  const handleDelete = async (event: Event): Promise<void> => {
    if (!token) return;

    try {
      setDeletingId(event.id);

      // small loading delay (UX)
      await new Promise((res) => setTimeout(res, 600));

      // PRIVATE → show modal
      if (event.eventType === "PRIVATE") {
        setShowDeleteModal(true);
        setDeleteMessage(
          "This private event cannot be deleted because users are already registered for it."
        );
        return;
      }

      // PUBLIC → delete normally
      const success: boolean = await apiServices.deleteEvent(
        token,
        event.id
      );

      if (success) {
        setEvents((prev) =>
          prev.filter((e) => e.id !== event.id)
        );
      }
    } catch (err) {
      console.log("DELETE ERROR:", err);

      setShowDeleteModal(true);
      setDeleteMessage("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= EDIT =================
  const handleEdit = (id: number): void => {
    router.push(`/users/organizer/Create-event?edit=${id}`);
  };

  // ================= FULL PAGE LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-[#1c6b68]">
            <span className="w-1 h-6 bg-[#1c6b68] rounded"></span>
            Your Events
          </h1>

          <p className="text-gray-600 mt-1">
            Manage and track all your created events
          </p>
        </div>

        <p className="bg-[#1c6b68] text-white px-4 py-1 rounded-full text-sm">
          {events.length} Total Events
        </p>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.length === 0 ? (
          <div className="text-gray-500">No events found</div>
        ) : (
          events.map((event: Event) => (
            <div
              key={event.id}
              className="bg-[#e0e0e0] rounded-xl p-5 flex flex-col shadow-sm"
            >
              {/* TITLE */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {event.title}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full text-white ${
                    event.eventType === "PRIVATE"
                      ? "bg-[#1c6b68]"
                      : "bg-[#3e7b7c]"
                  }`}
                >
                  {event.eventType === "PRIVATE" ? "Private" : "Public"}
                </span>
              </div>

              {/* DATE */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <Calendar size={16} />
                {new Date(event.startDateTime).toDateString()}
              </div>

              {/* TIME */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <Clock size={16} />
                {new Date(event.startDateTime).toLocaleTimeString()} -{" "}
                {new Date(event.endDateTime).toLocaleTimeString()}
              </div>

              {/* CAPACITY */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                <Users size={16} />
                {event.capacity} Seats
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-700 mb-5">
                {event.description}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-auto">

                <button
                  onClick={() => handleEdit(event.id)}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#1c6b68] text-[#1c6b68] py-2 rounded-lg bg-white
                  hover:bg-[#1c6b68] hover:text-white transition-all duration-500 ease-in-out"
                >
                  <Edit3 size={16} />
                  Update
                </button>

                <button
                  onClick={() => handleDelete(event)}
                  disabled={deletingId === event.id}
                  className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-600 py-2 rounded-lg bg-white
                  hover:bg-red-500 hover:text-white transition-all duration-500 ease-in-out
                  disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deletingId === event.id ? "Deleting..." : "Delete"}
                </button>

              </div>
            </div>
          ))
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
              className="mt-6 bg-[#1c6b68] text-white px-6 py-2 rounded-full
              hover:opacity-90 transition-all duration-500 ease-in-out"
            >
              OK
            </button>

          </div>
        </div>
      )}

    </div>
  );
}