// src/types.ts
export interface SessionDTO {
  id: number;
  studentName: string;
  studentEmail: string;
  mentorName: string;
  subjectName: string;
  mentorId: number;
  subjectId: number;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  paymentStatus: string;
  sessionStatus: string;
  meetingLink?: string;
  paymentProofUrl?: string;
  requestedNewDate?: string;
  requestedNewTime?: string;
  rescheduleReason?: string;
  rescheduleStatus?: "pending" | "approved" | "rejected" | null;
}