"use client";
import { Post } from "@/app/Community/page";
import { ProfileData } from "@/lib/types/authSchemas";
import { UploadButton } from "@/utils/uploadthing";
import { faEdit, faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Confetti from "react-confetti";

export default function ProfilePage({
	ProfileAction,
	UpdateProfileAction,
	userPostAction,
	editPostAction,
	deletePostAction,
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
}) {
	const [isSaving, setIsSaving] = useState(false);

	const [info, setInfo] = useState<ProfileData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newPhoto, setNewPhoto] = useState<string | null>(null);
	const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

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

		if (uploadedPhotoUrl) {
			updatedData.append("photo", uploadedPhotoUrl);
		}

		const result = await UpdateProfileAction(updatedData, uploadedPhotoUrl);
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
    // قائمة العبارات والأيقونات
    const stagesAchievements = [
      { message: "Welcome to the journey!", icon: "🎉" },
      { message: "Bronze Medal: Congrats on completing Stage 1!", icon: "🥉" },
      { message: "Silver Medal: Great job on Stage 2!", icon: "🥈" },
      { message: "Gold Medal: You conquered Stage 3!", icon: "🥇" },
      { message: "Platinum Medal: Outstanding achievement in Stage 4!", icon: "🏆" },
    ];
  
    // تحديد المراحل التي سيتم عرضها بناءً على المتغير
    const achievementsToShow = stagesAchievements
      .slice(0, maxStage + 1)
      .map((stage) => `${stage.icon} ${stage.message}`);
  
    // تحديث الحالة للعرض
    setAchievements(achievementsToShow);
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
						<div
							className="relative rounded-lg p-6 shadow-sm"
							style={{ background: "#f9fafb" }}
						>
							<div className="-mt-16 flex justify-center">
								<label
									htmlFor="photo"
									className={`relative cursor-pointer ${isEditing ? "" : "pointer-events-none"}`}
								>
									<div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-gray-300 bg-gray-200">
										{newPhoto ? (
											<img
												src={newPhoto}
												alt="New Profile"
												className="h-full w-full object-cover"
											/>
										) : info?.photo ? (
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
										{/* UploadButton - يغطي كامل الدائرة */}
										{isEditing && (
											<UploadButton
												endpoint="imageUploader"
												className={`absolute inset-0 h-full w-full cursor-pointer opacity-0`}
												onUploadProgress={() => {
													setIsSaving(true);
												}}
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
								<div className="mt-4 text-center">
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
											className="relative rounded bg-gray-700 px-6 py-2 text-white shadow-sm transition duration-300 hover:bg-gray-800"
										>
											{isSaving ? (
												<span className="absolute inset-0 flex cursor-wait items-center justify-center">
													<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
												</span>
											) : (
												<span>Save</span>
											)}
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
									<h1 className="text-2xl font-bold text-gray-800">
										{info.firstName} {info.lastName}
									</h1>
									<p className="text-sm text-gray-500">@{info.username}</p>
									<p className="mt-4 text-lg font-medium text-gray-700">
										Stage: {info.stage.stage}
									</p>
								</div>
							)}
							<div className="mt-6 flex items-center justify-between px-4">
								<div
									onClick={handleAchievementsClick}
									className="flex cursor-pointer items-center text-gray-700 hover:text-gray-900 md:justify-start md:text-sm lg:text-base"
								>
									<FontAwesomeIcon
										icon={faMedal}
										className="text-lg md:mr-2 md:text-sm"
									/>
									<span className="hidden font-medium md:block">
										Achievements
									</span>
								</div>
								{!isEditing && (
									<div
										className="flex cursor-pointer items-center text-gray-700 hover:text-gray-900 md:justify-start md:text-sm lg:text-base"
										onClick={handleEditClick}
									>
										<FontAwesomeIcon
											icon={faEdit}
											className="text-lg md:mr-2 md:text-sm"
										/>
										<span className="hidden font-medium md:block">Edit</span>
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
          {/* القسم الأيمن */}
          <div className="mt-10 w-full md:w-1/2" style={{ background: "#f1f5f9" }}>
  <div className="rounded-lg p-6 shadow-sm" style={{ background: "#f9fafb" }}>
    <h2 className="mb-6 text-xl font-bold text-gray-700">Quizzes Overview</h2>
    <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
      {/* عرض الجدول في الشاشات الكبيرة */}
      <div className="hidden md:block">
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
                <td className="border px-6 py-4 text-gray-700">{index + 1}</td>
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

      {/* عرض البطاقة في الشاشات الصغيرة */}
      <div className="block md:hidden">
        {info.quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className="mb-4 rounded-lg border bg-white p-4 shadow-md hover:bg-gray-50"
          >
            <div className="mb-2 flex justify-between text-gray-700">
              <span className="font-bold">No.:</span>
              <span>{index + 1}</span>
            </div>
            <div className="mb-2 flex justify-between text-gray-700">
              <span className="font-bold">Stage:</span>
              <span>{info.stage.stage}</span>
            </div>
            <div className="mb-4 flex justify-between text-gray-700">
              <span className="font-bold">Mark:</span>
              <span>{quiz.mark!.toFixed(2)}%</span>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => handleReviewClick(quiz.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white shadow-md transition duration-300 hover:bg-gray-800"
              >
                <FiEye className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
</div>

</div>



			{/* نافذة Achievements */}
			{showAchievementsModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-11/12 rounded-lg bg-white p-6 shadow-lg md:w-1/3">
						<h2 className="text-xl font-bold text-gray-700">Achievements</h2>
						<ul className="mt-4">
							{achievements.map((achievement, index) => (
								<li key={index} className="text-gray-600">
									{achievement}
								</li>
							))}
						</ul>
						<div className="mt-4 flex justify-end">
							<button
								onClick={closeAchievementsModal}
								className="rounded-lg bg-red-500 px-6 py-2 text-white"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
      {/* نافذة Achievements */}
      {showAchievementsModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    {/* تأثير الاحتفال */}
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={200}
      recycle={false}
    />
    {/* الشاشة المنبثقة */}
    <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 z-50">
      <h2 className="text-xl font-bold text-gray-700">Achievements</h2>
      <ul className="mt-4">
        {achievements.map((achievement, index) => (
          <li key={index} className="text-gray-600">
            {achievement}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <button
          onClick={closeAchievementsModal}
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
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
