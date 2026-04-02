import Link from "next/link";
import { CalendarClock, ChevronRight, Gauge, Target } from "lucide-react";

import { ResultCharts } from "@/components/ResultCharts";
import { EI_DIMENSIONS } from "@/lib/assessmentData";
import { getAssessmentById } from "@/lib/assessmentRepository";
import { toDimensionChartData } from "@/lib/scoring";

type ResultsPageProps = {
  params: Promise<{ id: string }>;
};

const CATEGORY_STYLES = {
  "High Emotional Intelligence": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Moderate Emotional Intelligence": "border-amber-200 bg-amber-50 text-amber-800",
  "Low Emotional Intelligence": "border-rose-200 bg-rose-50 text-rose-800",
} as const;

const CATEGORY_INSIGHTS = {
  "High Emotional Intelligence": [
    "Strong emotional control and interpersonal skills",
    "Suitable for leadership roles",
  ],
  "Moderate Emotional Intelligence": [
    "Good foundation but needs improvement in certain areas",
  ],
  "Low Emotional Intelligence": [
    "Needs development in emotional awareness and control",
  ],
} as const;

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  let result = null;
  let dataError: string | null = null;

  try {
    result = await getAssessmentById(id);
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Unable to load assessment.";
  }

  if (dataError) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-10 sm:px-8">
        <section className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-amber-900">Configuration Required</h1>
          <p className="mt-2 text-sm text-amber-800">{dataError}</p>
          <p className="mt-3 text-sm text-amber-800">
            Add MONGODB_URI in your environment variables to view saved assessments.
          </p>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-10 sm:px-8">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Assessment Not Found</h1>
          <p className="mt-2 text-sm text-slate-600">
            The requested result does not exist or may have been removed.
          </p>
          <Link
            href="/assessment"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Start New Assessment
            <ChevronRight className="size-4" />
          </Link>
        </section>
      </main>
    );
  }

  const chartData = toDimensionChartData(result.dimensionScores);
  const scoreText = `Your Score: ${result.totalScore} -> ${result.category.replace("Emotional Intelligence", "EI")}`;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-8 lg:py-10">
      <section
        className="animate-fade-up rounded-3xl border border-white/50 bg-white/85 p-6 shadow-2xl shadow-indigo-100/60 backdrop-blur md:p-8"
        style={{ animationDelay: "0.05s" }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Assessment Results</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
          Emotional Intelligence (EI) Assessment Framework for Evaluating Workplace Effectiveness
        </h1>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Gauge className="size-4" />
              <p className="text-xs uppercase tracking-wide">Total EI Score</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{result.totalScore}</p>
            <p className="mt-1 text-xs text-slate-500">Score range: 25 to 125 (Part A only)</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Target className="size-4" />
              <p className="text-xs uppercase tracking-wide">EI Category</p>
            </div>
            <p
              className={`mt-2 inline-flex rounded-lg border px-3 py-1 text-sm font-semibold ${
                CATEGORY_STYLES[result.category]
              }`}
            >
              {result.category}
            </p>
            <p className="mt-2 text-xs text-slate-600">{scoreText}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarClock className="size-4" />
              <p className="text-xs uppercase tracking-wide">Workplace Effectiveness</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{result.partBScore}/50</p>
            <p className="mt-1 text-xs text-slate-500">Based on Part B (10 questions)</p>
          </article>
        </div>
      </section>

      <section
        className="animate-fade-up grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        style={{ animationDelay: "0.12s" }}
      >
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Dimension-Wise Breakdown</h2>
          <div className="mt-4 space-y-3">
            {EI_DIMENSIONS.map((dimension) => {
              const score = result.dimensionScores[dimension.key];
              const percentage = Math.round((score / 25) * 100);

              return (
                <div key={dimension.key} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <p className="font-medium text-slate-800">{dimension.title}</p>
                    <p className="font-semibold text-slate-700">{score}/25</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Interpretation & Application</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            {Object.entries(CATEGORY_INSIGHTS).map(([category, insights]) => {
              const isCurrent = category === result.category;

              return (
                <div
                  key={category}
                  className={`rounded-lg border px-3 py-2 ${
                    isCurrent
                      ? "border-indigo-300 bg-indigo-50 text-indigo-900"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-semibold">{category}</p>
                  {insights.map((insight) => (
                    <p key={insight} className="mt-1">
                      {insight}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Applications</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>HR can use this framework for hiring and promotion decisions.</p>
            <p>Organizations can design focused EI training and coaching programs.</p>
            <p>Individuals can use outcomes for self-improvement planning.</p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Retake Assessment
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Go to Home
            </Link>
          </div>
        </article>
      </section>

      <div className="animate-fade-up" style={{ animationDelay: "0.18s" }}>
        <ResultCharts data={chartData} />
      </div>

      <section className="rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/60 p-5 text-sm text-indigo-900">
        <h2 className="font-semibold">Future Scope</h2>
        <p className="mt-1">
          AI-based personalized feedback can be added to generate tailored EI development
          recommendations based on this assessment profile.
        </p>
      </section>
    </main>
  );
}
