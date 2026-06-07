import NextAuth, { User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiServices } from "@/services/api";

interface AuthUser extends NextAuthUser {
  id: string;
  name: string;
  email: string;
  role: "ORGANIZER" | "ATTENDEE";
  token: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

     async authorize(credentials): Promise<any> {
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
    async jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;

        token.name = u.name;
        token.email = u.email;
        token.role = u.role;
        token.accessToken = u.token;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as any;
      }

      (session as any).accessToken = token.accessToken;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };