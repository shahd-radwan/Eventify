// src/interfaces/auth.ts

// ===================
// Login
// ===================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  token: string;
  name: string;
  role: "ORGANIZER" | "ATTENDEE";
  message: string;
}


// ===================
// Signup Request
// ===================
export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "ATTENDEE" | "ORGANIZER"; // المستخدم يختار
}

// ===================
// Signup Response
// ===================
export interface SignupResponse {
  token: string | null;
  name: string;
  role: "ATTENDEE" | "ORGANIZER";
  message: string;
}



// ===================
// Verify OTP
// ===================

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  token?: string | null;
  name: string;
  role: "ORGANIZER" | "ATTENDEE";
  message: string;
}

// ===================
// Resend OTP
// ===================
export interface ResendOtpRequest {
  email: string;
}

// الرد مجرد string
export type ResendOtpResponse = string;

