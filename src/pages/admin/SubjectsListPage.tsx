import { Link } from "react-router-dom";
import { useSubjects, useUpdateSubject, useDeleteSubject } from "../../hooks/useApi";
import { mockMentors } from "../../data/mockData";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../../components/ui/dialog";
import { Plus, BookOpen, Users, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "../../hooks/use-toast";

interface SubjectRow {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  enrollmentCount: number;
  mentorId?: number;
  mentorName?: string;
}

export default function SubjectsListPage() {
  const { data: subjects, isLoading } = useSubjects();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [editSubject, setEditSubject] = useState<SubjectRow | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", imageUrl: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const allSubjects: SubjectRow[] = subjects || mockMentors.flatMap((m) =>
    m.subjects.map((s) => ({ ...s, mentorName: `${m.firstName} ${m.lastName}` }))
  );

  const openEdit = (s: SubjectRow) => {
    setEditSubject(s);
    setEditForm({ name: s.name, description: s.description, imageUrl: s.imageUrl });
  };

  const handleUpdate = async () => {
    if (!editSubject) return;
    try {
      await updateMutation.mutateAsync({ id: editSubject.id, data: editForm });
      toast({ title: "Subject updated" });
      setEditSubject(null);
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({ title: "Subject deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">All subjects on the platform</p>
        </div>
        <Link to="/admin/subjects/create">
          <Button variant="glow" className="gap-2">
            <Plus className="h-4 w-4" /> Create Subject
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading subjects…</div>
      ) : allSubjects.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg text-muted-foreground">No subjects yet.</p>
          <Link to="/admin/subjects/create">
            <Button variant="outline" className="mt-4">Create your first subject</Button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/50 bg-card/50 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">ID</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Subject</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Mentor</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Enrollments</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Image</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSubjects.map((s) => (
                <TableRow key={s.id} className="border-border/20 hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs text-muted-foreground">#{s.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.mentorName || `Mentor #${s.mentorId}`}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" /> {s.enrollmentCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.name} className="h-8 w-12 rounded object-cover" />
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => openEdit(s)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => setDeleteId(s.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editSubject} onOpenChange={() => setEditSubject(null)}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={editForm.imageUrl}
                onChange={(e) => setEditForm((f) => ({ ...f, imageUrl: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSubject(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending || !editForm.name.trim()}>
              {updateMutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently remove the subject and cannot be undone.
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
