"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LoaderCircle, Send } from "lucide-react";

import { ProgressBar } from "@/components/ProgressBar";
import {
  ASSESSMENT_QUESTIONS,
  LIKERT_OPTIONS,
  QUESTION_STEPS,
  type AssessmentQuestion,
} from "@/lib/assessmentData";
import type { AnswersMap } from "@/lib/scoring";

const QUESTIONS_BY_ID = new Map<number, AssessmentQuestion>(
  ASSESSMENT_QUESTIONS.map((question) => [question.id, question]),
);

export default function AssessmentPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<AnswersMap>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = QUESTION_STEPS[stepIndex];
  const isLastStep = stepIndex === QUESTION_STEPS.length - 1;

  const currentQuestions = useMemo(() => {
    return currentStep.questionIds
      .map((questionId) => QUESTIONS_BY_ID.get(questionId))
      .filter(Boolean) as AssessmentQuestion[];
  }, [currentStep]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = ASSESSMENT_QUESTIONS.length;

  const isCurrentStepComplete = currentStep.questionIds.every((questionId) => {
    return answers[questionId] !== undefined;
  });

  const canSubmit = answeredCount === totalQuestions;

  function answerQuestion(questionId: number, value: 1 | 2 | 3 | 4 | 5) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  function goToNextStep() {
    if (!isCurrentStepComplete) {
      setError("Please answer all questions in this section before continuing.");
      return;
    }

    setError(null);
    setStepIndex((previous) => Math.min(previous + 1, QUESTION_STEPS.length - 1));
  }

  function goToPreviousStep() {
    setError(null);
    setStepIndex((previous) => Math.max(previous - 1, 0));
  }

  async function submitAssessment() {
    if (!canSubmit) {
      setError("Please complete all 35 questions before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to submit assessment.");
      }

      router.push(`/results/${payload.id}`);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while submitting your assessment.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 lg:py-10">
      <section className="rounded-3xl border border-white/50 bg-white/85 p-6 shadow-2xl shadow-indigo-100/60 backdrop-blur md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Emotional Intelligence Assessment
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              EI + Workplace Effectiveness Questionnaire
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Rate each statement using the 5-point Likert scale:
              1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly Agree.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-indigo-700 transition-colors hover:text-indigo-900"
          >
            Back to Home
          </Link>
        </div>

        <ProgressBar value={answeredCount} total={totalQuestions} />

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {QUESTION_STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            const isCompleted = step.questionIds.every((questionId) => answers[questionId] !== undefined);

            return (
              <div
                key={step.key}
                className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                    : isCompleted
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <p className="font-semibold">Step {index + 1}</p>
                <p>{step.title}</p>
              </div>
            );
          })}
        </div>

        <section className="mt-7 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/70 p-5">
          <h2 className="text-xl font-semibold text-slate-900">{currentStep.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{currentStep.description}</p>

          <div className="mt-5 space-y-5">
            {currentQuestions.map((question) => (
              <article
                key={question.id}
                className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
              >
                <p className="text-sm font-medium leading-relaxed text-slate-800">
                  <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                    {question.id}
                  </span>
                  {question.text}
                </p>

                <fieldset className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
                  <legend className="sr-only">Likert options for question {question.id}</legend>
                  {LIKERT_OPTIONS.map((option) => {
                    const checked = answers[question.id] === option.value;

                    return (
                      <label
                        key={`${question.id}-${option.value}`}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-medium transition-colors ${
                          checked
                            ? "border-indigo-400 bg-indigo-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value}
                          className="sr-only"
                          checked={checked}
                          onChange={() => answerQuestion(question.id, option.value)}
                        />
                        <p className="text-base leading-none">{option.value}</p>
                        <p className="mt-1">{option.label}</p>
                      </label>
                    );
                  })}
                </fieldset>
              </article>
            ))}
          </div>
        </section>

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={stepIndex === 0 || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={submitAssessment}
              disabled={!canSubmit || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
              Submit Assessment
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNextStep}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Next Step
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
