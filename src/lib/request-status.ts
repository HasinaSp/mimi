import type { RequestStatus } from "@/generated/prisma/enums";

export const REQUEST_STATUSES: { value: RequestStatus; label: string; className: string }[] = [
  { value: "NEW", label: "Nouvelle", className: "bg-coral-100 text-coral-700" },
  { value: "IN_PROGRESS", label: "En cours", className: "bg-amber-100 text-amber-800" },
  { value: "ACCEPTED", label: "Acceptée", className: "bg-sage-100 text-sage-700" },
  { value: "COMPLETED", label: "Terminée", className: "bg-plum-100 text-plum-700" },
  { value: "DECLINED", label: "Refusée", className: "bg-stone-200 text-stone-600" },
];

export function statusMeta(value: string) {
  return REQUEST_STATUSES.find((s) => s.value === value) ?? REQUEST_STATUSES[0];
}
