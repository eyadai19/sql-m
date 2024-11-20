"use client";
import router from "next/router";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";


export function Card() {

    const router = useRouter();


  // State for SELECT
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  function handleChange(e: { target: { value: any } }) {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().toLowerCase() === "select") {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }

  // State for DELETE
  const [userInput, setUserInput] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  function handleInputChange(event: { target: { value: any } }) {
    const inputValue = event.target.value;
    setUserInput(inputValue);

    if (inputValue.trim().toLowerCase() === "delete") {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
  }

  // State for INSERT
  const [insertInput, setInsertInput] = useState("");
  const [isInsertCorrect, setIsInsertCorrect] = useState(false);

  function handleInsertChange(event: { target: { value: any } }) {
    const inputValue = event.target.value;
    setInsertInput(inputValue);

    if (inputValue.trim().toLowerCase() === "insert") {
      setIsInsertCorrect(true);
    } else {
      setIsInsertCorrect(false);
    }
  }

  // State for UPDATE
  const [updateInput, setUpdateInput] = useState("");
  const [isUpdateCorrect, setIsUpdateCorrect] = useState(false);

  function handleUpdateChange(event: { target: { value: any } }) {
    const inputValue = event.target.value;
    setUpdateInput(inputValue);

    if (inputValue.trim().toLowerCase() === "update") {
      setIsUpdateCorrect(true);
    } else {
      setIsUpdateCorrect(false);
    }
  }

  return (
    <><div className="absolute top-4 right-4">
          <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 bg-[#ADF0D1] text-[#00203F] rounded-full shadow-md hover:bg-[#00203F] hover:text-[#ADF0D1] transition duration-300"
              title="Go Back"
          >
              <FaArrowRight className="text-xl" />
          </button>
      </div><div className=" justify-evenly bg-[#00203F] flex flex-col md:flex-row p-6 space-y-6 md:space-y-6 flex-wrap">
              {/* SELECT Challenge Card */}
              <div className="max-w-lg p-6 bg-[#19345E] text-white rounded-lg shadow-lg border border-gray-300 m-4 min-h-[250px]">
                  <h2 className="text-2xl font-bold mb-4">Challenge</h2>
                  <div className="bg-[#1A1A1A] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Get Data</h3>
                      <p className="mb-4">
                          Insert the missing statement to get all the columns from the{" "}
                          <span className="text-[#D4E8F2]">Customers</span> table.
                      </p>
                      <div className="bg-gray-200 text-gray-900 p-4 rounded-md font-mono">
                          <code>
                              <input
                                  type="text"
                                  value={inputValue}
                                  onChange={handleChange}
                                  placeholder="..."
                                  className={`bg-white rounded-md p-1 px-1 mr-1 ${isCorrect ? "bg-green-200" : "bg-red-200"}`} />
                              * FROM Customers;
                          </code>
                      </div>
                      {isCorrect ? (
                          <p className="text-green-400 mt-2 font-semibold">Correct!</p>
                      ) : (
                          inputValue && <p className="text-red-400 mt-2 font-semibold">Keep trying!</p>
                      )}
                  </div>
              </div>

              {/* DELETE Challenge Card */}
              <div className=" max-w-lg p-6 bg-[#19345E] text-white rounded-lg shadow-lg border border-gray-300 m-8 min-h-[250px]">
                  <h2 className="text-2xl font-bold mb-4">Challenge</h2>
                  <div className="bg-[#1A1A1A] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Delete Data</h3>
                      <p className="mb-4">
                          Insert the missing statement to delete all rows in the{" "}
                          <span className="text-[#D4E8F2]">students</span> table, without deleting the table.
                      </p>
                      <div className="bg-gray-200 text-gray-900 p-4 rounded-md font-mono">
                          <code>
                              <input
                                  type="text"
                                  value={userInput}
                                  onChange={handleInputChange}
                                  placeholder="..."
                                  className={`bg-white rounded-md p-1 px-1 mr-1 ${isAnswerCorrect ? "bg-green-200" : "bg-red-200"}`} />
                              FROM students;
                          </code>
                      </div>
                      {isAnswerCorrect ? (
                          <p className="text-green-400 mt-2 font-semibold">Correct!</p>
                      ) : (
                          userInput && <p className="text-red-400 mt-2 font-semibold">Keep trying!</p>
                      )}
                  </div>
              </div>

              {/* INSERT Challenge Card */}
              <div className="max-w-lg p-6 bg-[#19345E] text-white rounded-lg shadow-lg border border-gray-300 m-4 min-h-[0px]">
                  <h2 className="text-2xl font-bold mb-4">Challenge</h2>
                  <div className="bg-[#1A1A1A] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Insert Data</h3>
                      <p className="mb-4">
                          Insert the missing statement to add a new record to the{" "}
                          <span className="text-[#D4E8F2]">employees</span> table.
                      </p>
                      <div className="bg-gray-200 text-gray-900 p-4 rounded-md font-mono">
                          <code>
                              <input
                                  type="text"
                                  value={insertInput}
                                  onChange={handleInsertChange}
                                  placeholder="..."
                                  className={`bg-white rounded-md p-1 px-1 mr-1 ${isInsertCorrect ? "bg-green-200" : "bg-red-200"}`} />
                              INTO employees VALUES (2,ahmad,30000);
                          </code>
                      </div>
                      {isInsertCorrect ? (
                          <p className="text-green-400 mt-2 font-semibold">Correct!</p>
                      ) : (
                          insertInput && <p className="text-red-400 mt-2 font-semibold">Keep trying!</p>
                      )}
                  </div>
              </div>

              {/* UPDATE Challenge Card */}
              <div className="max-w-lg p-6 bg-[#19345E] text-white rounded-lg shadow-lg border border-gray-300 m-4 min-h-[250px]">
                  <h2 className="text-2xl font-bold mb-4">Challenge</h2>
                  <div className="bg-[#1A1A1A] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Update Data</h3>
                      <p className="mb-4">
                          Insert the missing statement to modify the salary of employees in the{" "}
                          <span className="text-[#D4E8F2]">employees</span> table.
                      </p>
                      <div className="bg-gray-200 text-gray-900 p-4 rounded-md font-mono">
                          <code>
                              <input
                                  type="text"
                                  value={updateInput}
                                  onChange={handleUpdateChange}
                                  placeholder="..."
                                  className={`bg-white rounded-md p-1 px-1 mr-1 ${isUpdateCorrect ? "bg-green-200" : "bg-red-200"}`} />
                              employees SET salary = 40000 WHERE id=2;
                          </code>
                      </div>
                      {isUpdateCorrect ? (
                          <p className="text-green-400 mt-2 font-semibold">Correct!</p>
                      ) : (
                          updateInput && <p className="text-red-400 mt-2 font-semibold">Keep trying!</p>
                      )}
                  </div>
              </div>
          </div></>
  );
}
