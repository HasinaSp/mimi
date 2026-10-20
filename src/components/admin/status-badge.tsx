import { statusMeta } from "@/lib/request-status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta(status);
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", meta.className)}>{meta.label}</span>;
}
