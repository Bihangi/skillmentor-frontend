import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Star } from "lucide-react";
import { useCreateReview } from "../hooks/useApi";
import { toast } from "../hooks/use-toast";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  mentorId: number;
  mentorName: string;
  subjectId?: number;
  subjectName: string;
}

export function ReviewModal({ open, onClose, mentorId, mentorName, subjectId, subjectName }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    if (!comment.trim()) {
      toast({ title: "Please write a comment", variant: "destructive" });
      return;
    }

    createReview.mutate(
      { mentorId, subjectId, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          toast({ title: "Review submitted!", description: `Thanks for reviewing ${mentorName}.` });
          setRating(0);
          setComment("");
          onClose();
        },
        onError: () => {
          toast({ title: "Failed to submit review", variant: "destructive" });
        },
      }
    );
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Write a Review</DialogTitle>
          <DialogDescription>
            Rate your session with <span className="font-medium text-foreground">{mentorName}</span> — {subjectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Star Rating */}
          <div>
            <p className="mb-2 text-sm font-medium">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= displayRating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className="mb-2 text-sm font-medium">Comment</p>
            <Textarea
              placeholder="Share your experience with this mentor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={createReview.isPending}>
            {createReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
