import type { Mentor } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Star, Award, ArrowUpRight } from "lucide-react";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:border-primary/30 hover:card-shadow-hover">
      {/* Image with gradient overlay */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={mentor.profileImageUrl}
          alt={`${mentor.firstName} ${mentor.lastName}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        
        {mentor.isCertified && (
          <div className="absolute right-3 top-3">
            <Badge variant="glow" className="gap-1 text-xs">
              <Award className="h-3 w-3" /> Certified
            </Badge>
          </div>
        )}

        {/* Hover arrow */}
        <div className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
          <ArrowUpRight className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold tracking-tight">
            {mentor.firstName} {mentor.lastName}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">{mentor.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{mentor.title}</p>
        <p className="mb-4 text-xs text-muted-foreground/70">{mentor.company} · {mentor.experienceYears}y exp</p>

        <div className="flex flex-wrap gap-1.5">
          {mentor.subjects.slice(0, 2).map((s) => (
            <Badge key={s.id} variant="secondary" className="text-[11px] px-2 py-0.5">
              {s.name}
            </Badge>
          ))}
          {mentor.subjects.length > 2 && (
            <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
              +{mentor.subjects.length - 2}
            </Badge>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
