import { useState, useMemo } from "react";
import { mockSessions } from "../../data/mockData";
import type { Session } from "../../data/mockData";
import { useAllSessions, useConfirmPayment, useMarkComplete, useAddMeetingLink, useApproveReschedule, useRejectReschedule } from "../../hooks/useApi";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "../../components/ui/pagination";
import { Label } from "../../components/ui/label";
import { toast } from "../../hooks/use-toast";
import { Search, CheckCircle, Link as LinkIcon, Loader2, ArrowUp, ArrowDown, ArrowUpDown, CalendarClock, Check, X } from "lucide-react";

const statusMap: Record<string, "success" | "warning" | "info" | "destructive"> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "destructive",
  rejected: "destructive",
};

type SortKey = "id" | "studentName" | "mentorName" | "subjectName" | "sessionDate" | "paymentStatus" | "sessionStatus";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 8;

export default function ManageBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [meetingLinkDialog, setMeetingLinkDialog] = useState<number | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const { data: apiSessions } = useAllSessions();
  const [localSessions, setLocalSessions] = useState<Session[]>([...mockSessions]);
  const sessions = apiSessions || localSessions;

  const confirmPaymentMutation = useConfirmPayment();
  const markCompleteMutation = useMarkComplete();
  const addMeetingLinkMutation = useAddMeetingLink();
  const approveRescheduleMutation = useApproveReschedule();
  const rejectRescheduleMutation = useRejectReschedule();

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-40" />;
    return sortDir === "asc"
      ? <ArrowUp className="ml-1 inline h-3 w-3 text-primary" />
      : <ArrowDown className="ml-1 inline h-3 w-3 text-primary" />;
  };

  const filtered = useMemo(() => {
    let result = sessions.filter((s) => {
      const matchesSearch = `${s.studentName} ${s.mentorName}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.sessionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      const aVal = String(a[sortKey] ?? "");
      const bVal = String(b[sortKey] ?? "");
      const cmp = sortKey === "id" ? (a.id - b.id) : aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [sessions, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleStatusFilter = (v: string) => { setStatusFilter(v); setPage(1); };

  const confirmPayment = async (id: number) => {
    if (apiSessions) {
      try {
        await confirmPaymentMutation.mutateAsync(id);
        toast({ title: "Payment Confirmed ✓" });
      } catch { toast({ title: "Failed to confirm", variant: "destructive" }); }
    } else {
      setLocalSessions((prev) => prev.map((s) => s.id === id ? { ...s, paymentStatus: "confirmed", sessionStatus: "confirmed" } : s));
      toast({ title: "Payment Confirmed ✓" });
    }
  };

  const markComplete = async (id: number) => {
    if (apiSessions) {
      try {
        await markCompleteMutation.mutateAsync(id);
        toast({ title: "Session Completed ✓" });
      } catch { toast({ title: "Failed to complete", variant: "destructive" }); }
    } else {
      setLocalSessions((prev) => prev.map((s) => s.id === id ? { ...s, sessionStatus: "completed" } : s));
      toast({ title: "Session Completed ✓" });
    }
  };

  const addMeetingLinkFn = async () => {
    if (meetingLinkDialog && meetingLink) {
      if (apiSessions) {
        try {
          await addMeetingLinkMutation.mutateAsync({ id: meetingLinkDialog, meetingLink });
          toast({ title: "Meeting Link Added" });
        } catch { toast({ title: "Failed to add link", variant: "destructive" }); }
      } else {
        setLocalSessions((prev) => prev.map((s) => s.id === meetingLinkDialog ? { ...s, meetingLink } : s));
        toast({ title: "Meeting Link Added" });
      }
      setMeetingLinkDialog(null);
      setMeetingLink("");
    }
  };

  const handleApproveReschedule = async (id: number) => {
    try {
      await approveRescheduleMutation.mutateAsync(id);
      toast({ title: "Reschedule Approved ✓", description: "Session date has been updated." });
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    }
  };

  const handleRejectReschedule = async (id: number) => {
    try {
      await rejectRescheduleMutation.mutateAsync(id);
      toast({ title: "Reschedule Rejected", description: "Original date remains." });
    } catch {
      toast({ title: "Failed to reject", variant: "destructive" });
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "studentName", label: "Student" },
    { key: "mentorName", label: "Mentor" },
    { key: "subjectName", label: "Subject" },
    { key: "sessionDate", label: "Date" },
    { key: "paymentStatus", label: "Payment" },
    { key: "sessionStatus", label: "Status" },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">Bookings</h1>
      <p className="mb-8 text-muted-foreground">Manage all student sessions</p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search student or mentor..." value={search} onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50" />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-44 bg-secondary/50 border-border/50"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key}
                  className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort(col.key)}>
                  {col.label}
                  <SortIcon col={col.key} />
                </TableHead>
              ))}
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Duration</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No bookings found</TableCell>
              </TableRow>
            ) : paginated.map((s) => (
              <TableRow key={s.id} className="border-border/20 hover:bg-secondary/30">
                <TableCell className="font-mono text-xs text-muted-foreground">#{s.id}</TableCell>
                <TableCell className="font-medium">{s.studentName}</TableCell>
                <TableCell className="text-muted-foreground">{s.mentorName}</TableCell>
                <TableCell className="text-muted-foreground">{s.subjectName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.sessionDate} {s.sessionTime}
                  {(s as any).rescheduleStatus === "pending" && (s as any).requestedNewDate && (
                    <div className="mt-1">
                      <Badge variant="warning" className="text-[10px] gap-1">
                        <CalendarClock className="h-3 w-3" />
                        → {(s as any).requestedNewDate} {(s as any).requestedNewTime}
                      </Badge>
                      {(s as any).rescheduleReason && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 italic">"{(s as any).rescheduleReason}"</p>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{s.duration}m</TableCell>
                <TableCell><Badge variant={statusMap[s.paymentStatus]}>{s.paymentStatus}</Badge></TableCell>
                <TableCell><Badge variant={statusMap[s.sessionStatus]}>{s.sessionStatus}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {s.paymentStatus === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => confirmPayment(s.id)} className="h-7 text-xs gap-1 border-border/50"
                        disabled={confirmPaymentMutation.isPending}>
                        <CheckCircle className="h-3 w-3" /> Confirm
                      </Button>
                    )}
                    {s.sessionStatus === "confirmed" && (
                      <Button size="sm" variant="outline" onClick={() => markComplete(s.id)} className="h-7 text-xs border-border/50"
                        disabled={markCompleteMutation.isPending}>
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setMeetingLinkDialog(s.id)} className="h-7 w-7 p-0">
                      <LinkIcon className="h-3 w-3" />
                    </Button>
                    {(s as any).rescheduleStatus === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 text-success border-success/30 hover:bg-success/10"
                          onClick={() => handleApproveReschedule(s.id)}
                          disabled={approveRescheduleMutation.isPending}
                        >
                          <Check className="h-3 w-3" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => handleRejectReschedule(s.id)}
                          disabled={rejectRescheduleMutation.isPending}
                        >
                          <X className="h-3 w-3" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink isActive={p === page} onClick={() => setPage(p)} className="cursor-pointer">
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={meetingLinkDialog !== null} onOpenChange={() => setMeetingLinkDialog(null)}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Add Meeting Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Meeting URL</Label>
              <Input placeholder="https://meet.google.com/..." value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="mt-2 bg-secondary/50 border-border/50" />
            </div>
            <Button onClick={addMeetingLinkFn} variant="glow" disabled={addMeetingLinkMutation.isPending}>
              {addMeetingLinkMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
