
// ========================
// User Roles (ONLY 2 TYPES)
// ========================
export type UserRole = "ORGANIZER" | "ATTENDEE";

// ========================
// User Model
// ========================
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// ========================
// GET /api/v1/users
// ========================
export type GetUsersResponse = User[];

// ========================
// GET /api/v1/users/me
// ========================
export type GetMeResponse = User;

// ========================
// PUT /api/v1/users
// ========================
export interface UpdateUserRequest {
  name?: string;
  password?: string;
}

export type UpdateUserResponse = User;

// ========================
// DELETE /api/v1/users
// ========================
export type DeleteUserResponse = void;