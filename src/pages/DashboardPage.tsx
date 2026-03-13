import { mockSessions } from "../data/mockData";
import { useMySessions, useCancelSession, useRequestReschedule } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import { CalendarCheck, Clock, BookOpen, ExternalLink, MessageSquarePlus, XCircle, CreditCard, CalendarClock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ReviewModal } from "../components/ReviewModal";
import { toast } from "../hooks/use-toast";

// Define a proper SessionDTO type
export interface SessionDTO {
  id: number;
  studentName: string;
  studentEmail: string;
  mentorName: string;
  mentorId: number;
  subjectName: string;
  subjectId: number;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  paymentStatus: "pending" | "completed" | "failed";
  sessionStatus: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  meetingLink?: string;
  paymentProofUrl?: string;

  // Reschedule fields
  rescheduleStatus?: "pending" | "approved" | "rejected" | null;
  requestedNewDate?: string;
  requestedNewTime?: string;
  rescheduleReason?: string;
}

// Map session/payment statuses to badge colors
const statusMap: Record<string, "success" | "warning" | "info" | "destructive"> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "destructive",
  rejected: "destructive",
};

export default function DashboardPage() {
  const { isSignedIn, user } = useAuth();
  const cancelMutation = useCancelSession();
  const rescheduleMutation = useRequestReschedule();

  // State hooks use SessionDTO | null
  const [reviewSession, setReviewSession] = useState<SessionDTO | null>(null);
  const [cancelSessionId, setCancelSessionId] = useState<number | null>(null);
  const [rescheduleSession, setRescheduleSession] = useState<SessionDTO | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ newDate: "", newTime: "", reason: "" });

  if (!isSignedIn) return <Navigate to="/" replace />;

  // Fetch sessions from API or fallback to mock data
  const { data: apiSessions } = useMySessions();
  const mySessions: SessionDTO[] = (apiSessions || mockSessions)
    .filter(s => s.studentName === user?.name)
    .map(s => ({
      id: s.id,
      studentName: s.studentName,
      studentEmail: s.studentEmail ?? "",
      mentorName: s.mentorName,
      mentorId: s.mentorId ?? 0,
      subjectName: s.subjectName,
      subjectId: s.subjectId ?? 0,
      sessionDate: s.sessionDate,
      sessionTime: s.sessionTime,
      duration: s.duration,
      paymentStatus: ["pending", "completed", "failed"].includes(s.paymentStatus) ? s.paymentStatus as "pending" | "completed" | "failed" : "pending",
      sessionStatus: ["pending", "confirmed", "completed", "cancelled", "rejected"].includes(s.sessionStatus) ? s.sessionStatus as "pending" | "confirmed" | "completed" | "cancelled" | "rejected" : "pending",
      meetingLink: s.meetingLink,
      paymentProofUrl: s.paymentProofUrl,
      rescheduleStatus: ["pending","approved","rejected"].includes(s.rescheduleStatus ?? "")
      ? (s.rescheduleStatus as "pending" | "approved" | "rejected")
      : null,
      requestedNewDate: s.requestedNewDate,
      requestedNewTime: s.requestedNewTime,
      rescheduleReason: s.rescheduleReason,
    }));

  const upcoming = mySessions.filter(s => s.sessionStatus !== "completed");
  const completed = mySessions.filter(s => s.sessionStatus === "completed");

  const handleReschedule = async () => {
    if (!rescheduleSession || !rescheduleForm.newDate || !rescheduleForm.newTime) return;
    try {
      await rescheduleMutation.mutateAsync({ id: rescheduleSession.id, data: rescheduleForm });
      toast({ title: "Reschedule Requested", description: "Admin will review your request." });
      setRescheduleSession(null);
      setRescheduleForm({ newDate: "", newTime: "", reason: "" });
    } catch {
      toast({ title: "Request failed", variant: "destructive" });
    }
  };

  return (
    <main className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">
          Hey, {user?.name?.split(" ")[0]} <span className="inline-block animate-float">👋</span>
        </h1>
        <p className="mb-10 text-muted-foreground">Track your sessions and learning progress</p>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: CalendarCheck, label: "Upcoming", value: upcoming.length, color: "text-info" },
            { icon: BookOpen, label: "Completed", value: completed.length, color: "text-success" },
            { icon: Clock, label: "Total Hours", value: `${mySessions.reduce((a, s) => a + s.duration, 0) / 60}h`, color: "text-primary" },
          ].map(stat => (
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

        {/* Sessions Table */}
        <div className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm overflow-hidden shadow-xs">
          <div className="border-b border-border/30 px-6 py-4">
            <h2 className="font-display text-lg font-bold">My Sessions</h2>
          </div>
          {mySessions.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No sessions yet. Browse mentors to book your first!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Mentor</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Duration</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Payment</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mySessions.map(session => (
                  <TableRow key={session.id} className="border-border/20 hover:bg-secondary/30">
                    <TableCell className="font-medium">{session.mentorName}</TableCell>
                    <TableCell className="text-muted-foreground">{session.subjectName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {session.sessionDate} {session.sessionTime}
                      {session.rescheduleStatus === "pending" && (
                        <Badge variant="warning" className="ml-2 text-[10px]">Reschedule pending</Badge>
                      )}
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
                        {session.meetingLink && (
                          <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {session.sessionStatus === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                            onClick={() => setReviewSession(session)}
                          >
                            <MessageSquarePlus className="h-3.5 w-3.5" />
                            Review
                          </Button>
                        )}
                        {session.paymentStatus === "pending" && !["cancelled","completed"].includes(session.sessionStatus) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs text-warning border-warning/30 hover:bg-warning/10"
                            asChild
                          >
                            <Link to={`/payment?sessionId=${session.id}`}>
                              <CreditCard className="h-3.5 w-3.5" />
                              Pay
                            </Link>
                          </Button>
                        )}
                        {(session.sessionStatus === "pending" || session.sessionStatus === "confirmed") && !session.rescheduleStatus && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs text-info border-info/30 hover:bg-info/10"
                            onClick={() => setRescheduleSession(session)}
                          >
                            <CalendarClock className="h-3.5 w-3.5" />
                            Reschedule
                          </Button>
                        )}
                        {(session.sessionStatus === "pending" || session.sessionStatus === "confirmed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => setCancelSessionId(session.id)}
                            disabled={cancelMutation.isPending}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </Button>
                        )}
                        {session.sessionStatus === "cancelled" && (
                          <span className="text-xs text-muted-foreground/50">Cancelled</span>
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

      {/* Review Modal */}
      {reviewSession && (
        <ReviewModal
          open={true}
          onClose={() => setReviewSession(null)}
          mentorId={reviewSession.mentorId}
          mentorName={reviewSession.mentorName}
          subjectId={reviewSession.subjectId}
          subjectName={reviewSession.subjectName}
        />
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={cancelSessionId !== null} onOpenChange={() => setCancelSessionId(null)}>
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Cancel Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Session</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!cancelSessionId) return;
                try {
                  await cancelMutation.mutateAsync(cancelSessionId);
                  toast({ title: "Session Cancelled", description: "Your session has been cancelled." });
                } catch {
                  toast({ title: "Failed to cancel", variant: "destructive" });
                }
                setCancelSessionId(null);
              }}
            >
              Cancel Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleSession} onOpenChange={() => setRescheduleSession(null)}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Reschedule Session
            </DialogTitle>
          </DialogHeader>
          {rescheduleSession && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border/30 bg-secondary/30 p-3 text-sm">
                <p className="font-medium">{rescheduleSession.subjectName} with {rescheduleSession.mentorName}</p>
                <p className="text-muted-foreground">Current: {rescheduleSession.sessionDate} at {rescheduleSession.sessionTime}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>New Date</Label>
                  <Input
                    type="date"
                    value={rescheduleForm.newDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setRescheduleForm(f => ({ ...f, newDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Time</Label>
                  <Input
                    type="time"
                    value={rescheduleForm.newTime}
                    onChange={(e) => setRescheduleForm(f => ({ ...f, newTime: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason (optional)</Label>
                <Textarea
                  rows={2}
                  placeholder="Why do you need to reschedule?"
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm(f => ({ ...f, reason: e.target.value }))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleSession(null)}>Cancel</Button>
            <Button
              onClick={handleReschedule}
              disabled={rescheduleMutation.isPending || !rescheduleForm.newDate || !rescheduleForm.newTime}
            >
              {rescheduleMutation.isPending ? "Submitting…" : "Request Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}