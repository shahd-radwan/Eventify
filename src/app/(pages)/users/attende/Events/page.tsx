// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// import {
//   Calendar,
//   Clock,
//   Users,
//   MapPin,
//   X,
// } from "lucide-react";

// import { apiServices } from "@/services/api";
// import { Event } from "@/interfaces/event-controller";
// import { CreateRegistrationRequest } from "@/interfaces/registration-controller";

// type TabType = "ALL" | "UPCOMING" | "PAST";

// interface SessionType {
//   accessToken?: string;
//   user?: {
//     accessToken?: string;
//   };
// }

// export default function MyEventsPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   const token: string | undefined =
//     (session as SessionType)?.accessToken ??
//     (session as SessionType)?.user?.accessToken;

//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [activeTab, setActiveTab] = useState<TabType>("ALL");

//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

//   const [registerLoadingId, setRegisterLoadingId] = useState<number | null>(null);

//   const [privatePopup, setPrivatePopup] = useState<{
//     open: boolean;
//     message: string;
//   }>({
//     open: false,
//     message: "",
//   });

//   // ================= FETCH EVENTS =================
//   useEffect(() => {
//     if (status === "loading") return;

//     const fetchEvents = async () => {
//       try {
//         setLoading(true);

//         if (!token) {
//           setEvents([]);
//           return;
//         }

//         const data = await apiServices.getEvents(token);

//         if (Array.isArray(data)) {
//           setEvents(data);
//         } else {
//           setEvents([]);
//         }
//       } catch (error) {
//         console.log("FETCH EVENTS ERROR:", error);
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [token, status]);

//   // ================= FILTER =================
//   const filteredEvents = useMemo(() => {
//     const now = new Date();

//     if (activeTab === "UPCOMING") {
//       return events.filter((e) => new Date(e.startDateTime) > now);
//     }

//     if (activeTab === "PAST") {
//       return events.filter((e) => new Date(e.endDateTime) < now);
//     }

//     return events;
//   }, [events, activeTab]);

//   // ================= REGISTER =================
//   // const handleRegister = async (event: Event) => {
//   //   if (!token) return;

//   //   // PRIVATE EVENT
//   //   if (event.eventType === "PRIVATE") {
//   //     setPrivatePopup({
//   //       open: true,
//   //       message:
//   //         "This is a private event. You cannot register unless you are invited.",
//   //     });
//   //     return;
//   //   }

//   //   try {
//   //     setRegisterLoadingId(event.id);

//   //     const response = await apiServices.createRegistration(token, {
//   //       eventId: event.id,
//   //       invitationId: 0, // ✅ مهم: ما نبعت رقم عشوائي
//   //     });

//   //     if (response) {
//   //       alert("Registration successful");
//   //     } else {
//   //       alert("Registration failed");
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //     alert("Something went wrong");
//   //   } finally {
//   //     setRegisterLoadingId(null);
//   //   }
//   // };

//   const handleRegister = async (event: Event) => {
//   if (!token) return;

//   if (event.eventType === "PRIVATE") {
//     setPrivatePopup({
//       open: true,
//       message:
//         "This is a private event. Registration is available only through an invitation link.",
//     });
//     return;
//   }

//   try {
//     setRegisterLoadingId(event.id);

//     const payload: CreateRegistrationRequest = {
//       eventId: event.id,
//       invitationId: undefined as unknown as number, // ما ينرسل فعليًا
//     };

//     const response = await apiServices.createRegistration(token, payload);

//     if (!response) {
//       alert("Registration failed");
//       return;
//     }

//     router.push(
//       `/users/attende/registration-success?token=${response.registrationToken}`
//     );
//   } catch (error) {
//     console.log("REGISTRATION ERROR:", error);
//     alert("Something went wrong");
//   } finally {
//     setRegisterLoadingId(null);
//   }
// };

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
//         <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f5f5] px-6 py-8">

//       {/* TITLE */}
//       <div className="mb-12">
//         <h1 className="text-3xl lg:text-4xl font-medium text-[#1c6b68] flex items-center gap-3">
//           <span className="w-[5px] h-10 bg-[#6aaeb0] rounded-full"></span>
//           My Events
//         </h1>

//         <p className="text-gray-600 mt-3 text-sm lg:text-base">
//           View and manage the events you've joined.
//         </p>
//       </div>

//       {/* ================= TABS ================= */}
//      <div className="flex justify-center gap-14 mb-12 flex-wrap">

