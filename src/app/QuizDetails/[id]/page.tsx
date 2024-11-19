import { db } from "@/lib/db";

interface QuizDetailsProps {
	params: {
		quizId: string;
	};
}

export default async function QuizDetails({ params }: QuizDetailsProps) {
	const quizDetails = await db.query.TB_quiz_questions.findMany({
		where: (question, { eq }) => eq(question.quizId, params.quizId),
	});

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 text-2xl font-bold">Quiz Details</h1>
			{quizDetails.length > 0 ? (
				<div className="space-y-4">
					{quizDetails.map((question) => (
						<div
							key={question.id}
							className="rounded border bg-white p-4 shadow-sm"
						>
							<div className="text-lg font-semibold">
								<span className="text-gray-600">Question:</span>{" "}
								{question.question}
							</div>
							<div className="mt-2 text-sm">
								<span className="font-medium text-green-600">Your Answer:</span>{" "}
								{question.answer}
							</div>
							<div
								className={`mt-2 ${
									question.score === 1 ? "text-green-500" : "text-red-500"
								}`}
							>
								Score: {question.score === 1 ? "Correct" : "Incorrect"}
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-500">No questions found for this quiz.</p>
			)}
		</div>
	);
}
