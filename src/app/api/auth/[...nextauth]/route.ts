import NextAuth, { User as NextAuthUser, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiServices } from "@/services/api";

interface AuthUser extends NextAuthUser {
  id: string;
  name: string;
  email: string;
  role: "ORGANIZER" | "ATTENDEE";
  token: string;
}

interface AuthToken extends JWT {
  accessToken?: string;
  role?: AuthUser["role"];
  name?: string;
  email?: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

     async authorize(credentials): Promise<AuthUser | null> {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Missing credentials");
  }

  const res = await apiServices.login({
    email: credentials.email,
    password: credentials.password,
  });

  console.log("LOGIN RESPONSE INSIDE NEXTAUTH:", res);

  // 🔥 أهم تعديل هنا
  if (!res || !res.token) {
    console.log("INVALID LOGIN RESPONSE");
    throw new Error(res?.message || "Invalid login");
  }

  return {
    id: res.id,
    name: res.name,
    email: res.email,
    role: res.role,
    token: res.token,
  };
}
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }: { token: AuthToken; user?: AuthUser }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: AuthToken }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as AuthUser["role"];
      }

      (session as Session & { accessToken?: string }).accessToken = token.accessToken;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };