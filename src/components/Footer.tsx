import Link from "next/link";

import '@fortawesome/fontawesome-free/css/all.min.css';


export function Footer() {
    return (
        <footer className=" flex flex-col  lg:grid lg:grid-cols-2 text-center bg-[#00203F] text-[#ADF0D1] py-6" id="Footer">
        
       
              
                
                


            <div>
              <h2 className="text-xl font-bold mb-4 space-y-3">Contact Us</h2>
              <h6 className="text-[#00203F]">f</h6>
              <p className="mb-2">Email: sqlmentor@gmail.com</p>
              <p className="mb-2">Phone: 0999999999</p>
              <p className="mb-4">Address: 123 Main St, Damascus, Syria</p>
            </div>
      
            <div>
              <div className="flex flex-col items-center lg:items-center space-y-2">
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                <Link href="https://www.facebook.com" target="_blank" className="hover:text-blue-600 transition-colors flex items-center">
                  <i className="fab fa-facebook-f mr-2"></i> Facebook
                </Link>
                <Link href="https://www.twitter.com" target="_blank" className="hover:text-blue-400 transition-colors flex items-center">
                  <i className="fab fa-twitter mr-2"></i> Twitter
                </Link>
                <Link href="https://www.instagram.com" target="_blank" className="hover:text-pink-500 transition-colors flex items-center">
                  <i className="fab fa-instagram mr-2"></i> Instagram
                </Link>
                <Link href="https://www.linkedin.com" target="_blank" className="hover:text-blue-700 transition-colors flex items-center">
                  <i className="fab fa-linkedin-in mr-2"></i> LinkedIn
                </Link>
              </div>
            </div>
      
    
        
      </footer>
      
    );
}
