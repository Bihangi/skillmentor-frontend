import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockMentors } from "../../data/mockData";
import { useMentors, useCreateSubject } from "../../hooks/useApi";
import { ApiError } from "../../services/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "../../components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { toast } from "../../hooks/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Subject name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  mentorId: z.string().min(1, "Please select a mentor"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateSubjectPage() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", imageUrl: "", mentorId: "" },
  });

  const { data: apiMentors } = useMentors();
  const mentors = apiMentors || mockMentors;
  const createSubject = useCreateSubject();

  const onSubmit = async (data: FormValues) => {
    try {
      await createSubject.mutateAsync({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        mentorId: Number(data.mentorId),
      });
      toast({ title: "Subject Created ✨", description: `"${data.name}" added successfully.` });
      form.reset();
      navigate("/admin/subjects");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to create subject";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">Create Subject</h1>
      <p className="mb-8 text-muted-foreground">Add a new subject and assign to a mentor</p>

      <div className="rounded-xl border border-border/50 bg-card/50 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Subject Name</FormLabel>
                <FormControl><Input placeholder="e.g. Advanced React Patterns" {...field} className="bg-secondary/50 border-border/50" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Description</FormLabel>
                <FormControl><Textarea placeholder="What will students learn..." rows={4} {...field} className="bg-secondary/50 border-border/50" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Image URL</FormLabel>
                <FormControl><Input placeholder="https://images.unsplash.com/..." {...field} className="bg-secondary/50 border-border/50" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mentorId" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Assign Mentor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue placeholder="Select a mentor" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mentors.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.firstName} {m.lastName} — {m.profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" variant="glow" disabled={createSubject.isPending}>
              {createSubject.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Subject"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
