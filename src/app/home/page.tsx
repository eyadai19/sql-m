// my-navbar-app/pages/_app.tsx
import type { AppProps } from 'next/app';
import { Navbar } from "@/components/Navbar";
import Home from '../page';

// my-navbar-app/pages/navbar-test.tsx

export default function NavbarTestPage() {
	return (
		<div className="h-screen bg-gray-100">
			<Navbar />
			<div className="p-8">
				<h1 className="text-4xl"> Test Page</h1>
				<p>.</p>
			</div>
		</div>
	);
}
