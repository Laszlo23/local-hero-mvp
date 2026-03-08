import { verifyAccessToken } from "@privy-io/node";
import { headers } from "next/headers";

export type AuthContext = {
  userId: string;
  walletAddress?: string;
  isAuthenticated: boolean;
};

function getBearerToken(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const [scheme, token] = value.split(" ");
  if (!scheme || !token) {
    return null;
  }

  return scheme.toLowerCase() === "bearer" ? token : null;
}

export async function getAuthContext(): Promise<AuthContext> {
  const authHeader = headers().get("authorization");
  const token = getBearerToken(authHeader);

  if (!token || !process.env.PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
    return { userId: "anonymous", isAuthenticated: false };
  }

  try {
    const result = await verifyAccessToken({
      access_token: token,
      app_id: process.env.PRIVY_APP_ID,
      verification_key: process.env.PRIVY_APP_SECRET,
    });

    return {
      userId: result.user_id,
      isAuthenticated: true,
    };
  } catch {
    return { userId: "anonymous", isAuthenticated: false };
  }
}

export function requireAdmin(auth: AuthContext): void {
  const allowedAdmins = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!auth.isAuthenticated || !allowedAdmins.includes(auth.userId)) {
    throw new Error("Admin access required.");
  }
}
