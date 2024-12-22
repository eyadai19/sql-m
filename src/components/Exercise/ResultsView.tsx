import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { QueryResult } from "@/lib/types/mockDatabase";
import { Trophy } from "lucide-react";

interface ResultsViewProps {
	result: QueryResult;
}

const formatDate = (value: string | number) => {
	if (typeof value === "string" && value.includes("T")) {
		return new Date(value).toLocaleDateString();
	}
	return value;
};

export default function ResultsView({ result }: ResultsViewProps) {
	return (
		<section className="mt-6 space-y-4">
			{result.successMessage && (
				<Alert className={`mb-4 border-green-200 bg-green-50 text-green-800`}>
					<div className="flex items-center">
						<Trophy className="mr-2 h-4 w-4" />
						<AlertDescription>{result.successMessage}</AlertDescription>
					</div>
				</Alert>
			)}

			{result.rows.length > 0 && (
				<>
					<h2 className="text-lg font-semibold">Results:</h2>
					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<Table>
							<TableHeader>
								<TableRow>
									{result.columns.map((column, i) => (
										<TableHead
											key={i}
											className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>
											{column}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{result.rows.map((row, i) => (
									<TableRow key={i}>
										{row.map((cell, j) => (
											<TableCell
												key={j}
												className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
											>
												{formatDate(cell)}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			)}
		</section>
	);
}
