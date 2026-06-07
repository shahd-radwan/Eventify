// // src/interfaces/registration-controller.ts

// export interface CreateRegistrationRequest {
//   eventId: number;
//   invitationId: number;
// }

// export interface RegistrationResponse {
//   id: number;
//   userId: number;
//   eventId: number;
//   invitationId: number;
//   registrationToken: string;
//   registeredAt: string;
// }

// export interface GetRegistrationByInvitationResponse {
//   eventId: number;
//   invitationId: number;
// }

// src/interfaces/registration-controller.ts

export interface CreateRegistrationRequest {
  eventId: number;
  invitationId: number;
}

export interface RegistrationResponse {
  id: number;
  userId: number;
  eventId: number;
  invitationId: number;
  registrationToken: string;
  registeredAt: string;
}

export interface GetRegistrationByInvitationResponse {
  eventId: number;
  invitationId: number;
}