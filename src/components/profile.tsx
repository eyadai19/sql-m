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
}: {
	ProfileAction: () => Promise<
		ProfileData | { field: string; message: string } | undefined
	>;
}) {
	const [info, setInfo] = useState<ProfileData | null>(null);
	const [error, setError] = useState<string | null>(null);
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
				setInfo(result as ProfileData);
			}
		};
		fetchProfileData();
	}, [ProfileAction]);

	const handleReviewClick = (quizId: string) => {
		router.push(`/QuizDetalis/${quizId}`);
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
				background:
					"linear-gradient(to bottom right, rgba(173, 240, 209, 0.5), rgba(0, 32, 63, 0.5))",
			}}
		>
			<div
				className="m-8 w-full max-w-6xl rounded-lg p-12 shadow-lg"
				style={{
					background: "linear-gradient(to right, #fafafa, #efefef)",
				}}
			>
				<div className="flex flex-col items-start gap-12 md:flex-row">
					{/* القسم الأيسر */}
					<div className="flex w-full flex-col gap-8 md:w-1/2">
						{/* بطاقة المعلومات الشخصية */}
						<div
							className="relative rounded-lg bg-white p-6 shadow-lg"
							style={{
								width: "100%",
								background:
									"linear-gradient(to bottom right, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
							}}
						>
							<div className="-mt-16 flex justify-center">
								<div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#ADF0D1] bg-gray-200">
									<span className="flex h-full items-center justify-center text-gray-500">
										{info.photo ? (
											<img
												src={`data:image/jpeg;base64,${Buffer.from(info.photo).toString("base64")}`}
												alt="User Profile"
												className="h-full w-full object-cover"
											/>
										) : (
											<span className="flex h-full items-center justify-center text-gray-500">
												No Image
											</span>
										)}
									</span>
								</div>
							</div>
							<div className="mt-8 text-center">
								<h1 className="text-2xl font-bold text-[#00203F]">{`${info.firstName} ${info.lastName}`}</h1>
								<p className="text-sm text-gray-500">@{info.username}</p>
								<p className="mt-4 text-lg font-medium text-[#00203F]">{`Stage: ${info.stage.stage}`}</p>
							</div>
							<div className="mt-6 flex items-center justify-between px-4">
								<div className="flex cursor-pointer items-center text-[#00203F] hover:text-[#ADF0D1]">
									<FontAwesomeIcon icon={faMedal} className="mr-2" />
									<span className="font-medium">Achievements</span>
								</div>
								<div className="flex cursor-pointer items-center text-[#00203F] hover:text-[#ADF0D1]">
									<FontAwesomeIcon icon={faEdit} className="mr-2" />
									<span className="font-medium">Edit</span>
								</div>
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
							className="w-full rounded-lg bg-white shadow-lg"
						>
							<SwiperSlide>
								<div
									className="p-6 text-center"
									style={{
										background:
											"linear-gradient(to bottom right, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
										borderRadius: "10px",
									}}
								>
									<h2 className="text-2xl font-bold text-[#00203F]">
										Learn With AI
									</h2>
									<p className="mt-2 text-gray-500">
										Improve your knowledge in SQL.
									</p>
									<button className="mt-4 rounded-full bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow-md transition duration-300 hover:bg-[#00203F] hover:text-[#ADF0D1]">
										Chat!
									</button>
								</div>
							</SwiperSlide>
							{/* المزيد من الشرائح */}
						</Swiper>
					</div>

					{/* القسم الأيمن */}
					<div className="mt-10 w-full items-center md:w-1/2">
						<div
							className="rounded-lg p-6 text-center shadow-lg"
							style={{
								background:
									"linear-gradient(to bottom right, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
							}}
						>
							<h2 className="mb-6 text-2xl font-bold text-white">
								Quizez Overview
							</h2>
							<div
								className="overflow-y-auto"
								style={{
									maxHeight: "300px",
									scrollbarWidth: "none",
								}}
							>
								<style>
									{`
                    ::-webkit-scrollbar {
                      display: none;
                    }
                  `}
								</style>
								<table className="w-full border-collapse rounded-md border border-gray-300 text-left text-sm text-[#00203F]">
									<thead className="bg-gradient-to-r from-[#00476B] via-[#17354D] to-[#00203F] text-white">
										<tr>
											<th className="border px-6 py-4 text-left text-sm uppercase tracking-wider">
												NO.
											</th>
											<th className="border px-6 py-4 text-left text-sm uppercase tracking-wider">
												Stage
											</th>
											<th className="border px-6 py-4 text-left text-sm uppercase tracking-wider">
												Mark %
											</th>
											<th className="border px-6 py-4 text-center"></th>
										</tr>
									</thead>
									<tbody>
										{info.quizzes.map((quiz, index) => (
											<tr
												key={quiz.id}
												className="odd:bg-[#f5f5f5] hover:bg-gray-300"
											>
												<td className="border px-6 py-4">{index + 1}</td>
												<td className="border px-6 py-4">{info.stage.stage}</td>
												<td className="border px-6 py-4">{quiz.mark}%</td>
												<td className="border px-6 py-4 text-center">
													<button
														onClick={() => {
															handleReviewClick(quiz.id);
														}}
														className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#00203F] shadow-md transition duration-300 hover:bg-[#00203F] hover:text-[#ADF0D1]"
														title="Review Answer"
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
