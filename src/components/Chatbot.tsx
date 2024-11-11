"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(""); // لتخزين اللغة المختارة
  const [inChatMode, setInChatMode] = useState(false); // لتحديد إذا تم الدخول إلى وضع المحادثة
  const [userAnswer, setUserAnswer] = useState(""); // لتخزين الإجابة المختارة من المستخدم
  const [finalAnswer, setFinalAnswer] = useState(""); // لتخزين الإجابة النهائية من API
  const [questionData, setQuestionData] = useState<any>(null); // لتخزين السؤال والخيارات

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (selectedLanguage: React.SetStateAction<string>) => {
    setLanguage(selectedLanguage); // تخزين اللغة المختارة
  };

  const handleOptionSelect = (option: string) => {
    if (option === "Syntax") {
      setInChatMode(true); // الدخول إلى وضع المحادثة عند اختيار Syntax
    }
  };

  const goBack = () => {
    if (inChatMode) {
      setInChatMode(false); // الخروج من وضع المحادثة إذا كان المستخدم فيه
      setUserAnswer(""); // إعادة تعيين الإجابة المختارة من المستخدم
      setFinalAnswer(""); // إعادة تعيين الإجابة النهائية
    } else {
      setLanguage(""); // للرجوع لاختيار اللغة إذا لم يكن في وضع المحادثة
    }
  };

  // دالة لمحاكاة جلب البيانات من API مع تبديل عشوائي بين السؤالين
  const fetchTestQuestion = () => {
    // محاكاة التأخير في جلب البيانات من API
    setTimeout(() => {
      const questions = [
        { question: "Please choose an action:", options: ["select", "update", "delete"] },
        { question: "What would you like to do?", options: ["add", "edit", "remove"] },
        { question: "test", options: ["1", "2", "3"] }
      ];

      // اختيار سؤال عشوائي
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setQuestionData({
        question: randomQuestion.question,
        options: randomQuestion.options,
        finalAnswer: "", // الإجابة النهائية تبدأ فارغة
      });
    }, 1000); // التأخير لمدة ثانية لمحاكاة جلب البيانات
  };

  // استدعاء التابع عند الدخول إلى وضع المحادثة أو عند تغيير الإجابة
  useEffect(() => {
    if (inChatMode && !finalAnswer) {
      fetchTestQuestion(); // جلب السؤال والخيارات
    }
  }, [inChatMode, !finalAnswer]); // التابع يستدعي كلما دخلنا إلى وضع المحادثة أو تم تحديد الإجابة النهائية

  // التعامل مع اختيار المستخدم من الأزرار
  const handleButtonClick = (option: string) => {
    setUserAnswer(option); // تخزين الخيار المحدد من الأزرار
    setQuestionData(null); // تنظيف الشاشة من كل العناصر بعد اختيار المستخدم
    fetchTestQuestion();

  };

  // استدعاء التابع مرة أخرى عند اختيار المستخدم إجابة جديدة
  useEffect(() => {
    if (userAnswer) {
    }
  }, [userAnswer]); // استدعاء التابع عندما يتغير اختيار المستخدم

 




  
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end">
      {/* حاوية الشات بوت */}
      <div
        className={`bg-[#00203F] text-white w-80 h-[80vh] p-4 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
        } rounded-t-lg shadow-lg mb-2 flex flex-col justify-between overflow-y-auto`}
        style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" }}
      >
        {/* عنوان الشات بوت مع زر الإغلاق والتراجع */}
        <div className="flex justify-between items-center mb-4">
          {/* زر الرجوع */}
          <button
            onClick={goBack}
            className="text-[#ADF0D1] focus:outline-none"
          >
            <AiOutlineArrowLeft /> {/* زر السهم للتراجع */}
          </button>

          {/* عنوان الشات بوت */}
          <h2 className="text-lg font-semibold flex-1 text-center">Mentor</h2>

          {/* زر الإغلاق */}
          <button
            onClick={toggleChat}
            className="text-[#ADF0D1] focus:outline-none"
          >
            <AiOutlineClose /> {/* زر الإغلاق بشكل X */}
          </button>
        </div>

        {/* عرض سؤال اللغة إذا لم يتم اختيار اللغة */}
        {!language && !inChatMode && (
          <div className="flex flex-col justify-center items-center h-full">
            {/* عنوان اختيار اللغة */}
            <h3 className="text-md font-semibold text-center mb-4">Choose Language</h3>

            {/* خيارات اللغة */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleLanguageSelect("AR")}
                className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold"
              >
                العربية (AR)
              </button>
              <button
                onClick={() => handleLanguageSelect("EN")}
                className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold"
              >
                English (EN)
              </button>
            </div>
          </div>
        )}

        {/* عرض سؤال "اختر الخدمة" إذا تم اختيار اللغة */}
        {language && !inChatMode && (
          <div className="flex flex-col justify-center items-center h-full">
            {/* عنوان "اختر الخدمة" أو "Choose Service" بناءً على اللغة المختارة */}
            <h3 className="text-md font-semibold text-center mt-4 mb-4">
              {language === "AR" ? "اختر الخدمة" : "Choose Service"}
            </h3>

            {/* خيارات الخدمة */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleOptionSelect("Syntax")}
                className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold"
              >
                {language === "AR" ? "بناء الجملة" : "Syntax"}
              </button>
              <button
                onClick={() => handleOptionSelect("Query")}
                className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold"
              >
                {language === "AR" ? "الاستعلام" : "Query"}
              </button>
            </div>
          </div>
        )}

        {/* صفحة المحادثة (إذا تم اختيار Syntax) */}
        {inChatMode && questionData && !finalAnswer && (
          <>
            {/* طباعة السؤال التجريبي أولاً */}
            <div className="mb-4">
              <p className="text-sm mt-2">{questionData?.question}</p> {/* عرض السؤال من التابع */}
            </div>

            {/* طباعة الأزرار كرسائل */}
            <div className="mb-4">
              <div className="flex flex-col space-y-4">
                {questionData?.options.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => handleButtonClick(option)}
                    className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* عرض اختيار المستخدم بعد الإجابة */}
        {userAnswer && (
          <div className="mt-4">
            <p className="text-sm text-[#ADF0D1]">You selected: {userAnswer}</p>
          </div>
        )}
      </div>

      {/* زر السهم لفتح وإغلاق الشات بوت */}
      <button
        onClick={toggleChat}
        className={`bg-[#ADF0D1] text-[#00203F] p-3 rounded-full focus:outline-none transition-all duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        {isOpen ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
      </button>
    </div>
  );
}
