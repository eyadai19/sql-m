import Link from "next/link";

export function HomeComponent() {
  return (
    <div className="section  py-8 px-4" id="home">
      <div className=" justify-evenly flex flex-col md:flex-row items-center md:space-x-6">
        
        {/* Text Content */}
        <div className="text-center md:text-left md:max-w-lg">
          <h2 className="text-[#00203F] font-bold text-xs  mb-2">Learn SQL Like Never Before</h2>
          <h1 className="text-[1.825rem] sm:text-[2.5rem] font-bold leading-tight">
          Have you ever tried  <br /> <span className=" font-semibold text-[#ADF0D1]"> AI-supported </span> <br /> learning?
          </h1>
          <p className="text-sm leading-7 text-gray-700 max-w-md mt-4">
          This is the new way to learn SQL
          </p>
          
          {/* Buttons */}
          <div className="mt-6 flex justify-center md:justify-start space-x-4">
            <Link href="/register">
              <button className="px-6 py-3 font-bold rounded-lg text-sm bg-[#00203F] text-[#ADF0D1] hover:bg-[#004466] transition-colors">
                Get Started
              </button>
            </Link>
            <button className="px-6 py-3 font-bold border border-solid border-[#00203F] rounded-lg text-sm hover:bg-[#00203F] hover:text-[#ADF0D1] transition-colors">
            <Link href="#try" className="hover:text-white transition-colors">
          Discover
        </Link>
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-[50%] mt-8 md:mt-0">
          <img src={"../image/HomeImages/HomeComponent.jpg"} alt="Home Component" className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>

      </div>
    </div>
  );
}
