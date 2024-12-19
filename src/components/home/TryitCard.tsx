"use client";
import React, { useState } from 'react';
import Link from "next/link";

export function TryitCard() {
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

  return (
    <div className=" flex flex-col md:flex-row justify-evenly p-6 space-y-6 md:space-y-0" id="try">
      {/* First Activity Card */}
      <div className="max-w-lg p-6 bg-[#00203F] text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Activity</h2>
        <div className="bg-black p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Get Data</h3>
          <p className="mb-4">
            Insert the missing statement to get all the columns from the <span className="text-[#ADF0D1]">Customers</span> table.
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
        <Link href="/login" className="mt-4 block text-[#ADF0D1] hover:underline">
          Start your journey!
        </Link>
      </div>
      
      {/* Second Activity Card */}
      <div className="max-w-lg p-6 bg-[#00203F] text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Activity</h2>
        <div className="bg-black p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Delete Data</h3>
          <p className="mb-4">
            Insert the missing statement to delete all rows in the <span className="text-[#ADF0D1]">students</span> table, without deleting the table.
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
        <Link href="/login" className="mt-4 block text-[#ADF0D1] hover:underline">
          Start your journey!
        </Link>
      </div>
    </div>
  );
}
