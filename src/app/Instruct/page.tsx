// pages/instructions.tsx
"use client";

import { useRef, useState } from "react";

const InstructionsPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleStartInterview = async () => {
    // Request Camera and Microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera or microphone:", error);
      alert("Please enable camera and microphone.");
    }

    // Start Screen Sharing
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      console.log("Screen sharing started:", screenStream);
    } catch (error) {
      console.error("Error starting screen sharing:", error);
    }

    // Enter Full-Screen Mode
    const element = document.documentElement;
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    }
    setIsFullScreen(true);
  };

  const instructionImages = [
    "https://via.placeholder.com/150", // Random image placeholder
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  const instructions = [
    "Do not look off-screen & maintain eye contact with the camera.",
    "Avoid unusual extended pauses & respond to questions promptly.",
    "Ensure you are the only person visible in the camera frame during the interview.",
    "Don't switch between tabs in your web browser.",
    "Minimizing the screen will lead to you being kicked out.",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <header className="text-3xl font-bold text-center mb-6">
        ZEKO <span className="text-indigo-500">AI</span>
      </header>

      {/* Instructions */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-red-500">Interview Instructions !!</h2>
        <p className="text-gray-300 mt-4">
          You're in a proctored test environment. If caught in any suspicious behavior, you will be marked <span className="text-red-500 font-bold">FAIL</span>.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {instructions.map((instruction, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-gray-300 bg-gray-800 rounded-lg p-4"
            >
              <img
                src={instructionImages[index]}
                alt={`Instruction ${index + 1}`}
                className="w-16 h-16 mb-4 rounded"
              />
              <p className="text-center text-sm">{instruction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
        onClick={handleStartInterview}
      >
        I Understand, start the interview
      </button>

      {/* Video Stream */}
      {isFullScreen && (
        <div className="mt-6">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded-lg border-2 border-gray-500"
            autoPlay
            playsInline
          ></video>
        </div>
      )}
    </div>
  );
};

export default InstructionsPage;
