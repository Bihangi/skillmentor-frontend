import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMentor } from "../../hooks/useApi";
import { ApiError } from "../../services/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "../../components/ui/form";
import { toast } from "../../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { MentorCard } from "../../components/MentorCard";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  title: z.string().min(1, "Required"),
  profession: z.string().min(1, "Required"),
  company: z.string().optional(),
  experienceYears: z.preprocess((val) => Number(val), z.number().min(0).max(50)),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  profileImageUrl: z.string().url("Must be a valid URL"),
  isCertified: z.boolean().default(false),
  startYear: z.preprocess((val) => Number(val), z.number().min(2000).max(new Date().getFullYear())),
});

type FormValues = z.infer<typeof schema>;

export default function CreateMentorPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "", title: "",
      profession: "", company: "", experienceYears: 0, bio: "",
      profileImageUrl: "", isCertified: false, startYear: new Date().getFullYear(),
    },
  });

  const createMentor = useCreateMentor();

  const onSubmit = async (data: FormValues) => {
    try {
      await createMentor.mutateAsync(data as any);
      toast({ title: "Mentor Created ✨", description: `${data.firstName} ${data.lastName} added.` });
      form.reset();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to create mentor";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };


  const watched = form.watch();

  const previewMentor = {
    id: 0,
    firstName: watched.firstName || "First",
    lastName: watched.lastName || "Last",
    email: watched.email || "",
    phone: watched.phone || "",
    title: watched.title || "Title",
    profession: watched.profession || "",
    company: watched.company || "Company",
    experienceYears: watched.experienceYears || 0,
    bio: watched.bio || "",
    profileImageUrl: watched.profileImageUrl || "/placeholder.svg",
    isCertified: watched.isCertified || false,
    startYear: watched.startYear || new Date().getFullYear(),
    rating: 5.0,
    reviewCount: 0,
    totalStudents: 0,
    subjects: [],
  };

  const inputClass = "bg-secondary/50 border-border/50 focus:border-primary/50";
  const labelClass = "text-xs uppercase tracking-wider text-muted-foreground";

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">Create Mentor</h1>
      <p className="mb-8 text-muted-foreground">Add a new mentor to the platform</p>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-border/50 bg-card/50 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>First Name *</FormLabel>
                    <FormControl><Input {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Last Name *</FormLabel>
                    <FormControl><Input {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Email *</FormLabel>
                    <FormControl><Input type="email" {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Phone</FormLabel>
                    <FormControl><Input {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Title *</FormLabel>
                    <FormControl><Input placeholder="Senior Software Engineer" {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="profession" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Profession *</FormLabel>
                    <FormControl><Input placeholder="Software Engineering" {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Company</FormLabel>
                    <FormControl><Input {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="experienceYears" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Years Experience</FormLabel>
                    <FormControl><Input type="number" {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Bio *</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="Tell students about your experience..." {...field} className={inputClass} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="profileImageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Profile Image URL *</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} className={inputClass} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="startYear" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Start Year</FormLabel>
                    <FormControl><Input type="number" {...field} className={inputClass} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="isCertified" render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0 pt-7">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm">Certified Mentor</FormLabel>
                  </FormItem>
                )} />
              </div>
              <Button type="submit" variant="glow" disabled={createMentor.isPending}>
                {createMentor.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Mentor"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Live Preview */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Card Preview</h3>
          <div className="sticky top-6">
            <MentorCard mentor={previewMentor} />
          </div>
        </div>
      </div>
    </div>
  );
}
