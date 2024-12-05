// // pages/instructions.tsx
"use client";

import { useRef, useState } from "react";
// import { useRouter } from "next/router";

const InstructionsPage = () => {
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // const router = useRouter();

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
      return;
    }

    // Start Screen Sharing ------
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        console.log("Screen sharing started:", screenStream);
        setIsScreenSharing(true); // Update state to indicate screen sharing is active
      } catch (error) {
        console.error("Error starting screen sharing:", error);
        alert("Please enable screen sharing.");
        return;
      }
    } else {
      console.log("Screen sharing already active.");
    }

    // Full-Screen Mode functionality, But i need to make sure that camera and microphone is enabled
    const element = document.documentElement;
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    }
    setIsFullScreen(true);

    // router.push("/Questions");
  };

  // const handleInter
  // Placeholder images and instructions
  const instructionImages = [
    "https://via.placeholder.com/150",
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
      <div className="text-3xl font-bold text-center p-2 mt-4">
        ZEKO <span className="text-indigo-500">AI</span>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="text-lg font-semibold text-red-500">
          Interview Instructions !!
        </div>
        <p className="text-gray-300 mt-4">
          You're in a proctored test environment. If caught in any suspicious
          behavior, you will be marked{" "}
          <span className="text-red-500 font-bold">FAIL</span>.
        </p>

        {/* Permissions Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* Row 1: Three Permissions */}
          {instructions.slice(0, 3).map((instruction, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-gray-300 bg-gray-800 rounded-lg p-4 w-48 h-48"
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

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {/* Row 2: Two Permissions */}
          <div className="flex w-full justify-between gap-6">
            {instructions.slice(3).map((instruction, index) => (
              <div
                key={index + 3}
                className="flex flex-col items-center text-gray-300 bg-gray-800 rounded-lg p-4 w-48 h-48"
              >
                <img
                  src={instructionImages[index + 3]}
                  alt={`Instruction ${index + 4}`}
                  className="w-16 h-16 mb-4 rounded"
                />
                <p className="text-center text-sm">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
        onClick={handleStartInterview}
      >
        I Understand, start the interview
      </button>
      {/* <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition mt-2"
        onClick={() => router.push("/Questions")}
      >
        start the interview
      </button> */}

      {/* Video Stream */}
      {/* {isFullScreen && (
        <div className="mt-6">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded-lg border-2 border-gray-500"
            autoPlay
            playsInline
          ></video>
        </div>
      )} */}
    </div>
  );
};

export default InstructionsPage;
