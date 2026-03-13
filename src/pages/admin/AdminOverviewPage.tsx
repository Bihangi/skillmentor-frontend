import { useAdminOverview } from "../../hooks/useApi";
import { Users, BookOpen, CalendarCheck, TrendingUp } from "lucide-react";

export default function AdminOverviewPage() {
  const { data: overview } = useAdminOverview();

  const overviewStats = [
    { icon: Users, label: "Total Mentors", value: overview ? String(overview.totalMentors) : "5", change: "+2 this month" },
    { icon: BookOpen, label: "Total Subjects", value: overview ? String(overview.totalSubjects) : "12", change: "+3 this month" },
    { icon: CalendarCheck, label: "Active Bookings", value: overview ? String(overview.totalBookings) : "6", change: `${overview?.pendingBookings ?? 2} pending` },
    { icon: TrendingUp, label: "Confirmed", value: overview ? String(overview.confirmedBookings) : "3", change: "Active sessions" },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight">Dashboard</h1>
      <p className="mb-10 text-muted-foreground">Platform overview and management</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/15">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="font-display text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-primary">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
