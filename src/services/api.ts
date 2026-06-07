// src/services/api.ts
import {
  LoginRequest,
  LoginResponse,
  SignupData,
  SignupResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/interfaces/auth";
import {
  GetMeResponse,
  UpdateUserResponse,
  GetUsersResponse,
  DeleteUserResponse,
  UpdateUserRequest,
} from "@/interfaces/user-controller";
import {
  CreateEventRequest,
  CreateEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
  DeleteEventResponse,
  GetEventByIdResponse,
  GetAllEventsResponse,
} from "@/interfaces/event-controller";
import {
  GetMyInvitationsResponse,
  SendInvitationRequest,
  SendInvitationResponse,
} from "@/interfaces/invitation-controller";
// ضيفي هاد الاستيراد فوق مع الباقي

import {
  CreateRegistrationRequest,
  RegistrationResponse,
  GetRegistrationByInvitationResponse,
} from "@/interfaces/registration-controller";
// ضيفي هاد الاستيراد فوق مع الباقي

import {
  ConfirmAttendanceRequest,
  ConfirmAttendanceResponse,
} from "@/interfaces/attendance-confirmation-controller";
export class ServicesApi {
  private baseUrl: string =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://imadapps.com";

  
  private getHeaders(token?: string) {
  return {
    "Content-Type": "application/json",
    Accept: "*/*",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

  // ===================
  // Login
  // ===================
  // async login(data: LoginRequest): Promise<LoginResponse> {
  //   const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
  //     method: "POST",
  //     headers: this.getHeaders(),
  //     body: JSON.stringify(data),
  //   });
  //   const json = await res.json();
  //   console.log("LOGIN RESPONSE:", json);
  //   return json;
  // }

  async login(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  console.log("LOGIN STATUS:", res.status);
  console.log("LOGIN RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

  
  // ===================
// Register
// ===================
async signup(data: SignupData): Promise<SignupResponse> {
  const res = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: this.getHeaders(),
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role, // يرسل حسب اختيار المستخدم
    }),
  });

  const text = await res.text();

  console.log("STATUS:", res.status);
  console.log("SIGNUP RESPONSE:", text);

  try {
    return JSON.parse(text);
  } catch {
    return {
      token: null,
      name: "",
      role: "ATTENDEE",
      message: text,
    };
  }
}

  // ===================
  // Verify OTP
  // ===================
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    // حسب Swagger السيرفر يريد email و otp كـ query parameters
    const query = new URLSearchParams({
      email: data.email,
      otp: data.otp,
    }).toString();

    const res = await fetch(`${this.baseUrl}/api/v1/auth/verify-otp?${query}`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    const json = await res.json();
    console.log("VERIFY OTP RESPONSE:", json);
    return json;
  }

  // ===================
  // Resend OTP
  // ===================
  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    // حسب Swagger السيرفر يريد email كـ query parameter
    const query = new URLSearchParams({ email: data.email }).toString();

    const res = await fetch(`${this.baseUrl}/api/v1/auth/resend-otp?${query}`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    const text = await res.text();
    console.log("RESEND OTP RESPONSE:", text);
    return text; // string فقط
  }


// ===================
// Get All Users
// ===================
async getUsers(token: string): Promise<GetUsersResponse | null> {
  const res = await fetch(`${this.baseUrl}/api/v1/users`, {
    method: "GET",
    headers: this.getHeaders(token),
  });

  if (!res.ok) return null;

  return await res.json();
}

// ===================
// Get Current User
// ===================
async getMe(token: string): Promise<GetMeResponse | null> {
  const res = await fetch(`${this.baseUrl}/api/v1/users/me`, {
    method: "GET",
    headers: this.getHeaders(token),
  });

  if (!res.ok) return null;

  return await res.json();
}

// ===================
// Update User
// ===================
async updateUser(
  token: string,
  data: UpdateUserRequest
): Promise<UpdateUserResponse | null> {
  const res = await fetch(`${this.baseUrl}/api/v1/users`, {
    method: "PUT",
    headers: this.getHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) return null;

  return await res.json();
}

// ===================
// Delete User
// ===================
async deleteUser(token: string): Promise<DeleteUserResponse> {
  const res = await fetch(`${this.baseUrl}/api/v1/users`, {
    method: "DELETE",
    headers: this.getHeaders(token),
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return;
}
 // ================= GET ALL EVENTS =================
async getEvents(token: string): Promise<GetAllEventsResponse> {
  const res = await fetch(`${this.baseUrl}/api/v1/events`, {
    method: "GET",
    headers: this.getHeaders(token),
  });

  if (!res.ok) {
    console.log("GET EVENTS ERROR:", res.status);
    return [];
  }

  return await res.json();
}

// ================= GET EVENT BY ID =================
async getEventById(
  token: string,
  id: number
): Promise<GetEventByIdResponse | null> {
  const res = await fetch(`${this.baseUrl}/api/v1/events/${id}`, {
    method: "GET",
    headers: this.getHeaders(token),
  });

  if (!res.ok) {
    console.log("GET EVENT ERROR:", res.status);
    return null;
  }

  return await res.json();
}

// ================= CREATE EVENT =================
async createEvent(
  token: string,
  data: CreateEventRequest
): Promise<CreateEventResponse | null> {
  const res = await fetch(`${this.baseUrl}/api/v1/events`, {
    method: "POST",
    headers: this.getHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("CREATE EVENT ERROR:", res.status);
    return null;
  }

  return await res.json();
}

// ================= UPDATE EVENT =================
async updateEvent(
  token: string,
  id: number,
  data: UpdateEventRequest
): Promise<UpdateEventResponse | null> {
  const res = await fetch(`${this.baseUrl}/api/v1/events/${id}`, {
    method: "PUT",
    headers: this.getHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("UPDATE EVENT ERROR:", res.status);
    return null;
  }

  return await res.json();
}

// ================= DELETE EVENT =================
async deleteEvent(
  token: string,
  id: number
): Promise<boolean> {
  const res = await fetch(`${this.baseUrl}/api/v1/events/${id}`, {
    method: "DELETE",
    headers: this.getHeaders(token),
  });

  if (!res.ok) {
    console.log("DELETE EVENT ERROR:", res.status);
    return false;
  }

  return true;
}

   // ===================
  // SEND INVITATION
  // POST /api/v1/invitations/send?eventId=&email=
  // ===================
  async sendInvitation(
    token: string,
    data: SendInvitationRequest
  ): Promise<SendInvitationResponse | null> {
    const query = new URLSearchParams({
      eventId: String(data.eventId),
      email: data.email,
    }).toString();

    const res = await fetch(
      `${this.baseUrl}/api/v1/invitations/send?${query}`,
      {
        method: "POST",
        headers: this.getHeaders(token),
      }
    );

    if (!res.ok) return null;

    return await res.json();
  }
      // ===================
  // GET MY INVITATIONS
  // GET /api/v1/invitations/me
  // ===================
  async getMyInvitations(
    token: string
  ): Promise<GetMyInvitationsResponse | null> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/invitations/me`,
      {
        method: "GET",
        headers: this.getHeaders(token),
      }
    );

    if (!res.ok) return null;

    return await res.json();
  }

// ===================
// CREATE REGISTRATION
// POST /api/v1/registrations
// ===================
// async createRegistration(
//   token: string,
//   data: CreateRegistrationRequest
// ): Promise<RegistrationResponse | null> {
//   const res = await fetch(`${this.baseUrl}/api/v1/registrations`, {
//     method: "POST",
//     headers: this.getHeaders(token),
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     console.log("CREATE REGISTRATION ERROR:", res.status);
//     return null;
//   }

//   return await res.json();
// }
// async createRegistration(
//   token: string,
//   data: CreateRegistrationRequest
// ): Promise<RegistrationResponse | null> {
//   const res = await fetch(`${this.baseUrl}/api/v1/registrations`, {
//     method: "POST",
//     headers: this.getHeaders(token),
//     body: JSON.stringify(data),
//   });

//   const text = await res.text();

//   console.log("CREATE REGISTRATION STATUS:", res.status);
//   console.log("CREATE REGISTRATION RESPONSE:", text);

//   if (!res.ok) {
//     return null;
//   }

//   return JSON.parse(text);
// }
async createRegistration(
  token: string,
  data: CreateRegistrationRequest
): Promise<RegistrationResponse | null> {
  const res = await fetch(`${this.baseUrl}/api/v1/registrations`, {
    method: "POST",
    headers: this.getHeaders(token),
    body: JSON.stringify(data),
  });

  const text = await res.text();

  console.log("CREATE REGISTRATION STATUS:", res.status);
  console.log("CREATE REGISTRATION RESPONSE:", text);

  if (res.status === 409) {
    throw new Error("ALREADY_REGISTERED");
  }

  if (!res.ok) {
    throw new Error("REGISTRATION_FAILED");
  }

  return JSON.parse(text);
}
// ===================
// GET REGISTRATION BY TOKEN
// GET /api/v1/registrations/{token}
// ===================
async getRegistrationByToken(
  token: string,
  registrationToken: string
): Promise<RegistrationResponse | null> {
  const res = await fetch(
    `${this.baseUrl}/api/v1/registrations/${registrationToken}`,
    {
      method: "GET",
      headers: this.getHeaders(token),
    }
  );

  if (!res.ok) {
    console.log("GET REGISTRATION ERROR:", res.status);
    return null;
  }

  return await res.json();
}

// ===================
// GET BY INVITATION TOKEN
// GET /api/v1/registrations/by-invitation/{token}
// ===================
async getByInvitationToken(
  invitationToken: string
): Promise<GetRegistrationByInvitationResponse | null> {
  const res = await fetch(
    `${this.baseUrl}/api/v1/registrations/by-invitation/${invitationToken}`,
    {
      method: "GET",
      headers: this.getHeaders(),
    }
  );

  if (!res.ok) {
    console.log("GET INVITATION TOKEN ERROR:", res.status);
    return null;
  }

  return await res.json();
}

// ===================
// CONFIRM ATTENDANCE
// POST /api/v1/attendance/confirm
// ===================
async confirmAttendance(
  token: string,
  data: ConfirmAttendanceRequest
): Promise<ConfirmAttendanceResponse | null> {
  const res = await fetch(
    `${this.baseUrl}/api/v1/attendance/confirm`,
    {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    console.log("CONFIRM ATTENDANCE ERROR:", res.status);
    return null;
  }

  return await res.json();
}

}

export const apiServices = new ServicesApi();



















 
  