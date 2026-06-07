// interfaces/event-controller.ts

export type EventType = "PUBLIC" | "PRIVATE";

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  capacity: number;
  startDateTime: string;
  endDateTime: string;
  eventType: EventType;
  organizerId: number;
}

// GET ALL EVENTS RESPONSE
export type GetAllEventsResponse = Event[];

// GET EVENT BY ID RESPONSE
export type GetEventByIdResponse = Event;

// CREATE EVENT REQUEST
export interface CreateEventRequest {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  eventType: EventType;
  capacity: number;
}

// CREATE EVENT RESPONSE
export type CreateEventResponse = Event;

// UPDATE EVENT REQUEST
export interface UpdateEventRequest {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
}

// UPDATE EVENT RESPONSE
export interface UpdateEventResponse {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
}

// DELETE EVENT RESPONSE
export interface DeleteEventResponse {
  status: number;
  message?: string;
}