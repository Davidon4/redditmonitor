import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
    email?: string
    name?: string
    image?: string
    hasCompletedOnboarding?: boolean
  }

  interface Session {
    user?: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    hasCompletedOnboarding?: boolean
  }
}