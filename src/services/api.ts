import { API_BASE_URL } from "../config";

/**
 * SkillMentor API Service
 * Connects the React frontend to the Spring Boot backend.
 * Falls back to mock data when the backend is unavailable.
 */

// Token getter — set by AuthContext at runtime
let _tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  _tokenGetter = fn;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (_tokenGetter) {
    const token = await _tokenGetter();
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const authHeaders = await getAuthHeaders();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeaders,
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, error.message || error.error || "Request failed", error);
  }

  return response.json();
}

export class ApiError extends Error {
  status: number;
  details: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// ==================== MENTORS ====================

export interface MentorDTO {
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
  subjects: SubjectDTO[];
}

export interface SubjectDTO {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  enrollmentCount: number;
  mentorId: number;
  mentorName?: string;
}

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
  rescheduleStatus?: string;
}

export interface ReviewDTO {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  mentorId: number;
  subjectId?: number;
}

export interface AdminOverview {
  totalMentors: number;
  totalSubjects: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
}

// ---- Mentor endpoints ----
export const mentorApi = {
  getAll: () => request<MentorDTO[]>("/api/v1/mentors"),
  getById: (id: number) => request<MentorDTO>(`/api/v1/mentors/${id}`),
  create: (data: Omit<MentorDTO, "id" | "rating" | "reviewCount" | "totalStudents" | "subjects">) =>
    request<MentorDTO>("/api/v1/mentors", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: { firstName: string; lastName: string; profession: string; company: string; bio: string; profileImageUrl: string }) =>
    request<MentorDTO>(`/api/v1/mentors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/api/v1/mentors/${id}`, { method: "DELETE" }),
};

// ---- Subject endpoints ----
export const subjectApi = {
  getAll: () => request<SubjectDTO[]>("/api/v1/subjects"),
  getByMentor: (mentorId: number) => request<SubjectDTO[]>(`/api/v1/subjects/mentor/${mentorId}`),
  create: (data: { name: string; description: string; imageUrl: string; mentorId: number }) =>
    request<SubjectDTO>("/api/v1/subjects", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: { name: string; description: string; imageUrl: string }) =>
    request<SubjectDTO>(`/api/v1/subjects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/api/v1/subjects/${id}`, { method: "DELETE" }),
};

// ---- Session endpoints ----
export const sessionApi = {
  enroll: (data: { mentorId: number; subjectId: number; sessionDate: string; sessionTime: string; duration: number }) =>
    request<SessionDTO>("/api/v1/sessions/enroll", { method: "POST", body: JSON.stringify(data) }),
  getMySessions: () => request<SessionDTO[]>("/api/v1/sessions/my-sessions"),
  getAll: () => request<SessionDTO[]>("/api/v1/sessions/all"),
  confirmPayment: (id: number) =>
    request<SessionDTO>(`/api/v1/sessions/${id}/payment`, { method: "PUT", body: JSON.stringify({ status: "CONFIRMED" }) }),
  markComplete: (id: number) =>
    request<SessionDTO>(`/api/v1/sessions/${id}/status`, { method: "PUT", body: JSON.stringify({ status: "COMPLETED" }) }),
  addMeetingLink: (id: number, meetingLink: string) =>
    request<SessionDTO>(`/api/v1/sessions/${id}/meeting-link`, { method: "PUT", body: JSON.stringify({ meetingLink }) }),
  cancel: (id: number) =>
    request<SessionDTO>(`/api/v1/sessions/${id}/status`, { method: "PUT", body: JSON.stringify({ status: "CANCELLED" }) }),
  requestReschedule: (id: number, data: { newDate: string; newTime: string; reason: string }) =>
    request<SessionDTO>(`/api/v1/sessions/${id}/reschedule`, { method: "POST", body: JSON.stringify(data) }),
  approveReschedule: (id: number) =>
    request<SessionDTO>(`/api/v1/sessions/${id}/reschedule/approve`, { method: "PUT" }),
  rejectReschedule: (id: number) =>
    request<SessionDTO>(`/api/v1/sessions/${id}/reschedule/reject`, { method: "PUT" }),
  uploadPaymentProof: async (sessionId: number, file: File): Promise<SessionDTO> => {
    const url = `${API_BASE_URL}/api/v1/sessions/${sessionId}/payment-proof`;
    const authHeaders = await getAuthHeaders();
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(url, {
      method: "POST",
      headers: { ...authHeaders },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(response.status, error.message || "Upload failed", error);
    }
    return response.json();
  },
};

// ---- Review endpoints ----
export const reviewApi = {
  getByMentor: (mentorId: number) => request<ReviewDTO[]>(`/api/v1/reviews/mentor/${mentorId}`),
  create: (data: { mentorId: number; subjectId?: number; rating: number; comment: string }) =>
    request<ReviewDTO>("/api/v1/reviews", { method: "POST", body: JSON.stringify(data) }),
};

// ---- User endpoints ----
export const userApi = {
  setRole: (role: string) =>
    request<{ message: string }>("/api/v1/users/role", { method: "PUT", body: JSON.stringify({ role }) }),
};

// ---- Admin endpoints ----
export const adminApi = {
  getOverview: () => request<AdminOverview>("/api/v1/admin/overview"),
};
