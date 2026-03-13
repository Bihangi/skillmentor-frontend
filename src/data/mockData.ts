// Mock data for SkillMentor platform

export interface Subject {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  enrollmentCount: number;
}

export interface Mentor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  profession: string;
  company: string;
  experienceYears: number;
  bio: string;
  profileImageUrl: string;
  isCertified: boolean;
  startYear: number;
  rating: number;
  reviewCount: number;
  totalStudents: number;
  subjects: Subject[];
}

export interface Session {
  id: number;
  studentName: string;
  studentEmail?: string;
  mentorName: string;
  mentorId?: number;
  subjectName: string;
  subjectId?: number;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  paymentStatus: "pending" | "confirmed" | "rejected";
  sessionStatus: "pending" | "confirmed" | "completed" | "cancelled";
  meetingLink?: string;
  paymentProofUrl?: string;
  rescheduleStatus?: "pending" | "approved" | "rejected" | null;
  requestedNewDate?: string;
  requestedNewTime?: string;
  rescheduleReason?: string;
}

export interface Review {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockMentors: Mentor[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@example.com",
    phone: "+1 555-0101",
    title: "Senior Software Engineer",
    profession: "Software Engineering",
    company: "Google",
    experienceYears: 12,
    bio: "Passionate about teaching full-stack development with a focus on React, TypeScript, and cloud architecture. I've mentored over 200 students and helped them land roles at top tech companies. My teaching style combines practical projects with fundamental CS concepts.",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    isCertified: true,
    startYear: 2018,
    rating: 4.9,
    reviewCount: 156,
    totalStudents: 234,
    subjects: [
      { id: 1, name: "React & TypeScript", description: "Modern frontend development with React 18, TypeScript, and state management patterns.", imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop", enrollmentCount: 89 },
      { id: 2, name: "System Design", description: "Learn to design scalable distributed systems used at top tech companies.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", enrollmentCount: 67 },
      { id: 3, name: "Cloud Architecture", description: "AWS, GCP, and Azure fundamentals for building production-grade applications.", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop", enrollmentCount: 45 },
    ],
  },
  {
    id: 2,
    firstName: "Marcus",
    lastName: "Williams",
    email: "marcus.w@example.com",
    phone: "+1 555-0102",
    title: "Data Science Lead",
    profession: "Data Science",
    company: "Netflix",
    experienceYears: 9,
    bio: "Data scientist with expertise in machine learning, NLP, and recommendation systems. At Netflix, I work on the personalization algorithms that serve millions of users. I enjoy breaking down complex ML concepts into intuitive, easy-to-understand lessons.",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isCertified: true,
    startYear: 2020,
    rating: 4.8,
    reviewCount: 98,
    totalStudents: 178,
    subjects: [
      { id: 4, name: "Machine Learning", description: "From linear regression to deep learning — build and deploy ML models.", imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop", enrollmentCount: 112 },
      { id: 5, name: "Python for Data Science", description: "Master pandas, NumPy, and scikit-learn for data analysis and modeling.", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop", enrollmentCount: 94 },
    ],
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.r@example.com",
    phone: "+1 555-0103",
    title: "UX Design Director",
    profession: "UX/UI Design",
    company: "Figma",
    experienceYears: 11,
    bio: "Design leader focused on creating intuitive, accessible user experiences. With over a decade at companies like Airbnb and Figma, I bring real-world design thinking to every lesson. My students learn not just tools, but how to think like a designer.",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    isCertified: true,
    startYear: 2019,
    rating: 4.9,
    reviewCount: 134,
    totalStudents: 198,
    subjects: [
      { id: 6, name: "UI/UX Fundamentals", description: "Core principles of user interface and experience design for digital products.", imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop", enrollmentCount: 76 },
      { id: 7, name: "Figma Mastery", description: "Advanced Figma techniques including auto-layout, components, and prototyping.", imageUrl: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=250&fit=crop", enrollmentCount: 88 },
      { id: 8, name: "Design Systems", description: "Build scalable design systems that bridge the gap between design and development.", imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop", enrollmentCount: 52 },
    ],
  },
  {
    id: 4,
    firstName: "James",
    lastName: "Park",
    email: "james.park@example.com",
    phone: "+1 555-0104",
    title: "DevOps Architect",
    profession: "DevOps Engineering",
    company: "Spotify",
    experienceYears: 8,
    bio: "Infrastructure and DevOps specialist helping teams ship faster with CI/CD, Kubernetes, and infrastructure as code. I believe in teaching through real-world scenarios and hands-on labs.",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    isCertified: false,
    startYear: 2021,
    rating: 4.7,
    reviewCount: 72,
    totalStudents: 120,
    subjects: [
      { id: 9, name: "Docker & Kubernetes", description: "Container orchestration from beginner to production-ready deployments.", imageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop", enrollmentCount: 65 },
      { id: 10, name: "CI/CD Pipelines", description: "Automate your deployment workflow with GitHub Actions, Jenkins, and GitLab CI.", imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop", enrollmentCount: 43 },
    ],
  },
  {
    id: 5,
    firstName: "Aisha",
    lastName: "Patel",
    email: "aisha.p@example.com",
    phone: "+1 555-0105",
    title: "Mobile Engineering Manager",
    profession: "Mobile Development",
    company: "Stripe",
    experienceYears: 10,
    bio: "Specialist in cross-platform mobile development with React Native and Flutter. I focus on teaching best practices for building performant, accessible mobile applications that delight users.",
    profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    isCertified: true,
    startYear: 2019,
    rating: 4.8,
    reviewCount: 110,
    totalStudents: 165,
    subjects: [
      { id: 11, name: "React Native", description: "Build production-ready iOS and Android apps with React Native and Expo.", imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop", enrollmentCount: 98 },
      { id: 12, name: "Mobile UI Patterns", description: "Navigation, gestures, and animations that feel native on both platforms.", imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop", enrollmentCount: 54 },
    ],
  },
];

export const mockReviews: Review[] = [
  { id: 1, studentName: "Alex Thompson", rating: 5, comment: "Sarah is an incredible mentor! Her React course completely transformed my understanding of frontend development. Highly recommended!", date: "2025-12-15" },
  { id: 2, studentName: "Jordan Lee", rating: 5, comment: "Clear, concise, and practical. The system design sessions gave me the confidence to ace my tech interviews.", date: "2025-11-28" },
  { id: 3, studentName: "Taylor Martinez", rating: 4, comment: "Great depth of knowledge. Sometimes moves fast but always willing to revisit concepts.", date: "2025-11-10" },
  { id: 4, studentName: "Casey Brown", rating: 5, comment: "Best investment in my career. Went from junior to mid-level developer in 6 months thanks to these sessions.", date: "2025-10-22" },
  { id: 5, studentName: "Morgan Davis", rating: 5, comment: "The hands-on projects really make the difference. You learn by building real things.", date: "2025-10-05" },
];

export const mockSessions: Session[] = [
  { id: 1, studentName: "Alex Thompson", mentorName: "Sarah Chen", subjectName: "React & TypeScript", sessionDate: "2026-03-01", sessionTime: "10:00", duration: 60, paymentStatus: "confirmed", sessionStatus: "confirmed", meetingLink: "https://meet.google.com/abc-def-ghi" },
  { id: 2, studentName: "Alex Thompson", mentorName: "Marcus Williams", subjectName: "Machine Learning", sessionDate: "2026-03-05", sessionTime: "14:00", duration: 90, paymentStatus: "pending", sessionStatus: "pending" },
  { id: 3, studentName: "Jordan Lee", mentorName: "Emily Rodriguez", subjectName: "UI/UX Fundamentals", sessionDate: "2026-02-20", sessionTime: "09:00", duration: 60, paymentStatus: "confirmed", sessionStatus: "completed" },
  { id: 4, studentName: "Taylor Martinez", mentorName: "Sarah Chen", subjectName: "System Design", sessionDate: "2026-03-10", sessionTime: "16:00", duration: 60, paymentStatus: "pending", sessionStatus: "pending" },
  { id: 5, studentName: "Casey Brown", mentorName: "James Park", subjectName: "Docker & Kubernetes", sessionDate: "2026-02-28", sessionTime: "11:00", duration: 90, paymentStatus: "confirmed", sessionStatus: "confirmed" },
  { id: 6, studentName: "Morgan Davis", mentorName: "Aisha Patel", subjectName: "React Native", sessionDate: "2026-02-25", sessionTime: "13:00", duration: 60, paymentStatus: "confirmed", sessionStatus: "completed" },
];
