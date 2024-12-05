"use client";

import { useEffect, useState } from "react";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const InterviewPage = () => {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [userResponse, setUserResponse] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
        generateNextQuestion(transcript);
      };

      recognition.onerror = (event: Event) => {
        console.error("Speech recognition error:", event);
        alert("An error occurred with speech recognition. Please try again.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [recognition]);

  const generateNextQuestion = (response: string) => {
    // Example logic for generating the next question based on response
    const nextQuestion = `Based on your answer: "${response}", here is the next question.`;
    setQuestion(nextQuestion);
    setQuestionNumber((prev) => prev + 1);
  };

  const startListening = () => {
    if (!recognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Question */}
      <header className="text-center mb-6">
        <p className="text-lg text-gray-300">{questionNumber}/26</p>
        <h1 className="text-2xl font-semibold">{question}</h1>
      </header>

      {/* User Response */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-300">
          Your Answer: {userResponse || "Waiting for your response..."}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isListening ? (
          <button
            onClick={startListening}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Start Listening
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Stop Listening
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
