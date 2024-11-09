"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import sqlQuestions from "../components/questions"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; 

export default function SqlQuiz() {
  const [answers, setAnswers] = useState(Array(sqlQuestions.length).fill(''));
  const [results, setResults] = useState(Array(sqlQuestions.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newResults = sqlQuestions.map((question, index) =>
      answers[index].trim().toLowerCase() === question.answer.trim().toLowerCase()
    );
    setResults(newResults);
    
    // Find incorrect questions
    const incorrectQuestions = sqlQuestions
      .map((question, index) => (results[index] === false ? index + 1 : null))
      .filter(index => index !== null);

    setIsSubmitted(true);
    setShowModal(true); // Show modal after submission
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleReviewAnswers = () => {
    setShowModal(false); 
  };

  const score = results.filter(result => result === true).length; 

  return (
    <div className="bg-[#00203F] py-10 relative">
      {/* Logo at the top right */}
      <div className="absolute top-4 right-4">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 text-[#ADF0D1]" />
      </div>

      <div className="container bg-white mx-auto px-4 max-w-3xl py-8 rounded-lg">
        <h1 className="text-3xl font-bold text-center text-[#00203F] mb-8">Quiz</h1>

        {sqlQuestions.map((question, index) => (
          <Card key={index} className="mb-4 border border-black shadow-lg rounded-lg">
            <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
              <CardTitle className="text-lg font-semibold text-gray-800">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-gray-100">
              <Input
                type="text"
                value={answers[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                placeholder="Type your answer here..."
                className="border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {results[index] !== null && (
                <p className={`mt-2 ${results[index] ? 'text-green-600' : 'text-red-600'}`}>
                  {results[index] ? (
                    'Correct!'
                  ) : (
                    <>
                      Incorrect. <br />
                      Correct answer: {question.answer}
                    </>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {!isSubmitted ? (
          <Button onClick={handleSubmit} className="mt-4 bg-[#00203F] text-white hover:bg-[#000000]">
            Submit Answers
          </Button>
        ) : (
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handleGoBack} className="bg-[#00203F] text-white hover:bg-[#000000]">
              Go Back
            </Button>
            {/* Display score next to Go Back button */}
            <p className="text-lg text-[#ADF0D1]">Your Score: {score} / {sqlQuestions.length}</p>
          </div>
        )}
      </div>

      {/* Modal for Results */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-[#00203F] mb-4">Your Score: {score} / {sqlQuestions.length}</h2>
            <div className="flex justify-between mt-6">
              <Button onClick={handleGoBack} className="bg-[#00203F] text-white hover:bg-[#000000]">
                Go Back
              </Button>
              <Button onClick={handleReviewAnswers} className="bg-[#00203F] text-white hover:bg-[#000000]">
                Review Answers
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
