import type { RequestStatus } from "@/generated/prisma/enums";

export const REQUEST_STATUSES: { value: RequestStatus; label: string; className: string }[] = [
  { value: "NEW", label: "Nouvelle", className: "bg-petal-100 text-petal-800" },
  { value: "IN_PROGRESS", label: "En cours", className: "bg-yellow-100 text-yellow-800" },
  { value: "ACCEPTED", label: "Acceptée", className: "bg-leaf-100 text-leaf-700" },
  { value: "COMPLETED", label: "Terminée", className: "bg-neutral-800 text-white" },
  { value: "DECLINED", label: "Refusée", className: "bg-stone-200 text-stone-600" },
];

export function statusMeta(value: string) {
  return REQUEST_STATUSES.find((s) => s.value === value) ?? REQUEST_STATUSES[0];
}
