import Reference from "@/components/pages/basic/reference";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Reference",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function reference() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Reference getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
