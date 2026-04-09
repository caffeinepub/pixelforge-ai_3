import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== undefined;
  const isLoading = loginStatus === "logging-in";
  const isIdle = loginStatus === "idle";

  return {
    identity,
    isAuthenticated,
    isLoading,
    isIdle,
    loginStatus,
    login,
    logout: clear,
  };
}
