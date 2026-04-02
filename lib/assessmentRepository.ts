import { ObjectId } from "mongodb";

import { EI_DIMENSIONS, PART_B_QUESTION_IDS } from "@/lib/assessmentData";
import { getMongoClientPromise } from "@/lib/mongodb";
import {
  computeAssessmentResult,
  type AnswersMap,
  type AssessmentResult,
  type EICategory,
} from "@/lib/scoring";

const DATABASE_NAME = process.env.MONGODB_DB ?? "ei_assessment_db";
const COLLECTION_NAME = "assessments";

type AssessmentDocument = {
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

async function getCollection() {
  const client = await getMongoClientPromise();
  const database = client.db(DATABASE_NAME);
  return database.collection<AssessmentDocument>(COLLECTION_NAME);
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

export function getDimensionRecords(dimensionScores: AssessmentResult["dimensionScores"]) {
  return EI_DIMENSIONS.map((dimension) => ({
    key: dimension.key,
    name: dimension.title,
    score: dimensionScores[dimension.key],
    max: 25,
  }));
}

export async function createAssessment(answers: AnswersMap) {
  const collection = await getCollection();
  const computed = computeAssessmentResult(answers);

  const serializableAnswers = Object.fromEntries(
    Object.entries(answers).map(([questionId, value]) => [questionId, Number(value)]),
  );

  const document: AssessmentDocument = {
    answers: serializableAnswers,
    totalScore: computed.totalScore,
    category: computed.category,
    dimensionScores: computed.dimensionScores,
    partBScore: computePartBScore(answers),
    createdAt: new Date(),
  };

  const insertResult = await collection.insertOne(document);

  return {
    id: insertResult.insertedId.toString(),
    totalScore: computed.totalScore,
    category: computed.category,
    dimensionScores: computed.dimensionScores,
    partBScore: document.partBScore,
  };
}

export async function getAssessmentById(id: string): Promise<StoredAssessment | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getCollection();
  const document = await collection.findOne({ _id: new ObjectId(id) });

  if (!document) {
    return null;
  }

  const normalizedAnswers = toNumberKeyedAnswerMap(document.answers);

  return {
    id,
    answers: document.answers,
    totalScore: document.totalScore,
    category: document.category,
    dimensionScores: document.dimensionScores,
    partBScore: computePartBScore(normalizedAnswers),
    createdAt: document.createdAt.toISOString(),
  };
}
