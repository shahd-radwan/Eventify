// import { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: "ORGANIZER" | "ATTENDEE";
//     } & DefaultSession["user"];

//     accessToken?: string;
//   }

//   interface User extends DefaultUser {
//     role: "ORGANIZER" | "ATTENDEE";
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     accessToken?: string;
//     role?: "ORGANIZER" | "ATTENDEE";
//     name?: string;
//     email?: string;
//   }
// }
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ORGANIZER" | "ATTENDEE";
      name?: string;
      email?: string;
    } & DefaultSession["user"];

    accessToken?: string;
  }

  interface User extends DefaultUser {
    role: "ORGANIZER" | "ATTENDEE";
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: "ORGANIZER" | "ATTENDEE";
    name?: string;
    email?: string;
  }
}