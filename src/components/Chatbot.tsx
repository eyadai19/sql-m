"use client";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineClose, AiOutlineArrowLeft, AiOutlineReload } from "react-icons/ai";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [inChatMode, setInChatMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [questionData, setQuestionData] = useState<any>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string>("");
  const [compiledData, setCompiledData] = useState<any[]>([]); 


  const chatEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (selectedLanguage: React.SetStateAction<string>) => {
    setLanguage(selectedLanguage);
  };

  const handleOptionSelect = (option: string) => {
    if (option === "Syntax") {
      setInChatMode(true);
      setIsFirstQuestion(true);
    }
  };

  const goBack = () => {
    if (inChatMode) {
      setInChatMode(false);
      setUserAnswer("");
      setFinalAnswer(""); // إعادة تعيين الإجابة النهائية
    } else {
      setLanguage("");
    }
  };

  const fetchInitialQuestion = () => {
    setQuestionData({
      question: "Welcome to the chat! What would you like to start with?",
      options: ["Introduction", "Tutorial", "FAQ"],
    });
  };

  const fetchTestQuestion = () => {
    const questions = [
      { question: "Please choose an action:", options: ["select", "update", "delete"],finalAnswer:"" },
      { question: "What would you like to do?", options: ["add", "edit", "remove"],finalAnswer:"gg"  },
      { question: "test", options: ["1", "2", "3"],finalAnswer:""  },
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setQuestionData({
      question: randomQuestion.question,
      options: randomQuestion.options,
      finalAnswer: setFinalAnswer(randomQuestion.finalAnswer),
    });
  };

  useEffect(() => {
    if (inChatMode && isFirstQuestion) {
      fetchInitialQuestion();
      setIsFirstQuestion(false);
    }
  }, [inChatMode, isFirstQuestion]);

  const handleButtonClick = (option: string) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { question: questionData.question, answer: option },
    ]);

    setUserAnswer(option);
    setQuestionData(null);

    fetchTestQuestion();
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const resetChat = () => {
    setChatHistory([]);
    setUserAnswer("");
    setQuestionData(null);
    setIsFirstQuestion(true);
    setFinalAnswer(""); 
    fetchInitialQuestion();
  };



  const handleCompile = () => {
    // إنشاء بيانات الجدول عند الضغط على الزر
    const data = [
      { id: 1, name: "John Doe", age: 28, action: "selected option 1" },
      { id: 2, name: "Jane Smith", age: 34, action: "selected option 2" },
      { id: 3, name: "Sam Brown", age: 22, action: "selected option 3" },
    ];

    setCompiledData(data); // تعيين البيانات في حالة compiledData
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end">
      <div
        className={`bg-[#00203F] text-white w-80 h-[80vh] p-4 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
          } rounded-t-lg shadow-lg mb-2 flex flex-col justify-between overflow-y-auto custom-scrollbar`}
      >
        {/* الشريط العلوي الثابت في أعلى الشات تمامًا */}
        <div className="sticky top-0 bg-[#00203F] z-10 p-2 flex justify-between items-center">
          {language && (
            <button onClick={goBack} className="text-[#ADF0D1] focus:outline-none">
              <AiOutlineArrowLeft />
            </button>
          )}

          <h2 className="text-lg font-semibold flex-1 text-center">Mentor</h2>

          <button onClick={toggleChat} className="text-[#ADF0D1] focus:outline-none">
            <AiOutlineClose />
          </button>
        </div>

        {/* محتوى الشات */}
        <div className="flex-1 overflow-y-auto mt-2">
          {!language && !inChatMode && (
            <div className="flex flex-col justify-center items-center h-full">
              <h3 className="text-md font-semibold text-center mb-4">Choose Language</h3>

              <div className="flex flex-col space-y-4">
                <button onClick={() => handleLanguageSelect("AR")} className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold">
                  العربية (AR)
                </button>
                <button onClick={() => handleLanguageSelect("EN")} className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold">
                  English (EN)
                </button>
              </div>
            </div>
          )}

          {language && !inChatMode && (
            <div className="flex flex-col justify-center items-center h-full">
              <h3 className="text-md font-semibold text-center mt-4 mb-4">
                {language === "AR" ? "اختر الخدمة" : "Choose Service"}
              </h3>

              <div className="flex flex-col space-y-4">
                <button onClick={() => handleOptionSelect("Syntax")} className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold">
                  {language === "AR" ? "بناء الجملة" : "Syntax"}
                </button>
                <button onClick={() => handleOptionSelect("Query")} className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold">
                  {language === "AR" ? "الاستعلام" : "Query"}
                </button>
              </div>
            </div>
          )}

          {inChatMode && questionData && (
            <>
              <div className="mb-4">
                {chatHistory.map((entry, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-start">
                      <p className="bg-[#D3D3D3] text-[#00203F] p-2 rounded-md inline-block max-w-xs">{entry.question}</p>
                    </div>
                    <div className="flex justify-end mt-1">
                      <p className="bg-[#ADF0D1] text-[#00203F] p-2 rounded-md inline-block max-w-xs">{entry.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex justify-center">
                <p className="text-sm mt-2">{questionData?.question}</p>
              </div>

              {finalAnswer === "" ? (
                <div className="mb-4 flex justify-center">
                  <div className="flex flex-col space-y-4 items-center">
                    {questionData?.options.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => handleButtonClick(option)}
                        className="w-40 p-2 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold text-center"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mt-4">
                  <p className="bg-[#D3D3D3] text-[#00203F] p-2 rounded-md w-3/4 text-center mt-4">
                    {finalAnswer}
                  </p>
                  <button
                    onClick={handleCompile}
                    className="w-40 p-2 mt-4 rounded-md bg-[#ADF0D1] text-[#00203F] font-semibold"
                  >
                    Compile
                  </button>
                </div>
              )}
            </>
          )}



{compiledData.length > 0 && (
            <div className="mt-4">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Age</th>
                    <th className="border p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {compiledData.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-2">{row.id}</td>
                      <td className="border p-2">{row.name}</td>
                      <td className="border p-2">{row.age}</td>
                      <td className="border p-2">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}



          {/* زر مسح المحادثة داخل مربع الـ ChatBot */}
          {inChatMode && (
            <button
              onClick={resetChat}
              className="absolute bottom-4 left-4 bg-[#ADF0D1] text-[#00203F] p-2 rounded-full"
            >
              <AiOutlineReload />
            </button>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <button
        onClick={toggleChat}
        className={`bg-[#ADF0D1] text-[#00203F] p-3 rounded-full focus:outline-none transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
      >
        {isOpen ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
      </button>
    </div>
  );
}
