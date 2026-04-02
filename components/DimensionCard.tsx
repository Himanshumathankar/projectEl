import { DimensionIcon } from "@/components/DimensionIcon";
import type { EIDimension } from "@/lib/assessmentData";

type DimensionCardProps = {
  dimension: EIDimension;
};

export function DimensionCard({ dimension }: DimensionCardProps) {
  return (
    <article className="group rounded-2xl border border-white/40 bg-white/85 p-5 shadow-lg shadow-blue-100/60 backdrop-blur transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-4 inline-flex rounded-xl bg-slate-50 p-3">
        <DimensionIcon name={dimension.icon} className="size-5 text-slate-700" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{dimension.title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{dimension.description}</p>
      <div
        className={`mt-5 h-1.5 w-full rounded-full bg-gradient-to-r ${dimension.color} opacity-70 transition-opacity group-hover:opacity-100`}
      />
    </article>
  );
}
