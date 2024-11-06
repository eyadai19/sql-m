export function AboutComponent() {
  return (
    <div className="section bg-[#ADF0D1] py-12 px-4" id="about">
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-screen-lg mx-auto">
        <div className="rounded-lg border border-solid border-teal-500 bg-gray-200 h-64 flex items-center justify-center text-gray-700 font-semibold">
         صورة
        </div>
        
        <div>
          <h2 className="font-bold text-[1.5rem] sm:text-[1.875rem] mb-5 leading-snug">
            SQL Mentor is your gateway to mastering SQL. <br /> We offer interactive exercises, real-world insights. <br />
            Start your journey with us and turn data into <span className="text-[#00203F] font-bold">your superpower!</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
