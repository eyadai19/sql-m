"use client";
import { ProfileData } from "@/lib/types/authSchemas";
import { faEdit, faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function ProfilePage({
	ProfileAction,
	UpdateProfileAction,
}: {
	ProfileAction: () => Promise<
		ProfileData | { field: string; message: string } | undefined
	>;
	UpdateProfileAction: (
		data: FormData,
	) => Promise<string | { field: string; message: string } | undefined>;
}) {
	const [info, setInfo] = useState<ProfileData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newPhoto, setNewPhoto] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
	});
	const router = useRouter();
	const swiperRef = useRef<any>(null);
	useEffect(() => {
		console.log(info?.photo);
	}, [info?.photo]);

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
				<p>Loading...</p>
			</div>
		);
	}
	return (
		<div
			className="flex min-h-screen items-center justify-center px-8"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}
		>
			<div
				className="m-8 w-full max-w-6xl rounded-lg p-12 shadow-md"
				style={{ background: "#ffffff" }}
			>
				<div className="flex flex-col items-start gap-12 md:flex-row">
					{/* القسم الأيسر */}
					<div
						className="flex w-full flex-col gap-8 md:w-1/2"
						style={{ background: "#f1f5f9" }}
					>
						{/* بطاقة المعلومات الشخصية */}
						<div
							className="relative rounded-lg p-6 shadow-sm"
							style={{ background: "#f9fafb" }}
						>
							<div className="-mt-16 flex justify-center">
								<div className="h-32 w-32 overflow-hidden rounded-full border-4 border-gray-300 bg-gray-200">
									{newPhoto ? (
										<img
											src={newPhoto}
											alt="New Profile"
											className="h-full w-full object-cover"
										/>
									) : info.photo && info.photo.startsWith("data:image/") ? (
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
								<div className="mt-4 text-center">
									<input
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="mb-4 w-full text-sm text-gray-600"
									/>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										className="mb-2 w-full rounded border px-4 py-2 text-gray-800"
										placeholder="First Name"
									/>
									<input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
										className="mb-4 w-full rounded border px-4 py-2 text-gray-800"
										placeholder="Last Name"
									/>
									<div className="flex justify-center gap-4">
										<button
											onClick={handleSave}
											className="rounded bg-gray-700 px-6 py-2 text-white shadow-sm transition duration-300 hover:bg-gray-800"
										>
											Save
										</button>
										<button
											onClick={handleCancelEdit}
											className="rounded bg-red-500 px-6 py-2 text-white shadow-sm transition duration-300 hover:bg-red-600"
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<div className="mt-8 text-center">
									<h1 className="text-2xl font-bold text-gray-800">{`${info.firstName} ${info.lastName}`}</h1>
									<p className="text-sm text-gray-500">@{info.username}</p>
									<p className="mt-4 text-lg font-medium text-gray-700">{`Stage: ${info.stage.stage}`}</p>
								</div>
							)}
							<div className="mt-6 flex items-center justify-between px-4">
								<div className="flex cursor-pointer items-center text-gray-700 hover:text-gray-900">
									<FontAwesomeIcon icon={faMedal} className="mr-2" />
									<span className="font-medium">Achievements</span>
								</div>
								{!isEditing && (
									<div
										className="flex cursor-pointer items-center text-gray-700 hover:text-gray-900"
										onClick={handleEditClick}
									>
										<FontAwesomeIcon icon={faEdit} className="mr-2" />
										<span className="font-medium">Edit</span>
									</div>
								)}
							</div>
						</div>

						{/* الشاشة المتحركة */}
						<Swiper
							onSwiper={(swiper) => (swiperRef.current = swiper)}
							loop={true}
							spaceBetween={30}
							slidesPerView={1}
							autoplay={{ delay: 3000 }}
							navigation
							modules={[Autoplay, Navigation]}
							className="w-full rounded-lg shadow-sm"
						>
							<SwiperSlide>
								<div className="p-6 text-center">
									<h2 className="text-xl font-bold text-gray-700">
										Learn With AI
									</h2>
									<p className="mt-2 text-gray-600">
										Improve your knowledge in SQL.
									</p>
									<button className="mt-4 rounded bg-gray-700 px-6 py-2 text-white shadow-sm transition duration-300 hover:bg-gray-800">
										Chat!
									</button>
								</div>
							</SwiperSlide>
						</Swiper>
					</div>

					{/* القسم الأيمن */}
					<div
						className="mt-10 w-full md:w-1/2"
						style={{ background: "#f1f5f9" }}
					>
						<div
							className="rounded-lg p-6 shadow-sm"
							style={{ background: "#f9fafb" }}
						>
							<h2 className="mb-6 text-xl font-bold text-gray-700">
								Quizzes Overview
							</h2>
							<div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
								<table className="w-full border-collapse rounded-md text-left text-sm">
									<thead className="bg-gray-200">
										<tr>
											<th className="border px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">
												No.
											</th>
											<th className="border px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">
												Stage
											</th>
											<th className="border px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">
												Mark %
											</th>
											<th className="border px-6 py-4 text-center"></th>
										</tr>
									</thead>
									<tbody>
										{info.quizzes.map((quiz, index) => (
											<tr
												key={quiz.id}
												className="odd:bg-white even:bg-gray-100 hover:bg-gray-200"
											>
												<td className="border px-6 py-4 text-gray-700">
													{index + 1}
												</td>
												<td className="border px-6 py-4 text-gray-700">
													{info.stage.stage}
												</td>
												<td className="border px-6 py-4 text-gray-700">
													{quiz.mark!.toFixed(2)}%
												</td>
												<td className="border px-6 py-4 text-center">
													<button
														onClick={() => handleReviewClick(quiz.id)}
														className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white shadow-md transition duration-300 hover:bg-gray-800"
													>
														<FiEye className="text-sm" />
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
			</div>
		</div>
	);
}
