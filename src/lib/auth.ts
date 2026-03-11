import bcrypt from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectToDatabase } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: parsedCredentials.data.email,
        }).lean();

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          parsedCredentials.data.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }

      if (session.user && token.email) {
        session.user.email = token.email;
      }

      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