//   {(["ALL", "UPCOMING", "PAST"] as TabType[]).map((tab) => (
//     <button
//       key={tab}
//       onClick={() => setActiveTab(tab)}
//       className="flex flex-col items-center text-[#1c6b68] text-xl font-semibold"
//     >
//       {tab.charAt(0) + tab.slice(1).toLowerCase()}

//       <span
//         className={`mt-2 h-[4px] rounded-full transition-all duration-300 ${
//           activeTab === tab
//             ? "w-[90px] bg-[#1c6b68]"
//             : "w-[90px] bg-[#6aaeb0]"
//         }`}
//       />
//     </button>
//   ))}

// </div>

//       {/* ================= EVENTS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         {filteredEvents.map((event) => (
//           <div
//             key={event.id}
//             className="bg-[#e0e0e0] rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition"
//           >

//             {/* TYPE (soft colors) */}
//             <div className="flex justify-end mb-3">
//               <span
//                 className={`px-3 py-1 rounded-full text-xs text-white ${
//                   event.eventType === "PUBLIC"
//                     ? "bg-[#1c6b68]"
//                     : "bg-[#6aaeb0]"
//                 }`}
//               >
//                 {event.eventType}
//               </span>
//             </div>

//             <h2 className="font-semibold text-lg text-gray-800">
//               {event.title}
//             </h2>

//             <p className="text-sm text-gray-700 mt-1 line-clamp-2">
//               {event.description}
//             </p>

//             <div className="text-sm text-gray-700 mt-4 space-y-3">

//               <div className="flex items-center gap-2">
//                 <Calendar size={14} />
//                 {new Date(event.startDateTime).toLocaleString()}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Clock size={14} />
//                 {new Date(event.endDateTime).toLocaleString()}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Users size={14} />
//                 {event.capacity}
//               </div>

//               <div className="flex items-center gap-2">
//                 <MapPin size={14} />
//                 {event.location}
//               </div>

//             </div>

//             {/* BUTTONS */}
//             {/* <div className="mt-auto flex gap-3 pt-6">

//               <button
//                 disabled={registerLoadingId === event.id}
//                 onClick={() => handleRegister(event)}
//                 className="flex-1 bg-[#1c6b68] text-white py-2 rounded-full hover:opacity-80 transition duration-500"
//               >
//                 {registerLoadingId === event.id
//                   ? "Loading..."
//                   : "Registration"}
//               </button>

//               <button
//                 onClick={() => setSelectedEvent(event)}
//                 className="flex-1 border border-[#1c6b68] text-[#1c6b68] py-2 rounded-full hover:bg-[#1c6b68] hover:text-white transition duration-500"
//               >
//                 Details
//               </button>

//             </div> */}
//             {/* BUTTONS */}
// <div className="mt-auto flex gap-3 pt-6">

//   {event.eventType === "PRIVATE" ? (
//     <button
//       disabled
//       className="flex-1 bg-gray-400 text-white py-2 rounded-full cursor-not-allowed"
//     >
//       Private Event
//     </button>
//   ) : (
//     <button
//       disabled={registerLoadingId === event.id}
//       onClick={() => handleRegister(event)}
//       className="flex-1 bg-[#1c6b68] text-white py-2 rounded-full hover:opacity-80 transition duration-500"
//     >
//       {registerLoadingId === event.id
//         ? "Loading..."
//         : "Registration"}
//     </button>
//   )}

//   <button
//     onClick={() => setSelectedEvent(event)}
//     className="flex-1 border border-[#1c6b68] text-[#1c6b68] py-2 rounded-full hover:bg-[#1c6b68] hover:text-white transition duration-500"
//   >
//     Details
//   </button>

// </div>

//           </div>
//         ))}

//       </div>

//       {/* ================= DETAILS MODAL (same UI style) ================= */}
//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

//           <div className="bg-[#f5f5f5] w-full max-w-2xl rounded-2xl p-6 relative shadow-xl">

//             <button
//               onClick={() => setSelectedEvent(null)}
//               className="absolute top-4 right-4 text-gray-600"
//             >
//               <X />
//             </button>

//             <span
//               className={`px-3 py-1 rounded-full text-xs text-white ${
//                 selectedEvent.eventType === "PUBLIC"
//                   ? "bg-[#6aaeb0]"
//                   : "bg-[#8c8c8c]"
//               }`}
//             >
//               {selectedEvent.eventType}
//             </span>

//             <h2 className="text-2xl font-bold text-[#1c6b68] mt-4">
//               {selectedEvent.title}
//             </h2>

