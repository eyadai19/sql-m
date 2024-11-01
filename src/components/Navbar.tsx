
import Link from "next/link";

export function Navbar() {
	return (
		<nav className="flex items-center justify-between p-4 bg-[#00203F] text-[#ADF0D1] shadow-md">
			{/* Logo */}
			<div className="text-2xl font-bold">
				<Link href="/">Brand</Link>
			</div>

			{/* Navigation Links */}
			<div className="flex space-x-6">
				<Link href="/about" className="hover:text-white transition-colors">
					About
				</Link>
				<Link href="/services" className="hover:text-white transition-colors">
					Services
				</Link>
				<Link href="/contact" className="hover:text-white transition-colors">
					Contact
				</Link>
				<Link href="/login" className="hover:text-white transition-colors">
					Login
				</Link>
			</div>
		</nav>
	);
}
