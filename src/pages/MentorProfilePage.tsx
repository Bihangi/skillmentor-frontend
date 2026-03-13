import { useParams, Link } from "react-router-dom";
import { mockMentors, mockReviews } from "../data/mockData";
import { useMentor, useMentorReviews } from "../hooks/useApi";
import { Button } from "../components/ui/button";
import { BookingModal } from "../components/BookingModal";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, Award, Calendar, Users, BookOpen,
  Briefcase, Clock, TrendingUp, ArrowUpRight
} from "lucide-react";

export default function MentorProfilePage() {
  const { mentorId } = useParams();
  const id = Number(mentorId);
  const [bookingSubjectId, setBookingSubjectId] = useState<number | null>(null);

  // Use API data with mock fallback
  const { data: apiMentor, isLoading, isError } = useMentor(id);
  const { data: apiReviews } = useMentorReviews(id);
  const mentor = apiMentor || mockMentors.find((m) => m.id === id);
  const reviews = apiReviews || mockReviews;

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !mentor) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-display text-2xl font-bold">Mentor not found</h2>
          <p className="mb-4 text-muted-foreground">The mentor you're looking for doesn't exist or an error occurred.</p>
          <Link to="/"><Button variant="outline">Back to Mentors</Button></Link>
        </div>
      </div>
    );
  }

  // Calculate positive review percentage from actual data
  const positiveReviewPct = reviews.length > 0
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)
    : 0;

  const selectedSubject = mentor.subjects.find((s) => s.id === bookingSubjectId);

  return (
    <main className="pb-20">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/5 blur-[120px]" />

        <div className="container relative py-10">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Mentors
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8"
          >
            <div className="relative">
              <img
                src={mentor.profileImageUrl}
                alt={`${mentor.firstName} ${mentor.lastName}`}
                className="h-28 w-28 rounded-2xl border-2 border-border/50 object-cover md:h-36 md:w-36"
              />
              {mentor.isCertified && (
                <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary glow-primary">
                  <Award className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                {mentor.firstName} {mentor.lastName}
              </h1>
              <p className="mb-1 text-lg text-muted-foreground">{mentor.title}</p>
              <p className="mb-3 text-sm text-muted-foreground/70">
                {mentor.company} · {mentor.profession} · Since {mentor.startYear}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-primary">{mentor.rating}</span>
                </div>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-sm text-muted-foreground">{mentor.reviewCount} reviews</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-sm text-muted-foreground">{mentor.totalStudents} students</span>
              </div>
            </div>

            <Button
              variant="glow"
              size="lg"
              onClick={() => setBookingSubjectId(mentor.subjects[0]?.id ?? null)}
            >
              <Calendar className="mr-2 h-5 w-5" /> Schedule Session
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          {/* About */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="mb-4 font-display text-2xl font-bold">About</h2>
            <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
          </motion.section>

          <div className="line-glow" />

          {/* Subjects */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="mb-6 font-display text-2xl font-bold">Subjects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {mentor.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="group overflow-hidden rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 shadow-xs hover:shadow-md"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={subject.imageUrl}
                      alt={subject.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-display font-bold">{subject.name}</h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{subject.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" /> {subject.enrollmentCount} students
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBookingSubjectId(subject.id)}
                        className="h-8 gap-1"
                      >
                        Book <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="line-glow" />

          {/* Reviews */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="mb-6 font-display text-2xl font-bold">Reviews</h2>
            <div className="space-y-3">
              {reviews.slice(0, 4).map((review) => (
                <div key={review.id} className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-5 shadow-xs">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{review.studentName}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  <p className="mt-2 text-xs text-muted-foreground/60">{review.date}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {[
            { icon: Users, label: "Students Taught", value: String(mentor.totalStudents) },
            { icon: Clock, label: "Experience", value: `${mentor.experienceYears} years` },
            { icon: BookOpen, label: "Subjects", value: String(mentor.subjects.length) },
            { icon: TrendingUp, label: "Positive Reviews", value: `${positiveReviewPct}%` },
            { icon: Briefcase, label: "Company", value: mentor.company },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-4 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/15">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-display text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {bookingSubjectId !== null && selectedSubject && (
        <BookingModal
          mentor={mentor}
          subject={selectedSubject}
          open={true}
          onClose={() => setBookingSubjectId(null)}
        />
      )}
    </main>
  );
}
