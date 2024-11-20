"use client";
import { faMedal, faAward, faTrophy } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules"; // Autoplay و Navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FiEdit, FiEye } from "react-icons/fi";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";



const stages = [
  { id: 1, name: "Introduction to SQL", percentage: 85 },
  { id: 2, name: "Intermediate Queries", percentage: 70 },
  { id: 3, name: "Advanced Joins", percentage: 50 },
  { id: 4, name: "DDL Operations", percentage: 90 },
  { id: 5, name: "Triggers & Procedures", percentage: 60 },
  { id: 6, name: "functions", percentage: 40 },
  { id: 7, name: "JDBC", percentage: 95 },
];

const getMockProfileData = () => {
  return {
    id: "1",
    username: "a7mod23",
    firstname: "Ahmad",
    lastname: "Kitaz",
    password: "meaomeao",
    createdTime: new Date("2021-01-01T10:00:00Z"),
    lastUpdateTime: new Date(),
    stageId: "5",
    stage: {
      id: "5",
      stage: "DDL",
      index: 4,
    },
  };
};

const ProfilePage: React.FC = () => {

  const router = useRouter();


  
  const info = getMockProfileData();
  const swiperRef = useRef<any>(null);

  return (
    <div
      className="min-h-screen flex justify-center items-center px-8"
      style={{
        background: "linear-gradient(to bottom right, rgba(173, 240, 209, 0.5), rgba(0, 32, 63, 0.5))",
      }}
    >
      <div
        className="m-8 shadow-lg rounded-lg p-12 w-full max-w-6xl"
        style={{
          background: "linear-gradient(to right, #fafafa, #efefef)",
        }}
      >
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* القسم الأيسر */}
          <div className="flex flex-col w-full md:w-1/2 gap-8">
            {/* بطاقة المعلومات الشخصية */}
            <div
              className="bg-white shadow-lg rounded-lg p-6 relative"
              style={{
                width: "100%",
                background: "linear-gradient(to bottom right, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
              }}
            >
              <div className="flex justify-center -mt-16">
                <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-[#ADF0D1] overflow-hidden">
                  <span className="flex items-center justify-center h-full text-gray-500">Profile</span>
                </div>
              </div>
              <div className="text-center mt-8">
                <h1 className="text-2xl font-bold text-[#00203F]">{`${info.firstname} ${info.lastname}`}</h1>
                <p className="text-sm text-gray-500">@{info.username}</p>
                <p className="mt-4 text-lg font-medium text-[#00203F]">{`Stage: ${info.stage.stage}`}</p>
              </div>
              <div className="flex justify-between items-center mt-6 px-4">
                <div className="flex items-center text-[#00203F] hover:text-[#ADF0D1] cursor-pointer">
                  <FontAwesomeIcon icon={faMedal  } className="mr-2" />
                  <span className="font-medium">Achievements</span>
                </div>
                <div className="flex items-center text-[#00203F] hover:text-[#ADF0D1] cursor-pointer">
                  <FontAwesomeIcon icon={faEdit } className="mr-2" />
                  <span className="font-medium">Edit</span>
                </div>
              </div>
            </div>

            {/* الشاشة المتحركة */}
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              loop={true}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000 }}
              navigation // لتفعيل الأسهم
              modules={[Autoplay, Navigation]}
              className="rounded-lg shadow-lg bg-white w-full"
            >
              {/* الشريحة الأولى */}
              <SwiperSlide>
                <div
                  className="text-center p-6"
                  style={{
                    background: "linear-gradient(to bottom right, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
                    borderRadius: "10px",
                  }}
                >
                  <h2 className="text-2xl font-bold text-[#00203F]">Learn With AI</h2>
                  <p className="text-gray-500 mt-2">Improve your knowledge in SQL.</p>
                  <button className="mt-4 bg-[#ADF0D1] text-[#00203F] py-2 px-4 rounded-full shadow-md hover:bg-[#00203F] hover:text-[#ADF0D1] transition duration-300">
                    Chat!
                  </button>
                </div>
              </SwiperSlide>

              {/* الشريحة الثانية */}
              <SwiperSlide>
          <div
            className="text-center p-6"
            style={{
              background: "linear-gradient(to top left, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
              borderRadius: "10px",
            }}
          >
            <h2 className="text-2xl font-bold text-[#00203F]">Challenge Yourself</h2>
            <p className="text-gray-500 mt-2">Take challenges and track your progress.</p>
            <button
      onClick={() => router.push("/QuickChallenge")}
      className="mt-4 bg-[#ADF0D1] text-[#00203F] py-2 px-4 rounded-full shadow-md hover:bg-[#00203F] hover:text-[#ADF0D1] transition duration-300"
    >
      Start Challenge
    </button>
          </div>
        </SwiperSlide>
         
              {/* الشريحة الثالثة */}
              <SwiperSlide>
                <div
                  className="text-center p-6"
                  style={{
                    background: "linear-gradient(to top right, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
                    borderRadius: "10px",
                  }}
                >
                  <h2 className="text-2xl font-bold text-[#00203F]">Join the Community</h2>
                  <p className="text-gray-500 mt-2">Become a part of our growing community of coders!</p>
                  <button className="mt-4 bg-[#ADF0D1] text-[#00203F] py-2 px-4 rounded-full shadow-md hover:bg-[#00203F] hover:text-[#ADF0D1] transition duration-300">
                    Join Now
                  </button>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          

          {/* القسم الأيمن */}
          <div className="mt-10 items-center w-full md:w-1/2">
            <div
              className="p-6 rounded-lg shadow-lg text-center"
              style={{
                background: "linear-gradient(to bottom right, rgba(0, 32, 63, 0.5), rgba(173, 240, 209, 0.5))",
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Quizez Overview</h2>
              <div
                className="overflow-y-auto"
                style={{
                  maxHeight: "300px",
                  scrollbarWidth: "none", 
                }}
              >
                <style>
                  {`
                    ::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>
                <table className="w-full text-left text-[#00203F] text-sm border-collapse border border-gray-300 rounded-md">
                     <thead className="bg-gradient-to-r from-[#00476B] via-[#17354D] to-[#00203F] text-white">
                       <tr>
                         <th className="border px-6 py-4 text-left uppercase text-sm tracking-wider">NO.</th>
                         <th className="border px-6 py-4 text-left uppercase text-sm tracking-wider">Stage</th>
                         <th className="border px-6 py-4 text-left uppercase text-sm tracking-wider">Mark %</th>
                         <th className="border px-6 py-4 text-center"></th>
                       </tr>
                     </thead>
                     <tbody>
                       {stages.map((stage) => (
                         <tr key={stage.id} className="odd:bg-[#f5f5f5] hover:bg-gray-300">
                           <td className="border px-6 py-4">{stage.id}</td>
                           <td className="border px-6 py-4">{stage.name}</td>
                           <td className="border px-6 py-4">{stage.percentage}%</td>
                           <td className="border px-6 py-4 text-center">
                             <button
                               className="flex items-center justify-center w-8 h-8 text-[#00203F] bg-white rounded-full shadow-md hover:bg-[#00203F] hover:text-[#ADF0D1] transition duration-300"
                               title="Review Answer"
                             >
                               <FiEye className="text-sm" />
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
