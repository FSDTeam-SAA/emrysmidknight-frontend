import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName: string;
      userName: string;
      email: string;
      role: string;
      bio?: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    role: string;
    bio?: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    role: string;
    bio?: string;
    accessToken: string;
  }
}