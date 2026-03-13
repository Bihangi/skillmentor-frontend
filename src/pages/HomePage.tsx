import { useState } from "react";
import { Link } from "react-router-dom";
import { mockMentors } from "../data/mockData";
import { useMentors } from "../hooks/useApi";
import { MentorCard } from "../components/MentorCard";
import { Input } from "../components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const professions = ["All", "Software Engineering", "Data Science", "UX/UI Design", "DevOps Engineering", "Mobile Development"];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("All");

  const { data: apiMentors, isLoading } = useMentors();
  const mentors = apiMentors || mockMentors;

  const filtered = mentors.filter((m) => {
    const matchesSearch =
      `${m.firstName} ${m.lastName} ${m.profession}`.toLowerCase().includes(search.toLowerCase()) ||
      m.subjects.some((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    const matchesProfession = selectedProfession === "All" || m.profession === selectedProfession;
    return matchesSearch && matchesProfession;
  });

  return (
    <main className="min-h-screen">
      {/* Hero — super minimal */}
      <section className="py-20 md:py-32 relative">
        <div className="container max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-sm font-medium tracking-widest uppercase text-primary"
          >
            1-on-1 mentoring ✦
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-4xl font-extrabold tracking-tight md:text-6xl leading-[1.1]"
          >
            find your next
            <br />
            <span className="text-primary">mentor</span> here.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-5 text-muted-foreground max-w-md mx-auto leading-relaxed"
          >
            connect with real industry pros for personalized sessions that actually help you grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mt-10 mx-auto max-w-sm"
          >
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="search mentors or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full border-border/50 bg-card/60 backdrop-blur-sm pl-10 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Tiny stats row */}
      <section className="container max-w-lg mb-16">
        <div className="flex items-center justify-center gap-8 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm px-8 py-5 text-center text-sm text-muted-foreground shadow-xs">
          <div><span className="block text-xl font-bold text-foreground">50+</span>mentors</div>
          <div className="h-6 w-px bg-border/50" />
          <div><span className="block text-xl font-bold text-foreground">120+</span>subjects</div>
          <div className="h-6 w-px bg-border/50" />
          <div><span className="block text-xl font-bold text-foreground">4.8</span>avg rating</div>
          <div className="h-6 w-px bg-border/50" />
          <div><span className="block text-xl font-bold text-foreground">2K+</span>students</div>
        </div>
      </section>

      {/* Mentors */}
      <section className="container pb-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            explore mentors
          </h2>
          <span className="text-xs text-muted-foreground">{filtered.length} results</span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {professions.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProfession(p)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                selectedProfession === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((mentor, i) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link to={`/mentors/${mentor.id}`}>
                    <MentorCard mentor={mentor} />
                  </Link>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                no mentors found — try a different search 🤷
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
