export function AboutComponent() {
  return (
    <div className="section  py-12 px-4" id="about">
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-screen-lg mx-auto">
      <div className=" items-center border-[3px] rounded-lg border-solid border-[#00203F]">
  <img src="../image/HomeImages/AboutComponent.jpg" alt="About" className=" p-4" />
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
