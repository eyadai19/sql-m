import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import ChatbotExpTest from "../../components/ChatbotExpComponent";

export default function page() {
	return (
		<div>
			<ChatbotExpTest ChatbotExpAction={ChatbotExpAction} />
		</div>
	);
}
