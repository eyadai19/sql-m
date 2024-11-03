
import Link from "next/link";

export function Navbar() {
	return (
		<nav className="flex items-center justify-between p-4 bg-[#00203F] text-[#ADF0D1] shadow-md">
			{/* Logo */}
			<div className="text-2xl font-bold">
				<Link href="/home">sqlmentor</Link>
			</div>

			{/* Navigation Links */}
			<div className="flex space-x-6">
			    <Link href="#about" className="hover:text-white transition-colors">
                  About
                </Link>
				<Link href="#try" className="hover:text-white transition-colors">
				Let's try
				</Link>
				<Link href="#Footer" className="hover:text-white transition-colors">
					Contact
				</Link>
				<Link href="/login" className="hover:text-white transition-colors">
					Login
				</Link>
			</div>
		</nav>
	);
}
