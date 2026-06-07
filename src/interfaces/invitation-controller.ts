export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

/* =========================
   Invitation Entity
========================= */
export interface Invitation {
  id: number;
  eventId: number;
  email: string;
  status: InvitationStatus;
}

/* =========================
   POST /api/v1/invitations/send
========================= */
export interface SendInvitationRequest {
  eventId: number;
  email: string;
}

export type SendInvitationResponse = Invitation;

/* =========================
   GET /api/v1/invitations/me
========================= */
export type GetMyInvitationsResponse = Invitation[];