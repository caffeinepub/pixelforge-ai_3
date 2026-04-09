import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Images, LogOut, Menu, Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const navItems = [
  { label: "Generate", href: "/generate", icon: Sparkles },
  { label: "Gallery", href: "/gallery", icon: Images },
];

export function Layout({ children, requireAuth = false }: LayoutProps) {
  const { isAuthenticated, logout, login, isLoading, isInitializing } =
    useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // During initialization, don't gate content — the page components
  // handle their own auth-redirect logic after init completes.
  if (requireAuth && !isAuthenticated && !isInitializing) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className="sticky top-0 z-50 bg-card border-b border-border shadow-xs"
        data-ocid="header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group transition-smooth"
              data-ocid="nav-logo"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-elevation">
                <Zap className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-foreground">
                Neurō<span className="text-accent">Gen</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            {isAuthenticated && (
              <nav
                className="hidden md:flex items-center gap-1"
                data-ocid="nav-links"
              >
                {navItems.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-smooth",
                      currentPath === href
                        ? "bg-accent/15 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                    data-ocid={`nav-${label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    data-ocid="btn-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                  <button
                    type="button"
                    className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth text-muted-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    data-ocid="btn-mobile-menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                  data-ocid="btn-login"
                >
                  {isLoading ? "Connecting…" : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div
            className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1"
            data-ocid="mobile-nav"
          >
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                  currentPath === href
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                onClick={() => setMobileMenuOpen(false)}
                data-ocid={`mobile-nav-${label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-smooth"
              data-ocid="mobile-btn-logout"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 bg-background" data-ocid="main-content">
        {children}
      </main>

      <footer
        className="bg-card border-t border-border py-6 mt-auto"
        data-ocid="footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-accent" />
            </div>
            <span className="font-display font-medium text-foreground">
              NeurōGen
            </span>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
