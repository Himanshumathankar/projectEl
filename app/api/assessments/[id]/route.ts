import { NextResponse } from "next/server";

import { getAssessmentById } from "@/lib/assessmentRepository";
import { toDimensionChartData } from "@/lib/scoring";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const record = await getAssessmentById(id);

    if (!record) {
      return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    }

    return NextResponse.json({
      ...record,
      dimensionChartData: toDimensionChartData(record.dimensionScores),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
