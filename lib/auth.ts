import { getServerSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateUniqueUsername } from "@/lib/username";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [ 
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: 'read:user user:email repo' } },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.usernameOrEmail },
              { username: credentials.usernameOrEmail }
            ]
          }
        });

        if (!user) throw new Error("Invalid credentials");

        if (!user.password) {
          const provider = user.lastLoginMethod === "GOOGLE" ? "Google" : "GitHub";
          throw new Error(`Account exists. Please log in using ${provider}.`);
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) throw new Error("Invalid credentials");

        return user;
      }
    })
  ],
  events: {
    async createUser({ user }) {
      if (!user.username && user.name) {
        const generatedUsername = await generateUniqueUsername(user.name);
        await prisma.user.update({
          where: { id: user.id },
          data: { username: generatedUsername }
        });
      }
    },

    async signIn({ user, account }) {
      if (user?.id && account?.provider) {
        const methodMap: Record<string, "GOOGLE" | "GITHUB" | "CREDENTIALS"> = {
          google: "GOOGLE", github: "GITHUB", credentials: "CREDENTIALS"
        };
        const loginMethod = methodMap[account.provider];

        if (loginMethod) {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginMethod: loginMethod }
          });
        }

        if (account.provider === "github" && account.access_token) {
          const existingToken = await prisma.githubToken.findFirst({
            where: { userId: user.id }
          });

          if (existingToken) {
            await prisma.githubToken.update({
              where: { id: existingToken.id },
              data: { token: account.access_token }
            });
          } else {
            await prisma.githubToken.create({
              data: { 
                userId: user.id, 
                token: account.access_token, 
                isDefault: true 
              }
            });
          }
        }
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
    }
  }
};

export async function getUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { user: null, error: "Not authenticated" };
    }

    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!dbUser) {
      return { user: null, error: "User not found" };
    }

    return { user: dbUser, error: null };
  } catch {
    return { user: null, error: "Not authenticated" };
  }
}