import {
  ASSESSMENT_QUESTIONS,
  EI_DIMENSIONS,
  type EIDimensionKey,
} from "@/lib/assessmentData";

export type AnswersMap = Record<number, 1 | 2 | 3 | 4 | 5>;

export type EICategory = "High Emotional Intelligence" | "Moderate Emotional Intelligence" | "Low Emotional Intelligence";

export type DimensionScores = Record<EIDimensionKey, number>;

export type AssessmentResult = {
  totalScore: number;
  category: EICategory;
  dimensionScores: DimensionScores;
};

const PART_A_QUESTIONS = ASSESSMENT_QUESTIONS.filter(
  (question) => question.section === "partA",
);

const DIMENSION_MAX_SCORE = 25;

export function classifyEIScore(totalScore: number): EICategory {
  if (totalScore >= 100) {
    return "High Emotional Intelligence";
  }

  if (totalScore >= 70) {
    return "Moderate Emotional Intelligence";
  }

  return "Low Emotional Intelligence";
}

export function computeAssessmentResult(answers: AnswersMap): AssessmentResult {
  const baseDimensionScores = EI_DIMENSIONS.reduce((accumulator, dimension) => {
    accumulator[dimension.key] = 0;
    return accumulator;
  }, {} as DimensionScores);

  let totalScore = 0;

  for (const question of PART_A_QUESTIONS) {
    const value = answers[question.id] ?? 0;
    totalScore += value;

    if (question.dimension) {
      baseDimensionScores[question.dimension] += value;
    }
  }

  return {
    totalScore,
    category: classifyEIScore(totalScore),
    dimensionScores: baseDimensionScores,
  };
}

export function toDimensionChartData(dimensionScores: DimensionScores) {
  return EI_DIMENSIONS.map((dimension) => ({
    key: dimension.key,
    name: dimension.title,
    score: dimensionScores[dimension.key],
    max: DIMENSION_MAX_SCORE,
  }));
}

export const SCORE_BOUNDS = {
  min: 25,
  max: 125,
  perDimensionMax: DIMENSION_MAX_SCORE,
};
