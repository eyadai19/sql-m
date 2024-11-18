import { NextRequest, NextResponse } from "next/server";
import getDummyDataSubset from "@/utils/getDummyDataSubset";
import { validateSolution } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { userSolution, exerciseId } = await req.json();

    // Fetch the expected data subset for the exercise
    const dummyData = getDummyDataSubset(exerciseId, 5);

    // Validate the user's solution
    const isValid = validateSolution(userSolution, dummyData);

    return NextResponse.json({ success: true, isValid });
  } catch (error: unknown) { // Explicitly type the error as 'unknown'
    if (error instanceof Error) { // Check if the error is an instance of the Error class
      console.error("Validation error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}