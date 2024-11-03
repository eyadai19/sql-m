import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-[#00203F] text-[#ADF0D1] py-6" id="Footer">
          <div className="max-w-screen-lg mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p className="mb-2">Email: contact@example.com</p>
            <p className="mb-2">Phone: (123) 456-7890</p>
            <p className="mb-4">Address: 123 Main St, Anytown, USA</p>
            
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
        </footer>
    );
}
