export function AboutComponent() {
	return (
		<div className="section px-4 py-12" id="about">
			<div className="mx-auto grid max-w-screen-lg items-center gap-8 md:grid-cols-2">
				<div className="items-center rounded-lg border-[3px] border-solid border-[#00203F]">
					<img
						src="../image/HomeImages/AboutComponent.jpg"
						alt="About"
						className="p-4"
					/>
				</div>

				<div>
					<h2 className="mb-5 text-[1.5rem] font-bold leading-snug sm:text-[1.875rem]">
						SQL Mentor is your gateway to mastering SQL. <br /> We offer
						interactive exercises, real-world insights. <br />
						Start your journey with us and turn data into{" "}
						<span className="font-bold text-[#00203F]">your superpower!</span>
					</h2>
				</div>
			</div>
		</div>
	);
}
