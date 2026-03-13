import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mentorApi, subjectApi, sessionApi, reviewApi, adminApi } from "../services/api";
import type { MentorDTO, SubjectDTO, SessionDTO, ReviewDTO, AdminOverview } from "../services/api";

// ==================== MENTORS ====================

export function useMentors() {
  return useQuery<MentorDTO[]>({
    queryKey: ["mentors"],
    queryFn: mentorApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMentor(id: number) {
  return useQuery<MentorDTO>({
    queryKey: ["mentor", id],
    queryFn: () => mentorApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMentor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mentorApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mentors"] }),
  });
}

export function useUpdateMentor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { firstName: string; lastName: string; profession: string; company: string; bio: string; profileImageUrl: string } }) =>
      mentorApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mentors"] }),
  });
}

export function useDeleteMentor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => mentorApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mentors"] }),
  });
}

// ==================== SUBJECTS ====================

export function useSubjects() {
  return useQuery<SubjectDTO[]>({
    queryKey: ["subjects"],
    queryFn: subjectApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description: string; imageUrl: string } }) =>
      subjectApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subjectApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

// ==================== SESSIONS ====================

export function useMySessions() {
  return useQuery<SessionDTO[]>({
    queryKey: ["my-sessions"],
    queryFn: sessionApi.getMySessions,
  });
}

export function useAllSessions() {
  return useQuery<SessionDTO[]>({
    queryKey: ["all-sessions"],
    queryFn: sessionApi.getAll,
  });
}

export function useEnrollSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionApi.enroll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-sessions"] });
      qc.invalidateQueries({ queryKey: ["all-sessions"] });
    },
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.confirmPayment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-sessions"] }),
  });
}

export function useMarkComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.markComplete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-sessions"] }),
  });
}

export function useAddMeetingLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, meetingLink }: { id: number; meetingLink: string }) =>
      sessionApi.addMeetingLink(id, meetingLink),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-sessions"] }),
  });
}

export function useCancelSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-sessions"] });
      qc.invalidateQueries({ queryKey: ["all-sessions"] });
    },
  });
}

export function useRequestReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { newDate: string; newTime: string; reason: string } }) =>
      sessionApi.requestReschedule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-sessions"] });
      qc.invalidateQueries({ queryKey: ["all-sessions"] });
    },
  });
}

export function useApproveReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.approveReschedule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-sessions"] }),
  });
}

export function useRejectReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.rejectReschedule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-sessions"] }),
  });
}

// ==================== REVIEWS ====================

export function useMentorReviews(mentorId: number) {
  return useQuery<ReviewDTO[]>({
    queryKey: ["reviews", mentorId],
    queryFn: () => reviewApi.getByMentor(mentorId),
    enabled: !!mentorId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.mentorId] });
      qc.invalidateQueries({ queryKey: ["mentor", variables.mentorId] });
    },
  });
}

// ==================== ADMIN ====================

export function useAdminOverview() {
  return useQuery<AdminOverview>({
    queryKey: ["admin-overview"],
    queryFn: adminApi.getOverview,
  });
}
