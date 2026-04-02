type ProgressBarProps = {
  value: number;
  total: number;
};

export function ProgressBar({ value, total }: ProgressBarProps) {
  const ratio = total === 0 ? 0 : Math.min(100, Math.max(0, (value / total) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Assessment Progress</span>
        <span>
          {value}/{total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  );
}
