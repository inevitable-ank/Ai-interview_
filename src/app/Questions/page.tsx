// "use client"

// import { useEffect, useRef, useState } from "react";

// const InterviewPage = () => {
//   const [questionNumber, setQuestionNumber] = useState(1);
//   const [question, setQuestion] = useState("Tell me about yourself.");
//   const [timeLeft, setTimeLeft] = useState(60); // Timer in seconds
//   const [isRecording, setIsRecording] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunks: Blob[] = []; // To store video/audio chunks

//   // Speak the question using SpeechSynthesis
//   const speakQuestion = (text: string) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     synth.speak(utterance);
//   };

//   useEffect(() => {
//     // Speak the question on load
//     // speakQuestion(question);
    
//     // Countdown Timer
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [question]);

//   // Start recording video and audio
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }

//       // Initialize MediaRecorder
//       const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);

//           // Send chunks to API
//           sendChunkToAPI(event.data);
//         }
//       };

//       mediaRecorder.start(1000); // Record in 1-second chunks
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error accessing camera or microphone:", error);
//       alert("Please allow access to the camera and microphone.");
//     }
//   };

//   // Stop recording video and audio
//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }

//     if (videoRef.current?.srcObject) {
//       const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
//       tracks.forEach((track) => track.stop());
//     }
//   };

//   // Send chunks to the API
//   const sendChunkToAPI = async (chunk: Blob) => {
//     const formData = new FormData();
//     formData.append("file", chunk, `recording-${Date.now()}.webm`);

//     try {
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         console.error("Failed to upload chunk");
//       }
//     } catch (error) {
//       console.error("Error sending chunk to API:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
//       {/* Question and Number */}
//       <header className="text-center mb-6">
//         <p className="text-lg text-gray-300">{questionNumber}/26</p>
//         <h1 className="text-2xl font-semibold">{question}</h1>
//       </header>

//       {/* Timer */}
//       <div className="text-center mb-6">
//         <span className="text-lg font-semibold text-red-500">Timer:</span>{" "}
//         <span className="text-lg font-mono">{`00:${timeLeft.toString().padStart(2, "0")}`}</span>
//       </div>

//       {/* Video Frame */}
//       <div className="w-full max-w-md mb-6">
//         <video
//           ref={videoRef}
//           className="w-full h-64 bg-black rounded-lg border-2 border-gray-500"
//           autoPlay
//           muted
//         ></video>
//       </div>

//       {/* Control Buttons */}
//       <div className="flex gap-4">
//         {!isRecording ? (
//           <button
//             onClick={startRecording}
//             className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
//           >
//             Start Recording
//           </button>
//         ) : (
//           <button
//             onClick={stopRecording}
//             className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
//           >
//             Stop Recording
//           </button>
//         )}
//         <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition">
//           Save & Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InterviewPage;


"use client";


import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
const geminiApiKey = "AIzaSyChShQMyTYrZcJctMk_lAth6ggt0oyGtyg";

const InterviewPage = () => {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState("Tell me about yourself.");
  // for gemini
  const [userResponse, setUserResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  //
  const [timeLeft, setTimeLeft] = useState(60); 
  const [isRecording, setIsRecording] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks: Blob[] = []; // To store video/audio chunks

  // Speak the question using SpeechSynthesis
  const speakQuestion = (text: string) => {
    const synth = window.speechSynthesis;

    // Stop any ongoing speech before starting a new one
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1; // Adjust rate as needed
    utterance.pitch = 1; // Adjust pitch as needed
    synth.speak(utterance);
  };
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (speechEnabled) {
    // Speak the question on load and whenever the question changes
    speakQuestion(question);

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    }
  }, [question, speechEnabled]); // Re-run effect when `question` changes

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


  // Trial 
  // const nextQuestion = () => {
  //   setQuestionNumber((prev) => prev + 1);
  //   setQuestion(`This is question number ${questionNumber + 1}.`);
  //   setTimeLeft(60); // Reset the timer for the new question
  // };

  // from gemini

  const sendToGemini = async (response: string) => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are conducting a job interview. Ask one follow back question according to this answer: "${response}".`;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      setQuestion(text || "Default next question.");
      setQuestionNumber((prev) => prev + 1);
      setTimeLeft(60);
    } catch (error) {
      console.error("Error sending to Gemini AI:", error);
      setQuestion("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Enable speech synthesis on user interaction
  const enableSpeech = () => {
    setSpeechEnabled(true);
  };

  // Start recording video and audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);

          // Send chunks to API
          sendChunkToAPI(event.data);
        }
      };
      

      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      if (recognition) {
        setIsListening(true);
      recognition.start();
      }
      
      
    } catch (error) {
      console.error("Error accessing camera or microphone:", error);
      alert("Please allow access to the camera and microphone.");
    }
  };

  // Stop recording video and audio
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  // const startListening = () => {
  //   if (!recognition) {
  //     alert("Speech recognition is not supported in your browser.");
  //     return;
  //   }
  //   setIsListening(true);
  //   recognition.start();
  // };

  // const stopListening = () => {
  //   if (recognition) {
  //     recognition.stop();
  //     setIsListening(false);
  //   }
  // };

  // Send chunks to the API
  const sendChunkToAPI = async (chunk: Blob) => {
    const formData = new FormData();
    formData.append("file", new Blob([chunk], { type: "video/webm" }), `recording-${Date.now()}.webm`);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload chunk");
      }
    } catch (error) {
      console.error("Error sending chunk to API:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        {!speechEnabled ? (
        <button
          onClick={enableSpeech}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Click to Start
        </button>
      ) : (
        <>
      {/* Question and Number */}
      <header className="text-center mb-6">
        <p className="text-lg text-gray-300">{questionNumber}/26</p>
        <h1 className="text-2xl font-semibold">{loading ? "Loading..." : question}</h1>
      </header>

      {/* Timer */}
      <div className="text-center mb-6">
        <span className="text-lg font-semibold text-red-500">Timer:</span>{" "}
        <span className="text-lg font-mono">{`00:${timeLeft.toString().padStart(2, "0")}`}</span>
      </div>

      {/* Video Frame */}
      <div className="w-full max-w-md mb-6">
        <video
          ref={videoRef}
          className="w-full h-64 bg-black rounded-lg border-2 border-gray-500"
          autoPlay
          muted
        ></video>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Stop Recording
          </button>
        )}
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition">
          Save & Next
        </button>
      </div>
      </>
      )}
    </div>
  );
};

export default InterviewPage;
