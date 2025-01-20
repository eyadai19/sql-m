import CommunityPage from "@/components/community/Community";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";

import Chatbot from "@/components/Chatbot";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import {
	ChatbotAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
	ChatbotWithNewContextAction,
} from "@/lib/ServerAction/chatBotNLP";
import {
	addPostAction,
	deletePostAction,
	editPostAction,
	fetchAllPostsAction,
	infoAddPostAction,
	postCommentAction,
	postCommentLikeAction,
	postLikeAction,
} from "../../lib/ServerAction/postsAction";
import { logoutAction } from "../Profile/page";

import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Community",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function Community() {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />
			<CommunityPage
				fetchAllPostsAction={fetchAllPostsAction}
				postLikeAction={postLikeAction}
				postCommentAction={postCommentAction}
				postCommentLikeAction={postCommentLikeAction}
				addPostAction={addPostAction}
				deletePostAction={deletePostAction}
				editPostAction={editPostAction}
				infoAddPostAction={infoAddPostAction}
			/>
			<Chatbot
				ChatbotAction={ChatbotAction}
				ChatbotExpAction={ChatbotExpAction}
				ChatbotTrArToEn={ChatbotTrArToEn}
				ChatbotTrEnToAr={ChatbotTrEnToAr}
				ChatbotWithNewContextAction={ChatbotWithNewContextAction}
			/>
		</div>
	);
}
