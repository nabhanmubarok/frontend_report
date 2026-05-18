import { cn, statusColor, statusLabel } from "@/lib/utils";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("badge", statusColor[status] || "bg-stone-100 text-stone-600 border-stone-200")}>
      {statusLabel[status] || status}
    </span>
  );
}
