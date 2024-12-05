import GoogleProvider from "next-auth/providers/google";
import prismadb from "@/lib/prismadb";
import {NextAuthOptions, Session} from "next-auth";
import {JWT} from "next-auth/jwt";
import {User} from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/signin',
    error: '/',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {

      if (url.includes('error=access_denied') || 
          url.includes('error=Callback') ||
          url.includes('error=OAuthSignin')) {
        return baseUrl; // Redirect to home page
      }

      // Default successful authentication redirect
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/home`;
        }
      return `${baseUrl}/home`;
    },
    async session({ session, token }: {session: Session, token: JWT}) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
      }
      return session;
    },
    async jwt({ token, trigger, session }: {token: JWT, trigger?: string, session?: Session}) {
      // Add handling for the "update" trigger with session data
      if (trigger === "update" && session?.user?.hasCompletedOnboarding) {
        token.hasCompletedOnboarding = session.user.hasCompletedOnboarding;
      }

      if (trigger === "update" || !token.hasCompletedOnboarding) {
        if (!token.email) return token;  // Add this line to handle null case
        
        const dbUser = await prismadb.user.findUnique({
          where: { email: token.email },
        });
  
          if (dbUser) {
              token.hasCompletedOnboarding = dbUser.hasCompletedOnboarding;
              token.id = dbUser.id;
          }
      }
      return token;
  },
    async signIn({ user }: {user: User | undefined}) {
      if (user?.email) {
        // Create or update user in database
        await prismadb.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || "",
          },
          create: {
            email: user.email,
            name: user.name || "",
            hasCompletedOnboarding: false,
          },
        });
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  debug: process.env.NODE_ENV === 'development',
};