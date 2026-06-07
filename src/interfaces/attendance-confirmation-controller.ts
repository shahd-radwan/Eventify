// src/interfaces/attendance-confirmation-controller.ts

export interface ConfirmAttendanceRequest {
  token: string;
}

export interface ConfirmAttendanceResponse {
  id: number;
  userId: number;
  eventId: number;
  registrationId: number;
  confirmedAt: string;
}