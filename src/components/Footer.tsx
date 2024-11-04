import Link from "next/link";

export function Footer() {
    return (
        <footer className=" items-center  bg-[#00203F] text-[#ADF0D1] py-6" id="Footer">
            <div className="max-w-screen-lg mx-auto px-4">
                <h2 className="text-xl font-bold mb-4">Contact Us</h2>
                <div className=" justify-evenly grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
             
                    <div>
                        <p className="mb-2">Email: sqlmentor@gmail.com</p>
                        <p className="mb-2">Phone: 0999999999</p>
                        <p className="mb-4">Address: 123 Main St, damascus, Syria</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                        <div className="flex space-x-4">
                            <Link href="https://www.facebook.com" target="_blank" className="hover:text-white transition-colors">
                                Facebook
                            </Link>
                            <Link href="https://www.twitter.com" target="_blank" className="hover:text-white transition-colors">
                                Twitter
                            </Link>
                            <Link href="https://www.instagram.com" target="_blank" className="hover:text-white transition-colors">
                                Instagram
                            </Link>
                            <Link href="https://www.linkedin.com" target="_blank" className="hover:text-white transition-colors">
                                LinkedIn
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
