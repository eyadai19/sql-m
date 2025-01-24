import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";

export function Footer() {
	return (
		<footer className="mt-6 bg-[#00203F] shadow dark:bg-[#00203F]">
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
							<a href="#about" className="me-4 hover:underline md:me-6">
								About
							</a>
						</li>
						<li>
							<a href="#try" className="me-4 hover:underline md:me-6">
								Lets try
							</a>
						</li>
						<li>
							<a href="/login" className="hover:underline">
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
							Eyad Company
						</a>
						. All Rights Reserved.
					</span>
					<div className="flex space-x-4">
						<a
							href="https://www.facebook.com/eyad.sy.7890"
							target="_blank"
							className="text-[#ADF0D1] hover:text-blue-600"
						>
							<i className="fab fa-facebook-f"></i>
						</a>{" "}
						<a
							href="https://www.instagram.com/eyadd.18?igsh=dWFjYmViNm5qYW9x&utm_source=qr"
							target="_blank"
							className="text-[#ADF0D1] hover:text-pink-500"
						>
							<i className="fab fa-instagram"></i>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
