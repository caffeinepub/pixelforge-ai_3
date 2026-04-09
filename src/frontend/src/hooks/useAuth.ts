import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, login, clear, isInitializing } =
    useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== undefined;
  // isLoading covers both "initializing" (loading saved identity from storage)
  // and "logging-in" (user actively completing II flow)
  const isLoading = isInitializing || loginStatus === "logging-in";
  const isIdle = loginStatus === "idle";

  return {
    identity,
    isAuthenticated,
    isLoading,
    isIdle,
    isInitializing,
    loginStatus,
    login,
    logout: clear,
  };
}
