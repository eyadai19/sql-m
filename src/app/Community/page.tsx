import CommunityPage from "@/components/community/Community";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";

import {
	addPostAction,
	deletePostAction,
	editPostAction,
	fetchAllPostsAction,
	postCommentAction,
	postCommentLikeAction,
	postLikeAction,
} from "../../lib/ServerAction/postsAction";
import { logoutAction } from "../Profile/page";

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
			/>
		</div>
	);
}
