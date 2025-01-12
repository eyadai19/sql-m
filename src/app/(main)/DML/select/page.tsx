import Select from "@/components/pages/DML/select";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Select Query",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};
export default function select() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<Select getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
