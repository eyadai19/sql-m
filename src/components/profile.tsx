"use client";
import { ProfileData } from "@/lib/types/authSchemas";
import { Post } from "@/lib/types/post";
import { faEdit, faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserPosts } from "./UserPosts";

export default function ProfilePage({
	ProfileAction,
	UpdateProfileAction,
	userPostAction,
	editPostAction,
}: {
	ProfileAction: () => Promise<
		ProfileData | { field: string; message: string } | undefined
	>;
	UpdateProfileAction: (
		data: FormData,
	) => Promise<string | { field: string; message: string } | undefined>;
	userPostAction: () => Promise<Post[] | { field: string; message: string }>;
	editPostAction: (
		postId: string,
		title: string | null,
		content: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [info, setInfo] = useState<ProfileData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newPhoto, setNewPhoto] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
	});
	const [showAchievementsModal, setShowAchievementsModal] = useState(false);
	const [achievements, setAchievements] = useState<string[]>([]);

	const router = useRouter();
	const swiperRef = useRef<any>(null);

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
				await setInfo(result as ProfileData);

				setFormData({
					firstName: result.firstName,
					lastName: result.lastName,
				});
			}
		};
		fetchProfileData();
	}, [ProfileAction]);

	const [posts, setPosts] = useState<Post[] | null>(null);
	const [postsError, setPostError] = useState<string | null>(null);

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

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setNewPhoto(null);
		setFormData({
			firstName: info?.firstName || "",
			lastName: info?.lastName || "",
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				setNewPhoto(reader.result as string);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		const updatedData = new FormData();
		updatedData.append("firstName", formData.firstName);
		updatedData.append("lastName", formData.lastName);

		if (newPhoto) {
			const fileInput = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			if (fileInput?.files?.[0]) {
				updatedData.append("photo", fileInput.files[0]);
			}
		}

		const result = await UpdateProfileAction(updatedData);
		if (!result) {
			setError("Failed to fetch profile data.");
			return;
		} else {
			setIsEditing(false);
			const updatedProfile = await ProfileAction();
			if (!updatedProfile) {
				setError("Failed to fetch profile data.");
				return;
			}

			if ("field" in updatedProfile) {
				setError(updatedProfile.message);
			} else {
				setInfo(updatedProfile as ProfileData);
				setFormData({
					firstName: updatedProfile.firstName,
					lastName: updatedProfile.lastName,
				});
			}
		}
	};

	const handleAchievementsClick = () => {
		if (info?.stage.stage === "Stage 1") {
			setAchievements(["Bronze Medal", "Congrats on completing Stage 1!"]);
		} else if (info?.stage.stage === "Stage 2") {
			setAchievements(["Silver Medal", "Great job on Stage 2!"]);
		} else if (info?.stage.stage === "Stage 3") {
			setAchievements(["Gold Medal", "You conquered Stage 3!"]);
		}
		setShowAchievementsModal(true);
	};

	const closeAchievementsModal = () => {
		setShowAchievementsModal(false);
	};

	if (error) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-red-500">{error}</p>
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
			<div className="mx-auto max-w-7xl">
				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="mb-8 grid w-full grid-cols-2">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="posts">Posts</TabsTrigger>
					</TabsList>

					<TabsContent value="profile" className="space-y-4">
						<div className="rounded-lg bg-white p-8 shadow-lg md:p-8">
							<div className="grid gap-8 md:grid-cols-2">
								{/* Left Column */}
								<div className="space-y-6">
									{/* Profile Card */}
									<div className="relative rounded-lg bg-gray-50 p-6 shadow-sm">
										<div className="-mt-10 flex justify-center">
											<div className="h-32 w-32 overflow-hidden rounded-full border-4 border-gray-300 bg-gray-200">
												{newPhoto ? (
													<img
														src={newPhoto}
														alt="New Profile"
														className="h-full w-full object-cover"
													/>
												) : info.photo ? (
													<img
														src={info.photo}
														alt="User Profile"
														className="h-full w-full object-cover"
													/>
												) : (
													<span className="flex h-full items-center justify-center text-gray-500">
														No Image
													</span>
												)}
											</div>
										</div>

										{isEditing ? (
											<div className="mt-4 space-y-4">
												<input
													type="file"
													accept="image/*"
													onChange={handleFileChange}
													className="w-full text-sm text-gray-600"
												/>
												<input
													type="text"
													name="firstName"
													value={formData.firstName}
													onChange={handleInputChange}
													className="w-full rounded border px-4 py-2 text-gray-800"
													placeholder="First Name"
												/>
												<input
													type="text"
													name="lastName"
													value={formData.lastName}
													onChange={handleInputChange}
													className="w-full rounded border px-4 py-2 text-gray-800"
													placeholder="Last Name"
												/>
												<div className="flex justify-center gap-4">
													<button
														onClick={handleSave}
														className="rounded bg-gray-700 px-6 py-2 text-white transition hover:bg-gray-800"
													>
														Save
													</button>
													<button
														onClick={handleCancelEdit}
														className="rounded bg-red-500 px-6 py-2 text-white transition hover:bg-red-600"
													>
														Cancel
													</button>
												</div>
											</div>
										) : (
											<div className="mt-8 text-center">
												<h1 className="text-2xl font-bold text-gray-800">{`${info.firstName} ${info.lastName}`}</h1>
												<p className="text-sm text-gray-500">
													@{info.username}
												</p>
												<p className="mt-4 text-lg font-medium text-gray-700">{`Stage: ${info.stage.stage}`}</p>
											</div>
										)}

										<div className="mt-6 flex items-center justify-between px-4">
											<button
												onClick={handleAchievementsClick}
												className="flex items-center text-gray-700 hover:text-gray-900"
											>
												<FontAwesomeIcon icon={faMedal} className="mr-2" />
												<span className="font-medium">Achievements</span>
											</button>
											{!isEditing && (
												<button
													onClick={handleEditClick}
													className="flex items-center text-gray-700 hover:text-gray-900"
												>
													<FontAwesomeIcon icon={faEdit} className="mr-2" />
													<span className="font-medium">Edit</span>
												</button>
											)}
										</div>
									</div>

									{/* AI Learning Section */}
									<div className="rounded-lg bg-gray-50 p-6 shadow-sm">
										<h2 className="text-xl font-bold text-gray-700">
											Learn With AI
										</h2>
										<p className="mt-2 text-gray-600">
											Improve your knowledge in SQL.
										</p>
										<button className="mt-4 rounded bg-gray-700 px-6 py-2 text-white transition hover:bg-gray-800">
											Chat!
										</button>
									</div>
								</div>

								{/* Right Column - Quizzes Overview */}
								<div className="rounded-lg bg-gray-50 p-6 shadow-sm">
									<h2 className="mb-6 text-xl font-bold text-gray-700">
										Quizzes Overview
									</h2>
									<div className="overflow-x-auto">
										<table className="w-full text-left text-sm">
											<thead className="bg-gray-200">
												<tr>
													<th className="px-4 py-2">No.</th>
													<th className="px-4 py-2">Stage</th>
													<th className="px-4 py-2">Mark %</th>
													<th className="px-4 py-2"></th>
												</tr>
											</thead>
											<tbody>
												{info.quizzes.map((quiz, index) => (
													<tr
														key={quiz.id}
														className="odd:bg-white even:bg-gray-100"
													>
														<td className="px-4 py-2">{index + 1}</td>
														<td className="px-4 py-2">{info.stage.stage}</td>
														<td className="px-4 py-2">
															{quiz.mark!.toFixed(2)}%
														</td>
														<td className="px-4 py-2">
															<button
																onClick={() => handleReviewClick(quiz.id)}
																className="rounded-full bg-gray-700 p-2 text-white transition hover:bg-gray-800"
															>
																<FiEye className="h-4 w-4" />
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="posts">
						<div className="rounded-lg bg-white p-4 shadow-lg md:p-8">
							<h2 className="mb-6 text-2xl font-bold">Posts</h2>
							<UserPosts />
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Achievements Modal */}
			{showAchievementsModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
						<h2 className="text-xl font-bold text-gray-700">Achievements</h2>
						<ul className="mt-4 space-y-2">
							{achievements.map((achievement, index) => (
								<li key={index} className="text-gray-600">
									{achievement}
								</li>
							))}
						</ul>
						<div className="mt-6 flex justify-end">
							<button
								onClick={closeAchievementsModal}
								className="rounded bg-red-500 px-6 py-2 text-white transition hover:bg-red-600"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
