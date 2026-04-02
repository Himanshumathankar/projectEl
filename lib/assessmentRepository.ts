import { randomUUID } from "node:crypto";
import type { QueryResultRow } from "pg";

import { EI_DIMENSIONS, PART_B_QUESTION_IDS } from "@/lib/assessmentData";
import { getPostgresPool } from "@/lib/postgres";
import {
  computeAssessmentResult,
  type AnswersMap,
  type AssessmentResult,
  type EICategory,
} from "@/lib/scoring";

const TABLE_NAME = "assessments";

type AssessmentRecord = {
  id: string;
  answers: Record<string, number>;
  totalScore: number;
  category: EICategory;
  dimensionScores: AssessmentResult["dimensionScores"];
  partBScore: number;
  createdAt: Date;
};

export type StoredAssessment = {
  id: string;
  answers: Record<string, number>;
  totalScore: number;
  category: EICategory;
  dimensionScores: AssessmentResult["dimensionScores"];
  partBScore: number;
  createdAt: string;
};

type AssessmentRow = QueryResultRow & {
  id: string;
  answers: Record<string, number> | string;
  total_score: number;
  category: EICategory;
  dimension_scores: AssessmentResult["dimensionScores"] | string;
  part_b_score: number;
  created_at: Date | string;
};

let tableReadyPromise: Promise<void> | undefined;

async function ensureTable() {
  if (tableReadyPromise) {
    return tableReadyPromise;
  }

  const pool = getPostgresPool();
  tableReadyPromise = pool
    .query(
      `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id UUID PRIMARY KEY,
        answers JSONB NOT NULL,
        total_score INTEGER NOT NULL,
        category TEXT NOT NULL,
        dimension_scores JSONB NOT NULL,
        part_b_score INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
    )
    .then(() => undefined)
    .catch((error) => {
      tableReadyPromise = undefined;
      throw error;
    });

  return tableReadyPromise;
}

function toNumberKeyedAnswerMap(answers: Record<string, number>): AnswersMap {
  const mapped: Partial<AnswersMap> = {};

  for (const [key, value] of Object.entries(answers)) {
    const numericKey = Number(key);
    if (Number.isFinite(numericKey) && value >= 1 && value <= 5) {
      mapped[numericKey] = value as 1 | 2 | 3 | 4 | 5;
    }
  }

  return mapped as AnswersMap;
}

function computePartBScore(answers: AnswersMap): number {
  return PART_B_QUESTION_IDS.reduce((total, questionId) => {
    return total + (answers[questionId] ?? 0);
  }, 0);
}

function parseJsonField<T>(value: T | string): T {
  if (typeof value === "string") {
    return JSON.parse(value) as T;
  }

  return value;
}

export function getDimensionRecords(dimensionScores: AssessmentResult["dimensionScores"]) {
  return EI_DIMENSIONS.map((dimension) => ({
    key: dimension.key,
    name: dimension.title,
    score: dimensionScores[dimension.key],
    max: 25,
  }));
}

export async function createAssessment(answers: AnswersMap) {
  await ensureTable();
  const pool = getPostgresPool();
  const computed = computeAssessmentResult(answers);
  const id = randomUUID();

  const serializableAnswers = Object.fromEntries(
    Object.entries(answers).map(([questionId, value]) => [questionId, Number(value)]),
  );

  const record: AssessmentRecord = {
    id,
    answers: serializableAnswers,
    totalScore: computed.totalScore,
    category: computed.category,
    dimensionScores: computed.dimensionScores,
    partBScore: computePartBScore(answers),
    createdAt: new Date(),
  };

  await pool.query(
    `
      INSERT INTO ${TABLE_NAME} (
        id,
        answers,
        total_score,
        category,
        dimension_scores,
        part_b_score,
        created_at
      )
      VALUES ($1, $2::jsonb, $3, $4, $5::jsonb, $6, $7)
    `,
    [
      record.id,
      JSON.stringify(record.answers),
      record.totalScore,
      record.category,
      JSON.stringify(record.dimensionScores),
      record.partBScore,
      record.createdAt,
    ],
  );

  return {
    id: record.id,
    totalScore: computed.totalScore,
    category: computed.category,
    dimensionScores: computed.dimensionScores,
    partBScore: record.partBScore,
  };
}

export async function getAssessmentById(id: string): Promise<StoredAssessment | null> {
  if (!id?.trim()) {
    return null;
  }

  await ensureTable();
  const pool = getPostgresPool();
  const queryResult = await pool.query<AssessmentRow>(
    `
      SELECT
        id,
        answers,
        total_score,
        category,
        dimension_scores,
        part_b_score,
        created_at
      FROM ${TABLE_NAME}
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const row = queryResult.rows[0];

  if (!row) {
    return null;
  }

  const answers = parseJsonField<Record<string, number>>(row.answers);
  const dimensionScores = parseJsonField<AssessmentResult["dimensionScores"]>(row.dimension_scores);

  const normalizedAnswers = toNumberKeyedAnswerMap(answers);

  return {
    id: row.id,
    answers,
    totalScore: row.total_score,
    category: row.category,
    dimensionScores,
    partBScore: row.part_b_score ?? computePartBScore(normalizedAnswers),
    createdAt: new Date(row.created_at).toISOString(),
  };
}
