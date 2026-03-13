import { useMySessions } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Upload, CheckCircle2, Image as ImageIcon, ArrowLeft, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "../hooks/use-toast";
import { sessionApi } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentPage() {
  const { isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionIdParam = searchParams.get("sessionId");
  const { data: sessions, isLoading } = useMySessions();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSignedIn) return <Navigate to="/" replace />;

  // Filter to pending-payment sessions
  const pendingSessions = sessions?.filter(
    (s) => s.paymentStatus === "pending" && (s.sessionStatus === "pending" || s.sessionStatus === "confirmed")
  ) ?? [];

  const selectedSession = sessionIdParam
    ? pendingSessions.find((s) => s.id === Number(sessionIdParam))
    : null;

  const displaySessions = selectedSession ? [selectedSession] : pendingSessions;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file (JPG, PNG, etc.)", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
    setUploadedUrl(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (sessionId: number) => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await sessionApi.uploadPaymentProof(sessionId, selectedFile);
      setUploadedUrl(preview);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
      toast({ title: "Payment proof uploaded!", description: "Admin will review and confirm your payment." });
    } catch {
      toast({ title: "Upload failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container max-w-3xl py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard"><ArrowLeft className="h-4 w-4" /></a>
          </Button>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <CreditCard className="h-7 w-7 text-primary" />
              Payment
            </h1>
            <p className="text-muted-foreground">Upload your bank slip to confirm payment</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : displaySessions.length === 0 ? (
          <Card className="glass border-border/50 p-10 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-success" />
            <p className="font-display text-lg font-bold">All caught up!</p>
            <p className="text-muted-foreground">No pending payments. All your sessions are paid.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {displaySessions.map((session) => {
              const hasProof = !!session.paymentProofUrl || (uploadedUrl && selectedSession?.id === session.id);
              return (
                <Card key={session.id} className="glass border-border/50 overflow-hidden">
                  {/* Session info header */}
                  <div className="border-b border-border/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-lg font-bold">{session.subjectName}</p>
                        <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
                      </div>
                      <Badge variant="warning">Payment Pending</Badge>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                      <span>📅 {session.sessionDate}</span>
                      <span>🕐 {session.sessionTime}</span>
                      <span>⏱ {session.duration}m</span>
                    </div>
                  </div>

                  {/* Upload area */}
                  <div className="p-6">
                    {hasProof ? (
                      <div className="flex flex-col items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-6">
                        <CheckCircle2 className="h-8 w-8 text-success" />
                        <p className="font-display font-bold text-success">Proof Uploaded</p>
                        <p className="text-sm text-muted-foreground">Waiting for admin confirmation</p>
                        {(session.paymentProofUrl || uploadedUrl) && (
                          <img
                            src={session.paymentProofUrl || uploadedUrl!}
                            alt="Payment proof"
                            className="mt-2 max-h-48 rounded-lg border border-border/50 object-contain"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Drop zone */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border/50 p-8 transition-colors hover:border-primary/50 hover:bg-secondary/20"
                        >
                          {preview ? (
                            <>
                              <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                              <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
                              <p className="text-xs text-primary">Click to change</p>
                            </>
                          ) : (
                            <>
                              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div className="text-center">
                                <p className="font-display font-bold">Upload Bank Slip</p>
                                <p className="text-sm text-muted-foreground">Click to select an image (JPG, PNG — max 5MB)</p>
                              </div>
                            </>
                          )}
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />

                        <Button
                          onClick={() => handleUpload(session.id)}
                          disabled={!selectedFile || uploading}
                          className="w-full gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {uploading ? "Uploading..." : "Submit Payment Proof"}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>
    </main>
  );
}
