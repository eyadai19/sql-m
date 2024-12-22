import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SQLEditorProps {
	value: string;
	onChange: (value: string) => void;
	onExecute: () => void;
}

export default function SQLEditor({
	value,
	onChange,
	onExecute,
}: SQLEditorProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			onExecute();
		}
	};

	return (
		<section>
			<Label htmlFor="sql-editor" className="mb-2 block text-lg font-semibold">
				SQL Editor{" "}
				<span className="text-sm font-normal text-gray-500">
					(Press Ctrl+Enter to run)
				</span>
			</Label>
			<Textarea
				id="sql-editor"
				className="h-40 font-mono text-sm focus:outline-none"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type your SQL query here..."
			/>
		</section>
	);
}
