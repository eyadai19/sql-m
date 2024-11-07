/*
4
select
as
into
*/
import CodeBlock from "@/components/CodeArea";
import SelectPage from "@/components/SelectPage"
export default function select() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<SelectPage />
		
			<CodeBlock
			initialCode={`function greet() { return "Hello, world!"; }`}
			/>
		</div>
	);
}
