import { useAuth } from "../contexts/AuthContext";
import { useMySessions } from "../hooks/useApi";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { mockSessions } from "../data/mockData";
import {
  CalendarCheck,
  BookOpen,
  Clock,
  Mail,
  User,
  Star,
} from "lucide-react";

export default function ProfilePage() {
  const { isSignedIn, user } = useAuth();

  if (!isSignedIn || !user) return <Navigate to="/" replace />;

  const { data: apiSessions } = useMySessions();
  const sessions = apiSessions || mockSessions.filter((s) => s.studentName === user.name);

  const upcoming = sessions.filter((s) => s.sessionStatus !== "completed" && s.sessionStatus !== "cancelled");
  const completed = sessions.filter((s) => s.sessionStatus === "completed");
  const totalHours = sessions.reduce((a, s) => a + s.duration, 0) / 60;

  // Unique subjects from sessions
  const subjects = [...new Set(sessions.map((s) => s.subjectName))];
  // Unique mentors
  const mentors = [...new Set(sessions.map((s) => s.mentorName))];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    { icon: CalendarCheck, label: "Upcoming", value: upcoming.length, color: "text-info" },
    { icon: BookOpen, label: "Completed", value: completed.length, color: "text-success" },
    { icon: Clock, label: "Total Hours", value: `${totalHours}h`, color: "text-primary" },
    { icon: Star, label: "Mentors", value: mentors.length, color: "text-accent-foreground" },
  ];

  return (
    <main className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Profile Header */}
        <Card className="border-border/30 bg-card/40 backdrop-blur-sm p-8 shadow-xs">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-lg">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold font-display">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-3xl font-extrabold tracking-tight">{user.name}</h1>
              <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <Badge variant="secondary" className="text-xs capitalize">{user.role}</Badge>
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex items-center gap-4 border-border/30 bg-card/40 backdrop-blur-sm p-5 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Enrolled Subjects */}
        <Card className="border-border/30 bg-card/40 backdrop-blur-sm p-6 shadow-xs">
          <h2 className="font-display text-lg font-bold mb-4">Enrolled Subjects</h2>
          {subjects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No subjects yet. Book a session to get started!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Badge key={subject} variant="outline" className="rounded-full border-primary/30 text-foreground px-3 py-1">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Mentors Worked With */}
        <Card className="border-border/30 bg-card/40 backdrop-blur-sm p-6 shadow-xs">
          <h2 className="font-display text-lg font-bold mb-4">Mentors</h2>
          {mentors.length === 0 ? (
            <p className="text-muted-foreground text-sm">No mentors yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mentors.map((mentor) => (
                <Badge key={mentor} variant="secondary" className="rounded-full px-3 py-1">
                  {mentor}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </main>
  );
}
