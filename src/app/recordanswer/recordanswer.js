import { useRef, useState } from "react";

export default function AnswerRecording() {
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      // Send blob to API
    };

    mediaRecorder.start();
    setRecording(true);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark text-white">
      <video ref={videoRef} autoPlay className="w-full max-w-md rounded"></video>
      <button onClick={startRecording} className="mt-4 bg-blue-500 px-4 py-2 rounded">
        Start Recording
      </button>
    </div>
  );
}
