"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoArrowBackOutline, IoArrowForward } from "react-icons/io5"; // استيراد أيقونة السهم

// مكون الصفحة
const QuizDetails = ({ stage_id }: { stage_id: string }) => {
  const [quizData, setQuizData] = useState<any[]>([]);
  const router = useRouter();

  // دالة لجلب البيانات بناءً على stage_id
  const fetchQuizData = async (id: string) => {
    // مثال بيانات افتراضية
    const mockData = [
      { question: "What is SQL?", answer: "A query language", accuracy: 95 },
      { question: "What does SELECT do?", answer: "Fetch data", accuracy: 87 },
      { question: "What is a primary key?", answer: "Unique identifier", accuracy: 78 },
      { question: "What does DELETE do?", answer: "Removes data", accuracy: 85 },
      { question: "What is a table?", answer: "Data structure", accuracy: 90 },
      { question: "What is UPDATE used for?", answer: "Modify records", accuracy: 88 },
      { question: "What does FROM specify?", answer: "Source table", accuracy: 93 },
      { question: "What is an index?", answer: "Optimize searches", accuracy: 80 },
      { question: "What is a JOIN?", answer: "Combine tables", accuracy: 86 },
      { question: "What does INSERT do?", answer: "Add data", accuracy: 89 },
    ];
    setQuizData(mockData); // هنا يمكن استبدالها باستدعاء API فعلي
  };

  useEffect(() => {
    if (!stage_id) {
      router.push("/error"); // توجيه في حال عدم وجود stage_id
    } else {
      fetchQuizData(stage_id);
    }
  }, [stage_id]);

  return (
    <div
      className="min-h-screen text-[#00203F] p-6"
      style={{
        background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
      }}
    >
      {/* زر الرجوع */}
      <div className="absolute top-4 right-4">
        <button
          className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition duration-300"
          onClick={() => router.back()}
          title="Go back"
        >
          <IoArrowForward className="text-2xl text-[#00203F]" />
        </button>
      </div>

      {/* عنوان الصفحة */}
      <h1 className="text-3xl font-bold text-center text-white mb-6">Quiz Results</h1>

      {/* صندوق عرض الأسئلة */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {quizData.map((item, index) => (
          <div
            key={index}
            className="p-4 mb-4 border-b last:border-b-0 border-gray-200 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">
                Q{index + 1}: {item.question}
              </h2>
              <p className="text-gray-600">Answer: {item.answer}</p>
            </div>
            <div
              className="text-lg font-bold rounded-full px-4 py-2"
              style={{
                backgroundColor: item.accuracy > 85 ? "#ADF0D1" : "#FFC2C2",
                color: "#00203F",
              }}
            >
              {item.accuracy}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDetails;
