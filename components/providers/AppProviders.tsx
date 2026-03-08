"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { DialogProvider, LayoutProvider, ThemeProvider } from "@once-ui-system/core";
import type { ReactNode } from "react";

type AppProvidersProps = {
  children: ReactNode;
};

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "local-hero-dev-app-id";
const hasValidPrivyAppId = /^cl[a-z0-9]{10,}$/i.test(privyAppId);

export function AppProviders({ children }: AppProvidersProps) {
  if (!hasValidPrivyAppId) {
    return (
      <LayoutProvider>
        <ThemeProvider
          theme="system"
          neutral="slate"
          brand="cyan"
          accent="green"
          border="rounded"
          surface="translucent"
        >
          <DialogProvider>{children}</DialogProvider>
        </ThemeProvider>
      </LayoutProvider>
    );
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ["wallet", "email", "google"],
        appearance: {
          theme: "dark",
          accentColor: "#14B8A6",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <LayoutProvider>
        <ThemeProvider
          theme="system"
          neutral="slate"
          brand="cyan"
          accent="green"
          border="rounded"
          surface="translucent"
        >
          <DialogProvider>{children}</DialogProvider>
        </ThemeProvider>
      </LayoutProvider>
    </PrivyProvider>
  );
}
