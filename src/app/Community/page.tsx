import CommunityPage from "@/components/community/Community";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";

import { logoutAction } from "../Profile/page";
import {
	fetchAllPostsAction,
	postCommentAction,
	postCommentLikeAction,
	postLikeAction,
} from "../actions/postsAction";

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
			/>
		</div>
	);
}
