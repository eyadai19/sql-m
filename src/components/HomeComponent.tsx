import Link from "next/link";

export function HomeComponent() {
  return (
    <div className="section bg-[#ADF0D1] py-8 px-4" id="home">
      <div className=" justify-evenly flex flex-col md:flex-row items-center md:space-x-6">
        
        {/* Text Content */}
        <div className="text-center md:text-left md:max-w-lg">
          <h2 className="font-bold text-xs text-teal-500 mb-2">Learn SQL Like Never Before</h2>
          <h1 className="text-[1.825rem] sm:text-[2.5rem] font-bold leading-tight">
            This is <br /> the new way <br /> to learn SQL
          </h1>
          <p className="text-sm leading-7 text-gray-700 max-w-md mt-4">
            Have you ever tried AI-supported learning?
          </p>
          
          {/* Buttons */}
          <div className="mt-6 flex justify-center md:justify-start space-x-4">
            <Link href="/register">
              <button className="px-6 py-3 font-bold rounded-lg text-sm bg-[#00203F] text-[#ADF0D1] hover:bg-[#004466] transition-colors">
                Get Started
              </button>
            </Link>
            <button className="px-6 py-3 font-bold border border-solid border-[#00203F] rounded-lg text-sm hover:bg-[#00203F] hover:text-[#ADF0D1] transition-colors">
              Discover
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-[50%] mt-8 md:mt-0">
          <img src={""} alt="Home Component" className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>

      </div>
    </div>
  );
}
