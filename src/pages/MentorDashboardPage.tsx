import { useAllSessions, useAddMeetingLink } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import { CalendarCheck, Clock, Users, BookOpen, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "../hooks/use-toast";
import { mockSessions } from "../data/mockData";

const statusMap: Record<string, "success" | "warning" | "info" | "destructive"> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "destructive",
};

export default function MentorDashboardPage() {
  const { isSignedIn, user, role } = useAuth();
  const [linkSession, setLinkSession] = useState<number | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const addLinkMutation = useAddMeetingLink();

  if (!isSignedIn) return <Navigate to="/" replace />;

  // Mentors see all sessions 
  const { data: apiSessions } = useAllSessions();
  const allSessions = apiSessions || mockSessions;

  const upcoming = allSessions.filter((s) => s.sessionStatus === "pending" || s.sessionStatus === "confirmed");
  const completed = allSessions.filter((s) => s.sessionStatus === "completed");
  const uniqueStudents = [...new Set(allSessions.map((s) => s.studentName))];

  const handleAddLink = async () => {
    if (!linkSession || !meetingLink.trim()) return;
    try {
      await addLinkMutation.mutateAsync({ id: linkSession, meetingLink });
      toast({ title: "Meeting link added", description: "Students can now join the session." });
      setLinkSession(null);
      setMeetingLink("");
    } catch {
      toast({ title: "Failed to add link", variant: "destructive" });
    }
  };

  return (
    <main className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">
          Mentor Dashboard <span className="inline-block animate-float">🎓</span>
        </h1>
        <p className="mb-10 text-muted-foreground">Manage your sessions and connect with students</p>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-4">
          {[
            { icon: CalendarCheck, label: "Upcoming", value: upcoming.length, color: "text-info" },
            { icon: BookOpen, label: "Completed", value: completed.length, color: "text-success" },
            { icon: Users, label: "Students", value: uniqueStudents.length, color: "text-primary" },
            { icon: Clock, label: "Total Hours", value: `${allSessions.reduce((a, s) => a + s.duration, 0) / 60}h`, color: "text-accent-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-5 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sessions table */}
        <div className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm overflow-hidden shadow-xs">
          <div className="border-b border-border/30 px-6 py-4">
            <h2 className="font-display text-lg font-bold">My Sessions</h2>
          </div>
          {allSessions.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No sessions yet. Students will appear here once they book.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Student</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Duration</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Payment</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSessions.map((session) => (
                  <TableRow key={session.id} className="border-border/20 hover:bg-secondary/30">
                    <TableCell className="font-medium">{session.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">{session.subjectName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {session.sessionDate} {session.sessionTime}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{session.duration}m</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[session.paymentStatus]}>{session.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[session.sessionStatus]}>{session.sessionStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!session.meetingLink && (session.sessionStatus === "pending" || session.sessionStatus === "confirmed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs text-primary border-primary/30 hover:bg-primary/10"
                            onClick={() => setLinkSession(session.id)}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            Add Link
                          </Button>
                        )}
                        {session.meetingLink && (
                          <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                              <Link2 className="h-3 w-3 mr-1" />
                              Meeting
                            </Badge>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>

      {/* Add Meeting Link Dialog */}
      <Dialog open={linkSession !== null} onOpenChange={() => setLinkSession(null)}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Add Meeting Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="https://meet.google.com/... or Zoom link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkSession(null)}>Cancel</Button>
            <Button onClick={handleAddLink} disabled={addLinkMutation.isPending || !meetingLink.trim()}>
              {addLinkMutation.isPending ? "Saving…" : "Save Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
