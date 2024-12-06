"use client";

import React, { useState, useRef, useEffect } from "react";

function CheckPermissionsPage() {
  const [cameraChecked, setCameraChecked] = useState(false);
  const [microphoneChecked, setMicrophoneChecked] = useState(false);
  const [speakerChecked, setSpeakerChecked] = useState(false);
  const [screenShareChecked, setScreenShareChecked] = useState(false);
  const [microphoneModal, setMicrophoneModal] = useState(false);
  const [micIntensity, setMicIntensity] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Check Camera
  const checkCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraChecked(true);
    } catch (error) {
      alert("Please allow camera access to proceed.");
    }
  };

  // Check Microphone
  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneModal(false);
      setUpMicrophoneAnalyzer(stream);
    } catch (error) {
      setMicrophoneModal(true);
    }
  };

  const setUpMicrophoneAnalyzer = (stream: MediaStream) => {
    microphoneStreamRef.current = stream;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const detectMicIntensity = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const intensity = Math.max(...dataArray);
        setMicIntensity(intensity);
        if (intensity > 50) {
          setMicrophoneChecked(true);
          cleanUpMicrophone();
        } else {
          animationRef.current = requestAnimationFrame(detectMicIntensity);
        }
      }
    };

    detectMicIntensity();
  };

  const cleanUpMicrophone = () => {
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Check Speaker it is not working due to that audio error
  // need to recheck it
  const checkSpeaker = () => {
    const audio = new Audio(
      "https://www.soundjay.com/button/sounds/beep-07.mp3"
    );
    audio.play();
    audio.onended = () => setSpeakerChecked(true);
  };

  // Enable Screen Share
  const checkScreenShare = async () => {
    try {
      await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenShareChecked(true);
    } catch (error) {
      alert("Please share your screen to proceed.");
    }
  };

  useEffect(() => {
    return () => {
      cleanUpMicrophone();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Trainee Interview</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-3/4 max-w-lg">
        <div className="mb-4">
          <button
            className={`w-full p-3 text-left ${
              cameraChecked ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={checkCamera}
            disabled={cameraChecked}
          >
            {cameraChecked ? "✅ Camera Checked" : "📷 Check Camera"}
          </button>
        </div>
        <div className="mb-4">
          <button
            className={`w-full p-3 text-left ${
              microphoneChecked ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={checkMicrophone}
            disabled={!cameraChecked || microphoneChecked}
          >
            {microphoneChecked
              ? "✅ Microphone Checked"
              : "🎤 Check Microphone"}
          </button>
          {microphoneModal && (
            <div className="mt-2 text-red-500">
              Please grant microphone access to proceed.
            </div>
          )}
          {cameraChecked && !microphoneChecked && (
            <div className="mt-2">
              <p>Testing Microphone: Say Hello!</p>
              <div className="bg-gray-600 h-2 w-full mt-2">
                <div
                  className="bg-green-500 h-2"
                  style={{ width: `${micIntensity}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <button
            className={`w-full p-3 text-left ${
              speakerChecked ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={checkSpeaker}
            disabled={!microphoneChecked || speakerChecked}
          >
            {speakerChecked ? "✅ Speaker Checked" : "🔊 Check Speaker"}
          </button>
        </div>
        <div className="mb-4">
          <button
            className={`w-full p-3 text-left ${
              screenShareChecked ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={checkScreenShare}
            disabled={!speakerChecked || screenShareChecked}
          >
            {screenShareChecked
              ? "✅ Screen Share Enabled"
              : "🖥️ Enable Screen Share"}
          </button>
        </div>
        <button
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
          disabled={!screenShareChecked}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

export default CheckPermissionsPage;
