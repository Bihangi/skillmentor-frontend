import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEnrollSession } from "../hooks/useApi";
import { ApiError } from "../services/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { toast } from "../hooks/use-toast";
import { Calendar, Clock, Timer, Loader2 } from "lucide-react";

interface BookingModalProps {
  mentor: { id: number; firstName: string; lastName: string; profileImageUrl: string };
  subject: { id: number; name: string };
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ mentor, subject, open, onClose }: BookingModalProps) {
  const { isSignedIn } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const enrollMutation = useEnrollSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({ title: "Please sign in", description: "You need to be signed in to book a session.", variant: "destructive" });
      return;
    }
    const selectedDate = new Date(`${date}T${time}`);
    if (selectedDate <= new Date()) {
      toast({ title: "Invalid date", description: "Please select a future date and time.", variant: "destructive" });
      return;
    }

    try {
      await enrollMutation.mutateAsync({
        mentorId: mentor.id,
        subjectId: subject.id,
        sessionDate: date,
        sessionTime: time,
        duration: Number(duration),
      });
      toast({
        title: "Session Booked! ✨",
        description: `Your session with ${mentor.firstName} for "${subject.name}" has been submitted.`,
      });
      onClose();
    } catch (error) {
      const message = error instanceof ApiError
        ? error.message
        : "Failed to book session. Please try again.";
      toast({ title: "Booking Failed", description: message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-border/50">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Book a Session</DialogTitle>
          <DialogDescription>
            Schedule a 1-on-1 with {mentor.firstName} {mentor.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-secondary/50 border border-border/30 p-3">
          <img src={mentor.profileImageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-medium">{mentor.firstName} {mentor.lastName}</p>
            <p className="text-xs text-primary">{subject.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date" className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Calendar className="h-3.5 w-3.5" /> Date
            </Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} required
              className="bg-secondary/50 border-border/50 focus:border-primary/50" />
          </div>
          <div>
            <Label htmlFor="time" className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Clock className="h-3.5 w-3.5" /> Time
            </Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required
              className="bg-secondary/50 border-border/50 focus:border-primary/50" />
          </div>
          <div>
            <Label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Timer className="h-3.5 w-3.5" /> Duration
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="glow" className="w-full" disabled={enrollMutation.isPending}>
            {enrollMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</>
            ) : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
