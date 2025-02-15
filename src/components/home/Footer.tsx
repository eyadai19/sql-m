import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";

export function Footer() {
	return (
		<footer className="mt-6 bg-gradient-to-b from-[#00203F] to-[#003B5C] shadow-xl dark:bg-[#00203F]">
			<div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
				<div className="sm:flex sm:items-center sm:justify-between">
					<a
						href="/"
						className="mb-4 flex items-center space-x-3 sm:mb-0 rtl:space-x-reverse"
					>
						<span className="self-center whitespace-nowrap text-2xl font-semibold text-[#ADF0D1]">
							<Image
								src="/LogoSizeTrue.png"
								alt="Logo"
								width={45}
								height={45}
							/>
						</span>
					</a>
					<ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-[#ADF0D1] sm:mb-0">
						<li>
							<a
								href="#about"
								className="me-4 transition-colors duration-300 ease-in-out hover:text-[#4db8b0] hover:underline md:me-6"
							>
								About
							</a>
						</li>
						<li>
							<a
								href="#try"
								className="me-4 transition-colors duration-300 ease-in-out hover:text-[#4db8b0] hover:underline md:me-6"
							>
								Let's Try
							</a>
						</li>
						<li>
							<a
								href="/login"
								className="transition-colors duration-300 ease-in-out hover:text-[#4db8b0] hover:underline"
							>
								Login
							</a>
						</li>
					</ul>
				</div>
				<hr className="my-6 border-[#ADF0D1] sm:mx-auto lg:my-8" />
				<div className="flex flex-col items-center space-y-4 lg:flex-row lg:justify-between lg:space-y-0">
					<span className="block text-sm text-[#ADF0D1] sm:text-center">
						© 2025{" "}
						<a href="/" className="hover:underline">
							SQL Mentor
						</a>
						. All Rights Reserved.
					</span>
					<div className="flex space-x-4">
						<a
							href="https://www.facebook.com/eyad.sy.7890"
							target="_blank"
							className="text-[#ADF0D1] transition-colors duration-300 hover:text-[#1877f2]"
						>
							<i className="fab fa-facebook-f"></i>
						</a>
						<a
							href="https://www.instagram.com/eyadd.18?igsh=dWFjYmViNm5qYW9x&utm_source=qr"
							target="_blank"
							className="text-[#ADF0D1] transition-colors duration-300 hover:text-[#e1306c]"
						>
							<i className="fab fa-instagram"></i>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
