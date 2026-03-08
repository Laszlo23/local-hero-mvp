"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@once-ui-system/core";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
const hasValidPrivyAppId = /^cl[a-z0-9]{10,}$/i.test(privyAppId);

export function AuthControls() {
  if (!hasValidPrivyAppId) {
    return <span className="text-xs text-amber-300">Privy env missing</span>;
  }

  return <PrivyControlsInner />;
}

function PrivyControlsInner() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return <span className="text-xs text-slate-400">Auth loading...</span>;
  }

  if (!authenticated) {
    return (
      <Button type="button" onClick={login} size="s" variant="primary">
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-300">{user?.email?.address ?? "Wallet connected"}</span>
      <Button type="button" onClick={logout} size="s" variant="tertiary">
        Logout
      </Button>
    </div>
  );
}
