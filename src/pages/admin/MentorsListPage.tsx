import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMentors, useUpdateMentor, useDeleteMentor } from "../../hooks/useApi";
import { mockMentors } from "../../data/mockData";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "../../components/ui/pagination";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../../components/ui/dialog";
import { motion } from "framer-motion";
import {
  Search, Plus, Star, Users, ArrowUp, ArrowDown, ArrowUpDown, Award, Pencil, Trash2,
} from "lucide-react";
import { toast } from "../../hooks/use-toast";

type SortKey = "id" | "name" | "profession" | "rating" | "reviewCount" | "totalStudents";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 8;

export default function MentorsListPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const { data: apiMentors, isLoading } = useMentors();
  const updateMutation = useUpdateMentor();
  const deleteMutation = useDeleteMentor();
  const mentors = apiMentors || mockMentors;

  const [editMentor, setEditMentor] = useState<{ id: number } | null>(null);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", profession: "", company: "", bio: "", profileImageUrl: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openEdit = (m: any) => {
    setEditMentor(m);
    setEditForm({
      firstName: m.firstName,
      lastName: m.lastName,
      profession: m.profession,
      company: m.company,
      bio: m.bio,
      profileImageUrl: m.profileImageUrl,
    });
  };

  const handleUpdate = async () => {
    if (!editMentor) return;
    try {
      await updateMutation.mutateAsync({ id: editMentor.id, data: editForm });
      toast({ title: "Mentor updated" });
      setEditMentor(null);
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({ title: "Mentor deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
    setDeleteId(null);
  };

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
    let result = mentors.filter((m) =>
      `${m.firstName} ${m.lastName} ${m.profession} ${m.company}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id": cmp = a.id - b.id; break;
        case "name": cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`); break;
        case "profession": cmp = a.profession.localeCompare(b.profession); break;
        case "rating": cmp = a.rating - b.rating; break;
        case "reviewCount": cmp = a.reviewCount - b.reviewCount; break;
        case "totalStudents": cmp = a.totalStudents - b.totalStudents; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [mentors, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const columns: { key: SortKey; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Mentor" },
    { key: "profession", label: "Profession" },
    { key: "rating", label: "Rating" },
    { key: "reviewCount", label: "Reviews" },
    { key: "totalStudents", label: "Students" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">Mentors</h1>
          <p className="text-muted-foreground">All mentors on the platform</p>
        </div>
        <Link to="/admin/mentors/create">
          <Button variant="glow" className="gap-2">
            <Plus className="h-4 w-4" /> Add Mentor
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mentors..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading mentors…</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/50 bg-card/50 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon col={col.key} />
                  </TableHead>
                ))}
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Subjects</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No mentors found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((m) => (
                  <TableRow key={m.id} className="border-border/20 hover:bg-secondary/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">#{m.id}</TableCell>
                    <TableCell>
                      <Link
                        to={`/mentors/${m.id}`}
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        <img
                          src={m.profileImageUrl}
                          alt={`${m.firstName} ${m.lastName}`}
                          className="h-9 w-9 rounded-lg object-cover border border-border/30"
                        />
                        <div>
                          <p className="font-medium">{m.firstName} {m.lastName}</p>
                          <p className="text-xs text-muted-foreground">{m.company}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.profession}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="font-medium">{m.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.reviewCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{m.totalStudents}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {m.subjects.length} subject{m.subjects.length !== 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {m.isCertified ? (
                        <Badge variant="default" className="gap-1 text-xs">
                          <Award className="h-3 w-3" /> Certified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs border-border/50">Standard</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => openEdit(m)}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => setDeleteId(m.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}

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

      {/* Edit Dialog */}
      <Dialog open={!!editMentor} onOpenChange={() => setEditMentor(null)}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Mentor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={editForm.firstName} onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={editForm.lastName} onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Profession</Label>
                <Input value={editForm.profession} onChange={(e) => setEditForm((f) => ({ ...f, profession: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea rows={3} value={editForm.bio} onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Profile Image URL</Label>
              <Input value={editForm.profileImageUrl} onChange={(e) => setEditForm((f) => ({ ...f, profileImageUrl: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMentor(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending || !editForm.firstName.trim() || !editForm.lastName.trim()}>
              {updateMutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Mentor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently remove the mentor and all their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}