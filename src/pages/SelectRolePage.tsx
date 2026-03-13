import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { userApi } from "../services/api";
import "./Index.tsx";

type RoleOption = "student" | "mentor";

export default function SelectRolePage() {
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<RoleOption | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if user is not signed in
  useEffect(() => {
    if (isSignedIn === false) {
      navigate("/sign-in");
    }
  }, [isSignedIn, navigate]);

  if (!isSignedIn) {
    return <div className="p-10 text-center">Redirecting...</div>;
  }

  const handleContinue = async () => {
    if (!selected) return;

    setLoading(true);

    try {
      await userApi.setRole(selected);

      toast.success(`Welcome as a ${selected}!`);

      // Redirect based on role
      if (selected === "mentor") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Failed to set role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles: {
    value: RoleOption;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "student",
      label: "Student",
      desc: "Browse mentors, book sessions, and learn new skills",
      icon: <GraduationCap className="h-8 w-8" />,
    },
    {
      value: "mentor",
      label: "Mentor",
      desc: "Share your expertise, teach students, and earn",
      icon: <BookOpen className="h-8 w-8" />,
    },
  ];

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display mb-2">
            How will you use <span className="text-primary">SkillMentor</span>?
          </h1>

          <p className="text-muted-foreground">
            Choose your role to get started. You can change this later.
          </p>
        </div>

        <div className="grid gap-4">
          {roles.map((role) => (
            <motion.button
              key={role.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(role.value)}
              className={`flex items-center gap-4 rounded-2xl border-2 p-6 text-left transition-all ${
                selected === role.value
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                  selected === role.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {role.icon}
              </div>

              <div>
                <h3 className="text-lg font-semibold">{role.label}</h3>
                <p className="text-sm text-muted-foreground">{role.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected || loading}
          size="lg"
          className="w-full mt-6 rounded-full shadow-md shadow-primary/20"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}

          Continue as {selected || "..."}
        </Button>
      </motion.div>
    </main>
  );
}