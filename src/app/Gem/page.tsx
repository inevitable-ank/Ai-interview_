"use client";

import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = "AIzaSyChShQMyTYrZcJctMk_lAth6ggt0oyGtyg";

const InterviewPage = () => {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [userResponse, setUserResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
        sendToGemini(transcript);
      };

      recognition.onerror = (event: Event) => {
        console.error("Speech recognition error:", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [recognition]);

  const sendToGemini = async (response: string) => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are conducting a job interview. Respond to this answer: "${response}".`;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      setQuestion(text || "Default next question.");
      setQuestionNumber((prev) => prev + 1);
    } catch (error) {
      console.error("Error sending to Gemini AI:", error);
      setQuestion("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
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
      <header className="text-center mb-6">
        <p className="text-lg text-gray-300">{questionNumber}/26</p>
        <h1 className="text-2xl font-semibold">{loading ? "Loading..." : question}</h1>
      </header>

      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-300">
          Your Answer: {userResponse || "Waiting for your response..."}
        </p>
      </div>

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
