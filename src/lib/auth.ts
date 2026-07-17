import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const prismaAdapter = PrismaAdapter(prisma);

const safeAdapter = new Proxy(prismaAdapter, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value === "function") {
      return async (...args: any[]) => {
        try {
          return await value.apply(target, args);
        } catch (error) {
          console.error(`PrismaAdapter: ${String(prop)} failed (DB offline):`, error);
          
          if (prop === "getUserByAccount") {
            return null;
          }
          if (prop === "getUserByEmail") {
            const email = args[0];
            return {
              id: "offline-google-user-id",
              email,
              name: "Google User (Offline)",
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
              emailVerified: new Date(),
            };
          }
          if (prop === "createUser") {
            const user = args[0];
            return {
              ...user,
              id: user.id || "offline-google-user-id",
            };
          }
          if (prop === "linkAccount") {
            const account = args[0];
            return account;
          }
          
          return null;
        }
      };
    }
    return value;
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: safeAdapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Demo Mode",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@seoptimised.com" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string) || "demo@seoptimised.com";
        
        try {
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: "Demo User",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (e) {
          console.error("Auth Credentials Error:", e);
          // Return a mock user anyway in case DB is not yet available, to prevent complete block
          return {
            id: "demo-user-id",
            name: "Demo User (Offline)",
            email,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
