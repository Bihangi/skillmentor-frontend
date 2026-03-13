import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import { GraduationCap, LayoutDashboard, Shield } from "lucide-react";

export function Navbar() {
  const { isSignedIn, role, signIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:glow-primary transition-all duration-300">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Skill<span className="text-primary">Mentor</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Discover
          </Link>
          {isSignedIn && (
            <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              <LayoutDashboard className="mr-1 inline h-3.5 w-3.5" />
              Dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link to="/admin" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              <Shield className="mr-1 inline h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-1 ring-border hover:ring-primary/50 transition-all",
                },
              }}
            />
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button variant="glow" size="sm" asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
