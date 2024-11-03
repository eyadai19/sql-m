

export function HomeComponent() {
	return (

<div className="section bg-[#ADF0D1]" id="home">
  <div className="md:flex items-center
   justify-center">
   <div>
    <div className="font-bold text-xs text-Teal 
    mb-4">
        </div>
    <div className="sm:text-[2.5rem] text-[1.825rem] font-bold">
      This is <br /> the new way <br /> to learn SQL
    </div>
    <p className="text-sm leading-7 text-gray max-w-sm">
      did yoy ever try AI supported learning ?
    </p>
    <div className="mt-6">
      <button className="px-6 py-3 font-bold rounded-lg mr-4 text-sm p-4 bg-[#00203F] text-[#ADF0D1]">
        Get Started
      </button>
      <button className="px-6 py-3 font-bold border border-solid border-gray rounded-lg text-sm">Discover</button>
    </div>
  </div>
  <div className="md:w-[60%] bg-black text-white text-center">
  <img src={""} alt="Home Component" className="w-full h-auto" />
</div>

</div>
</div>

        
    )}