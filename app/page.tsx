import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";

import { DimensionCard } from "@/components/DimensionCard";
import { EI_DIMENSIONS } from "@/lib/assessmentData";

export default function Home() {
  return (
    <div className="relative isolate">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-10 sm:px-10 lg:py-14">
        <section
          className="animate-fade-up rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl shadow-indigo-100/70 backdrop-blur md:p-12"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
            <ClipboardCheck className="size-4" />
            Academic HR Assessment Tool
          </div>

          <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
            Emotional Intelligence Assessment Framework
          </h1>

          <h2 className="mt-4 max-w-2xl text-lg text-slate-700 md:text-xl">
            Evaluate Workplace Effectiveness using Emotional Intelligence
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
            This tool assesses emotional intelligence across key dimensions such as self-awareness,
            self-regulation, motivation, empathy, and social skills, and links them to workplace
            performance.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/60 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Start Assessment
              <ArrowRight className="size-4" />
            </Link>
            <p className="text-sm text-slate-500">35 questions | 5-point Likert scale | Instant result profile</p>
          </div>
        </section>

        <section className="animate-fade-up space-y-5" style={{ animationDelay: "0.12s" }}>
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Core EI Dimensions</h2>
            <p className="max-w-3xl text-sm text-slate-600">
              The framework measures five emotional intelligence dimensions and maps how they influence
              workplace effectiveness.
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EI_DIMENSIONS.map((dimension) => (
              <DimensionCard key={dimension.key} dimension={dimension} />
            ))}
          </div>
        </section>

        <section
          className="animate-fade-up grid gap-6 lg:grid-cols-2"
          style={{ animationDelay: "0.18s" }}
        >
          <article className="rounded-2xl border border-indigo-100 bg-white/85 p-6 shadow-lg shadow-indigo-100/40">
            <h3 className="text-lg font-semibold text-slate-900">Dimensions Used</h3>
            <ol className="mt-4 space-y-4 text-sm text-slate-700">
              <li>
                <p className="font-medium text-slate-900">1. Self-Awareness</p>
                <p>Ability to recognize and understand your own emotions and their impact.</p>
              </li>
              <li>
                <p className="font-medium text-slate-900">2. Self-Regulation</p>
                <p>Ability to control impulses, manage stress, and adapt to changes.</p>
              </li>
              <li>
                <p className="font-medium text-slate-900">3. Motivation</p>
                <p>Internal drive to achieve goals and stay resilient despite challenges.</p>
              </li>
              <li>
                <p className="font-medium text-slate-900">4. Empathy</p>
                <p>Ability to understand and share the feelings of others.</p>
              </li>
              <li>
                <p className="font-medium text-slate-900">5. Social Skills</p>
                <p>Ability to communicate, collaborate, and manage relationships effectively.</p>
              </li>
            </ol>
          </article>

          <article className="rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-lg shadow-blue-100/40">
            <h3 className="text-lg font-semibold text-slate-900">Scoring Framework</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>Only Part A (Questions 1-25) is used for EI classification.</li>
              <li>Each question is scored from 1 (Strongly Disagree) to 5 (Strongly Agree).</li>
              <li>Total score range: 25 to 125.</li>
            </ul>

            <div className="mt-5 grid gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm">
                <p className="font-semibold text-emerald-800">100-125: High Emotional Intelligence</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm">
                <p className="font-semibold text-amber-800">70-99: Moderate Emotional Intelligence</p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm">
                <p className="font-semibold text-rose-800">25-69: Low Emotional Intelligence</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