//             <p className="text-gray-700 mt-4">
//               {selectedEvent.description}
//             </p>

//             <div className="mt-6 space-y-3 text-gray-700">

//               <div className="flex gap-2">
//                 <Calendar /> {new Date(selectedEvent.startDateTime).toLocaleString()}
//               </div>

//               <div className="flex gap-2">
//                 <Clock /> {new Date(selectedEvent.endDateTime).toLocaleString()}
//               </div>

//               <div className="flex gap-2">
//                 <Users /> {selectedEvent.capacity}
//               </div>

//               <div className="flex gap-2">
//                 <MapPin /> {selectedEvent.location}
//               </div>

//             </div>

//           </div>

//         </div>
//       )}

//       {/* ================= PRIVATE POPUP ================= */}
//       {privatePopup.open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//           <div className="bg-[#f5f5f5] p-6 rounded-2xl max-w-md text-center">

//             <h3 className="text-lg font-semibold text-[#1c6b68] mb-3">
//               Private Event
//             </h3>

//             <p className="text-gray-700">
//               {privatePopup.message}
//             </p>

//             <button
//               onClick={() => setPrivatePopup({ open: false, message: "" })}
//               className="mt-5 bg-[#1c6b68] text-white px-6 py-2 rounded-full"
//             >
//               OK
//             </button>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }








"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Calendar,
  Clock,
  Users,
  MapPin,
  X,
} from "lucide-react";

import { apiServices } from "@/services/api";
import { Event } from "@/interfaces/event-controller";
import { CreateRegistrationRequest } from "@/interfaces/registration-controller";

type TabType = "ALL" | "UPCOMING" | "PAST";

