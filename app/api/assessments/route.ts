import { NextResponse } from "next/server";

import { createAssessment } from "@/lib/assessmentRepository";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessmentData";
import type { AnswersMap } from "@/lib/scoring";

function validateAnswers(input: unknown): { valid: true; answers: AnswersMap } | { valid: false; message: string } {
  if (!input || typeof input !== "object") {
    return { valid: false, message: "Answers payload is required." };
  }

  const rawAnswers = input as Record<string, unknown>;
  const parsedAnswers: Partial<AnswersMap> = {};

  for (const question of ASSESSMENT_QUESTIONS) {
    const rawValue = rawAnswers[String(question.id)] ?? rawAnswers[question.id];
    const value = Number(rawValue);

    if (![1, 2, 3, 4, 5].includes(value)) {
      return {
        valid: false,
        message: `Question ${question.id} must be answered using the 1-5 Likert scale.`,
      };
    }

    parsedAnswers[question.id] = value as 1 | 2 | 3 | 4 | 5;
  }

  return {
    valid: true,
    answers: parsedAnswers as AnswersMap,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateAnswers(body?.answers);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const record = await createAssessment(validation.answers);

    return NextResponse.json({
      id: record.id,
      totalScore: record.totalScore,
      category: record.category,
      dimensionScores: record.dimensionScores,
      partBScore: record.partBScore,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
