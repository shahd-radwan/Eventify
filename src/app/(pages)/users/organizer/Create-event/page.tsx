"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Trash2,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { apiServices } from "@/services/api";

import {
  EventType,
  GetEventByIdResponse,
  CreateEventRequest,
  UpdateEventRequest,
} from "@/interfaces/event-controller";

interface SessionUser {
  accessToken: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const { data: session } = useSession();
  const token = (session as SessionUser | null)?.accessToken;

  // STATES
  const [type, setType] = useState<EventType>("PUBLIC");
  const [emails, setEmails] = useState<string[]>([""]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [capacity, setCapacity] = useState(1);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOAD EVENT (EDIT)
  useEffect(() => {
    const loadEvent = async () => {
      if (!token || !editId) return;

      const event: GetEventByIdResponse | null =
        await apiServices.getEventById(token, Number(editId));

      if (!event) return;

      setTitle(event.title);
      setDescription(event.description);
      setLocation(event.location);
      setCapacity(event.capacity);
      setType(event.eventType);

      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);

      setDate(start.toISOString().split("T")[0]);
      setTime(start.toTimeString().slice(0, 5));
      setEndDate(end.toISOString().split("T")[0]);
      setEndTime(end.toTimeString().slice(0, 5));
    };

    loadEvent();
  }, [token, editId]);

  // EMAILS
  const addEmailField = () => setEmails((prev) => [...prev, ""]);

  const updateEmail = (index: number, value: string) => {
    setEmails((prev) =>
      prev.map((e, i) => (i === index ? value : e))
    );
  };

  const removeEmail = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  // CREATE / UPDATE EVENT
  const handleCreate = async () => {
    setError("");

    if (!token) {
      setError("No token found");
      return;
    }

    if (
      !title ||
      !description ||
      !location ||
      !date ||
      !time ||
      !endDate ||
      !endTime
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const startDateTime = `${date}T${time}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;

      // UPDATE MODE
      if (editId) {
        const updatePayload: UpdateEventRequest = {
          title,
          description,
          location,
          startDateTime,
          endDateTime,
        };

        await apiServices.updateEvent(
          token,
          Number(editId),
          updatePayload
        );
      }

      // CREATE MODE
      else {
        const payload: CreateEventRequest = {
          title,
          description,
          location,
          capacity: Number(capacity),
          startDateTime,
          endDateTime,
          eventType: type,
        };

        const createdEvent = await apiServices.createEvent(
          token,
          payload
        );

        if (!createdEvent?.id) {
          setError("Event creation failed");
          return;
        }

        // PRIVATE → SEND INVITES
        if (type === "PRIVATE") {
          const validEmails = emails.filter((e) => e.trim());

          await Promise.all(
            validEmails.map((email) =>
              apiServices.sendInvitation(token, {
                eventId: createdEvent.id,
                email,
              })
            )
          );
        }
      }

      router.push("/users/organizer/EventsPage");
      router.refresh();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Label = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <label className="block text-gray-600 text-sm font-medium mb-1">
      {children}
    </label>
  );

  

  return (
    <div className="min-h-screen bg-[#f1f1f1] py-12 px-4">
      {/* HEADER */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-6 px-4">
        <h1 className="text-xl font-semibold border-l-4 border-[#1c6b68] pl-3 text-[#1c6b68]">
          {editId ? "Edit Event" : "Create Event"}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* FORM */}
        <div className="bg-white p-10 rounded-lg shadow-sm space-y-5">
          <div>
            <Label>Title</Label>

            <input
              className="w-full border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>

            <textarea
              className="w-full border p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Location</Label>

            <input
              className="w-full border p-2 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start</Label>

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                type="time"
                className="w-full border p-2 rounded mt-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <Label>End</Label>

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <input
                type="time"
                className="w-full border p-2 rounded mt-2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* TYPE */}
          <div>
            <Label>Type</Label>

            <select
              className={`w-full border p-2 rounded ${
                editId
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
              value={type}
              onChange={(e) =>
                setType(e.target.value as EventType)
              }
              disabled={!!editId}
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
          </div>

          {/* CAPACITY */}
          <div>
            <Label>Capacity</Label>

            <input
              type="number"
              className={`w-full border p-2 rounded ${
                editId
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
              value={capacity}
              onChange={(e) =>
                setCapacity(Number(e.target.value))
              }
              disabled={!!editId}
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-[#2a6f6d] text-white py-3 rounded"
          >
            {loading ? "Loading..." : "Save Event"}
          </button>
        </div>

        {/* PRIVATE UI */}
        {!editId && type === "PRIVATE" && (
          <div className="space-y-8">
            <p className="text-gray-800 text-lg">
              Add your guests emails and we’ll send them a
              QR code ticket they can use to join your
              event.
            </p>

            <div className="bg-white p-8 rounded shadow-sm space-y-4">
              <Label>Email Attendee</Label>

              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center border p-2 rounded"
                >
                  <input
                    className="flex-1 outline-none"
                    value={email}
                    onChange={(e) =>
                      updateEmail(index, e.target.value)
                    }
                  />

                  <button
                    onClick={() => removeEmail(index)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                onClick={addEmailField}
                className="ml-auto flex items-center justify-center border border-[#1c6b68] bg-[#1c6b68] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#155250] transition-all"
              >
                + Add more
              </button>
            </div>

            <h1 className="text-xl font-semibold flex items-center gap-2 mb-4 text-[#1c6b68]">
              <span className="w-1 h-6 bg-[#1c6b68] rounded"></span>
              Send Invitations
            </h1>

            <div className="bg-[#dfeaea] rounded-md py-12 px-8 flex flex-col items-center justify-center gap-6 w-full max-w-xl mx-auto">
              <div className="relative w-48 h-32 text-[#1c6b68]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>

                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-[#1c6b68] hover:bg-[#175957] transition-all duration-200 text-white px-7 py-3 rounded-full flex items-center gap-2 text-sm shadow-sm"
              >
                {loading
                  ? "Sending..."
                  : "Send Invitations"}

                <Send size={15} />
              </button>

              <p className="text-sm text-gray-600 text-center">
                Invited users will receive an email with
                their unique QR code
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}