interface SessionType {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

export default function MyEventsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const token: string | undefined =
    (session as SessionType)?.accessToken ??
    (session as SessionType)?.user?.accessToken;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [registerLoadingId, setRegisterLoadingId] = useState<number | null>(null);
const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [privatePopup, setPrivatePopup] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  // ================= FETCH EVENTS =================
  useEffect(() => {
    if (status === "loading") return;

    const fetchEvents = async () => {
      try {
        setLoading(true);

        if (!token) {
          setEvents([]);
          return;
        }

        const data = await apiServices.getEvents(token);

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.log("FETCH EVENTS ERROR:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, status]);

  // ================= FILTER =================
  const filteredEvents = useMemo(() => {
    const now = new Date();

    if (activeTab === "UPCOMING") {
      return events.filter((e) => new Date(e.startDateTime) > now);
    }

    if (activeTab === "PAST") {
      return events.filter((e) => new Date(e.endDateTime) < now);
    }

    return events;
  }, [events, activeTab]);

  
  
 const handleRegister = async (event: Event) => {
  if (!token) return;

  if (event.eventType === "PRIVATE") {
    setPrivatePopup({
      open: true,
      message:
        "This is a private event. Registration is available only through an invitation link.",
    });
    return;
  }

  try {
    setRegisterLoadingId(event.id);

    const payload: CreateRegistrationRequest = {
      eventId: event.id,
      invitationId: undefined as unknown as number,
    };

    const response = await apiServices.createRegistration(
      token,
      payload
    );

    if (!response) return;

    const registered = JSON.parse(
      localStorage.getItem("registeredEvents") || "[]"
    );

    if (!registered.includes(event.id)) {
      registered.push(event.id);
    }

    localStorage.setItem(
      "registeredEvents",
      JSON.stringify(registered)
    );

    setRegisteredEvents(registered);

    router.push(
      `/users/attende/registration-success?token=${response.registrationToken}`
    );
  } catch (error: any) {
    console.log("REGISTRATION ERROR:", error);

    if (error.message === "ALREADY_REGISTERED") {
      const registered = JSON.parse(
        localStorage.getItem("registeredEvents") || "[]"
      );

      if (!registered.includes(event.id)) {
        registered.push(event.id);
      }

      localStorage.setItem(
        "registeredEvents",
        JSON.stringify(registered)
      );

      setRegisteredEvents(registered);

      return;
    }

    alert("Something went wrong");
  } finally {
    setRegisterLoadingId(null);
  }
};useEffect(() => {
  const registered = JSON.parse(
    localStorage.getItem("registeredEvents") || "[]"
  );

  setRegisteredEvents(registered);
}, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-8">

      {/* TITLE */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-medium text-[#1c6b68] flex items-center gap-3">
          <span className="w-[5px] h-10 bg-[#6aaeb0] rounded-full"></span>
          My Events
        </h1>

        <p className="text-gray-600 mt-3 text-sm lg:text-base">
          View and manage the events you've joined.
        </p>
      </div>

      {/* ================= TABS ================= */}
     <div className="flex justify-center gap-14 mb-12 flex-wrap">

  {(["ALL", "UPCOMING", "PAST"] as TabType[]).map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className="flex flex-col items-center text-[#1c6b68] text-xl font-semibold"
    >
      {tab.charAt(0) + tab.slice(1).toLowerCase()}

      <span
        className={`mt-2 h-[4px] rounded-full transition-all duration-300 ${
          activeTab === tab
            ? "w-[90px] bg-[#1c6b68]"
            : "w-[90px] bg-[#6aaeb0]"
        }`}
      />
    </button>
  ))}

</div>

      {/* ================= EVENTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#e0e0e0] rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition"
          >

            {/* TYPE (soft colors) */}
            <div className="flex justify-end mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs text-white ${
                  event.eventType === "PUBLIC"
                    ? "bg-[#1c6b68]"
                    : "bg-[#6aaeb0]"
                }`}
              >
                {event.eventType}
              </span>
            </div>

            <h2 className="font-semibold text-lg text-gray-800">
              {event.title}
            </h2>

            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {event.description}
            </p>

            <div className="text-sm text-gray-700 mt-4 space-y-3">

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

            {/* BUTTONS */}
  
            {/* BUTTONS */}
<div className="mt-auto flex gap-3 pt-6">

  {event.eventType === "PRIVATE" ? (
    <button
      disabled
      className="flex-1 bg-gray-400 text-white py-2 rounded-full cursor-not-allowed"
    >
      Private Event
    </button>
  ) : (
   
    <button
  disabled={
    registerLoadingId === event.id ||
    registeredEvents.includes(event.id)
  }
  onClick={() => handleRegister(event)}
  className={`flex-1 py-2 rounded-full text-white ${
    registeredEvents.includes(event.id)
      ? "bg-green-900 cursor-not-allowed"
      : "bg-[#1c6b68]"
  }`}
>
  {registerLoadingId === event.id
    ? "Loading..."
    : registeredEvents.includes(event.id)
    ? "Registered"
    : "Registration"}
</button>
  )}

  <button
    onClick={() => setSelectedEvent(event)}
    className="flex-1 border border-[#1c6b68] text-[#1c6b68] py-2 rounded-full hover:bg-[#1c6b68] hover:text-white transition duration-500"
  >
    Details
  </button>

</div>

          </div>
        ))}

      </div>

      {/* ================= DETAILS MODAL (same UI style) ================= */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

          <div className="bg-[#f5f5f5] w-full max-w-2xl rounded-2xl p-6 relative shadow-xl">

            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-600"
            >
              <X />
            </button>

            <span
              className={`px-3 py-1 rounded-full text-xs text-white ${
                selectedEvent.eventType === "PUBLIC"
                  ? "bg-[#6aaeb0]"
                  : "bg-[#8c8c8c]"
              }`}
            >
              {selectedEvent.eventType}
            </span>

            <h2 className="text-2xl font-bold text-[#1c6b68] mt-4">
              {selectedEvent.title}
            </h2>

            <p className="text-gray-700 mt-4">
              {selectedEvent.description}
            </p>

            <div className="mt-6 space-y-3 text-gray-700">

              <div className="flex gap-2">
                <Calendar /> {new Date(selectedEvent.startDateTime).toLocaleString()}
              </div>

              <div className="flex gap-2">
                <Clock /> {new Date(selectedEvent.endDateTime).toLocaleString()}
              </div>

              <div className="flex gap-2">
                <Users /> {selectedEvent.capacity}
              </div>

              <div className="flex gap-2">
                <MapPin /> {selectedEvent.location}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================= PRIVATE POPUP ================= */}
      {privatePopup.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-[#f5f5f5] p-6 rounded-2xl max-w-md text-center">

            <h3 className="text-lg font-semibold text-[#1c6b68] mb-3">
              Private Event
            </h3>

            <p className="text-gray-700">
              {privatePopup.message}
            </p>

            <button
              onClick={() => setPrivatePopup({ open: false, message: "" })}
              className="mt-5 bg-[#1c6b68] text-white px-6 py-2 rounded-full"
            >
              OK
            </button>

          </div>

        </div>
      )}

    </div>
  );
}