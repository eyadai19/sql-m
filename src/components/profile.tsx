"use client";
import { ProfileData } from "@/lib/types/authSchemas";
import { Post } from "@/lib/types/post";
import { UploadButton } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { FiAward, FiEdit3, FiEye } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PostCard from "./post/post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function ProfilePage({
	ProfileAction,
	UpdateProfileAction,
	userPostAction,
	editPostAction,
	deletePostAction,
	postCommentAction,
	postLikeAction,
	postCommentLikeAction,
}: {
	ProfileAction: () => Promise<
		ProfileData | { field: string; message: string } | undefined
	>;
	UpdateProfileAction: (
		data: FormData,
		photo: string | null,
	) => Promise<string | { field: string; message: string } | undefined>;
	userPostAction: () => Promise<Post[] | { field: string; message: string }>;
	editPostAction: (
		postId: string,
		title: string | null,
		content: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
	deletePostAction: (
		postId: string,
	) => Promise<{ field: string; message: string } | undefined>;
	postCommentAction: (
		postId: string,
		content: string,
		photo: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
	postLikeAction: (
		postId: string,
	) => Promise<{ field: string; message: string } | undefined>;
	postCommentLikeAction: (
		commentId: string,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [isSaving, setIsSaving] = useState(false);
	const [info, setInfo] = useState<ProfileData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newPhoto, setNewPhoto] = useState<string | null>(null);
	const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
	const [formData, setFormData] = useState({ firstName: "", lastName: "" });
	const [showAchievementsModal, setShowAchievementsModal] = useState(false);
	const [achievements, setAchievements] = useState<string[]>([]);
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [postsError, setPostError] = useState<string | null>(null);

	const router = useRouter();
	const swiperRef = useRef<any>(null);
	let maxStage: number;

	useEffect(() => {
		const fetchProfileData = async () => {
			const result = await ProfileAction();
			if (!result) {
				setError("Failed to fetch profile data.");
				return;
			}
			if ("field" in result) {
				setError(result.message);
			} else {
				setInfo(result as ProfileData);
				maxStage = result.stage.index;
				setFormData({
					firstName: result.firstName,
					lastName: result.lastName,
				});
			}
		};
		fetchProfileData();
	}, [ProfileAction]);

	useEffect(() => {
		async function fetchPosts() {
			const result = await userPostAction();
			if ("field" in result) {
				setPostError(result.message);
			} else {
				setPosts(result);
			}
		}
		fetchPosts();
	}, []);

	const handleReviewClick = (quizId: string) => {
		router.push(`/QuizDetalis/${quizId}`);
	};

	const handleEditClick = () => setIsEditing(true);
	const handleCancelEdit = () => {
		setIsEditing(false);
		setNewPhoto(null);
		setFormData({
			firstName: info?.firstName || "",
			lastName: info?.lastName || "",
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		setIsSaving(true);
		const updatedData = new FormData();
		updatedData.append("firstName", formData.firstName);
		updatedData.append("lastName", formData.lastName);
		if (uploadedPhotoUrl) {
			updatedData.append("photo", uploadedPhotoUrl);
		}

		const result = await UpdateProfileAction(updatedData, uploadedPhotoUrl);
		setIsSaving(false);

		if (result) {
			setIsEditing(false);
			const updatedProfile = await ProfileAction();
			if (!updatedProfile || "field" in updatedProfile) {
				setError("Failed to update profile data.");
			} else {
				setInfo(updatedProfile as ProfileData);
				setFormData({
					firstName: updatedProfile.firstName,
					lastName: updatedProfile.lastName,
				});
				setUploadedPhotoUrl(null);
			}
		} else {
			setError("Failed to update profile.");
		}
	};

	const handleAchievementsClick = () => {
		const stagesAchievements = [
			{ message: "Welcome to the journey!", icon: "🎉" },
			{ message: "Bronze Medal: Congrats on completing Stage 1!", icon: "🥉" },
			{ message: "Silver Medal: Great job on Stage 2!", icon: "🥈" },
			{ message: "Gold Medal: You conquered Stage 3!", icon: "🥇" },
			{
				message: "Platinum Medal: Outstanding achievement in Stage 4!",
				icon: "🏆",
			},
		];

		const achievementsToShow = stagesAchievements
			.slice(0, maxStage)
			.map((stage) => `${stage.icon} ${stage.message}`);

		setAchievements(achievementsToShow);
		setShowAchievementsModal(true);
	};

	if (error) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="rounded-lg bg-red-50 p-4 text-red-500 shadow-md">
					{error}
				</div>
			</div>
		);
	}

	if (!info) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#00203F] to-[#ADF0D1] px-4 py-8 md:px-8">
			<Tabs defaultValue="profile" className="mx-auto max-w-7xl">
				<TabsList className="mb-8 grid w-full grid-cols-2 rounded-xl bg-white/20">
					<TabsTrigger
						value="profile"
						className="rounded-lg text-sm font-medium text-white transition-all data-[state=active]:bg-white data-[state=active]:text-[#00203F]"
					>
						Profile
					</TabsTrigger>
					<TabsTrigger
						value="posts"
						className="rounded-lg text-sm font-medium text-white transition-all data-[state=active]:bg-white data-[state=active]:text-[#00203F]"
					>
						Posts
					</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="space-y-6">
					<div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
						<div className="flex flex-col gap-8 lg:flex-row">
							{/* Left Section */}
							<div className="w-full lg:w-1/2">
								<div className="relative rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-md">
									<div className="-mt-16 flex justify-center">
										<label
											htmlFor="photo"
											className={`relative cursor-pointer ${isEditing ? "" : "pointer-events-none"}`}
										>
											<div className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg transition-all hover:border-[#ADF0D1]">
												{newPhoto && (
													<img
														src={newPhoto}
														alt="Profile"
														className="h-full w-full object-cover transition-transform group-hover:scale-110"
													/>
												)}
												{info.photo && !newPhoto && (
													<img
														src={info.photo}
														alt="Profile"
														className="h-full w-full object-cover transition-transform group-hover:scale-110"
													/>
												)}
												{!info.photo && !newPhoto && (
													<div className="flex h-full items-center justify-center text-gray-400">
														<FiEdit3 size={24} />
													</div>
												)}
												{isEditing && (
													<UploadButton
														endpoint="imageUploader"
														className="absolute inset-0 opacity-0"
														onUploadProgress={() => setIsSaving(true)}
														onClientUploadComplete={(res) => {
															const uploadedFile = res[0];
															setNewPhoto(uploadedFile.url);
															setUploadedPhotoUrl(uploadedFile.url);
															setIsSaving(false);
														}}
														onUploadError={(error) => {
															console.error("Upload failed", error);
														}}
													/>
												)}
											</div>
										</label>
									</div>

									{isEditing ? (
										<div className="mt-6 space-y-4">
											<input
												type="text"
												name="firstName"
												value={formData.firstName}
												onChange={handleInputChange}
												className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#ADF0D1] focus:outline-none focus:ring-2 focus:ring-[#ADF0D1]/50"
												placeholder="First Name"
											/>
											<input
												type="text"
												name="lastName"
												value={formData.lastName}
												onChange={handleInputChange}
												className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#ADF0D1] focus:outline-none focus:ring-2 focus:ring-[#ADF0D1]/50"
												placeholder="Last Name"
											/>
											<div className="flex justify-end gap-3">
												<button
													onClick={handleCancelEdit}
													className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
												>
													Cancel
												</button>
												<button
													onClick={handleSave}
													disabled={isSaving}
													className="flex items-center rounded-lg bg-[#00203F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#001529]"
												>
													{isSaving ? (
														<>
															<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
															Saving...
														</>
													) : (
														"Save Changes"
													)}
												</button>
											</div>
										</div>
									) : (
										<div className="mt-6 text-center">
											<h1 className="text-2xl font-bold text-gray-800">
												{info.firstName} {info.lastName}
											</h1>
											<p className="mt-1 text-sm text-gray-500">
												@{info.username}
											</p>
											<div className="mt-4 inline-flex items-center rounded-full bg-[#00203F]/10 px-4 py-2">
												<FiAward className="mr-2 text-[#00203F]" />
												<span className="font-medium text-[#00203F]">
													Stage {info.stage.stage}
												</span>
											</div>
										</div>
									)}

									<div className="mt-6 flex items-center justify-between">
										<button
											onClick={handleAchievementsClick}
											className="flex items-center rounded-lg bg-gradient-to-r from-[#00203F] to-[#001529] px-4 py-2 text-sm font-medium text-white transition-all hover:from-[#001529] hover:to-[#00203F]"
										>
											<FiAward className="mr-2" />
											Achievements
										</button>
										{!isEditing && (
											<button
												onClick={handleEditClick}
												className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
											>
												<FiEdit3 className="mr-2" />
												Edit Profile
											</button>
										)}
									</div>
								</div>

								<Swiper
									onSwiper={(swiper) => (swiperRef.current = swiper)}
									loop={true}
									spaceBetween={30}
									slidesPerView={1}
									autoplay={{ delay: 3000 }}
									navigation
									modules={[Autoplay, Navigation]}
									className="mt-6 rounded-xl"
								>
									<SwiperSlide>
										<div className="rounded-xl bg-gradient-to-br from-[#00203F] to-[#001529] p-8 text-center text-white">
											<h2 className="text-xl font-bold">Learn With AI</h2>
											<p className="mt-2 text-gray-300">
												Enhance your SQL knowledge with our AI-powered learning
												system
											</p>
											<button className="mt-4 rounded-lg bg-white px-6 py-2 font-medium text-[#00203F] transition-colors hover:bg-gray-100">
												Start Learning
											</button>
										</div>
									</SwiperSlide>
								</Swiper>
							</div>

							{/* Right Section */}
							<div className="w-full lg:w-1/2">
								<div className="rounded-xl bg-white p-6 shadow-lg">
									<div className="mb-6 flex items-center justify-between">
										<h2 className="text-xl font-bold text-gray-800">
											Quiz Performance
										</h2>
										<span className="rounded-full bg-[#00203F]/10 px-3 py-1 text-sm font-medium text-[#00203F]">
											{info.quizzes.length} Quizzes
										</span>
									</div>

									{/* Desktop Table View */}
									<div className="hidden overflow-x-auto md:block">
										<table className="w-full border-collapse">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
														Quiz
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
														Stage
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
														Mark
													</th>
													<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
														Action
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200 bg-white">
												{info.quizzes.map((quiz, index) => (
													<tr key={quiz.id} className="hover:bg-gray-50">
														<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
															Quiz {index + 1}
														</td>
														<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
															Stage {info.stage.stage}
														</td>
														<td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#00203F]">
															{quiz.mark!.toFixed(1)}%
														</td>
														<td className="whitespace-nowrap px-6 py-4 text-right">
															<button
																onClick={() => handleReviewClick(quiz.id)}
																className="inline-flex items-center rounded-lg bg-[#00203F] px-3 py-1 text-sm text-white transition-colors hover:bg-[#001529]"
															>
																<FiEye className="mr-1" />
																Review
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>

									{/* Mobile Card View */}
									<div className="space-y-4 md:hidden">
										{info.quizzes.map((quiz, index) => (
											<div
												key={quiz.id}
												className="rounded-lg border bg-white p-4"
											>
												<div className="mb-2 flex items-center justify-between">
													<span className="font-medium">Quiz {index + 1}</span>
													<span className="font-bold text-[#00203F]">
														{quiz.mark!.toFixed(1)}%
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-500">
														Stage {info.stage.stage}
													</span>
													<button
														onClick={() => handleReviewClick(quiz.id)}
														className="inline-flex items-center rounded-lg bg-[#00203F] px-3 py-1 text-sm text-white transition-colors hover:bg-[#001529]"
													>
														<FiEye className="mr-1" />
														Review
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="posts" className="w-full">
					<div className="grid max-w-full grid-cols-1 gap-6">
						{posts?.map((post) => (
							<div
								key={post.id}
								className="w-full overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
							>
								<PostCard
									post={post}
									postLikeAction={postLikeAction}
									postCommentAction={postCommentAction}
									postCommentLikeAction={postCommentLikeAction}
									deletePostAction={deletePostAction}
									editPostAction={editPostAction}
									useImage={info.photo}
								/>
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>

			{/* Achievements Modal */}
			{showAchievementsModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						numberOfPieces={200}
						recycle={false}
					/>
					<div className="w-11/12 max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
						<h2 className="text-2xl font-bold text-gray-800">
							Your Achievements
						</h2>
						<div className="mt-6 space-y-4">
							{achievements.map((achievement, index) => (
								<div
									key={index}
									className="rounded-lg bg-gradient-to-r from-gray-50 to-white p-4 shadow-md"
								>
									<p className="text-lg text-gray-700">{achievement}</p>
								</div>
							))}
						</div>
						<button
							onClick={() => setShowAchievementsModal(false)}
							className="mt-6 w-full rounded-lg bg-[#00203F] py-3 font-medium text-white transition-colors hover:bg-[#001529]"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
