"use client"; // Make this a client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import
import Image from "next/image";
import logo from "../assets/Zekologo.webp";
import { Button } from "@/components/ui/button";
// import Mon from "../../public/Mon.svg"
import { FaLandmark } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import { useRef } from "react";

const Permission = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);

  // This is of the permission page
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
  const [helloCount, setHelloCount] = useState(0);

  // Check Camera
  // const checkCamera = async () => {
  //   try {
  //     await navigator.mediaDevices.getUserMedia({ video: true });
  //     setCameraChecked(true);
  //   } catch (error) {
  //     alert("Please allow camera access to proceed.");
  //   }
  // };

  useEffect(() => {
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraChecked(true);
      } catch (error) {
        console.error("Camera access denied:", error);
        alert("Please allow camera access to proceed.");
      }
    })();
  }, []);

  // Check Microphone
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
          setHelloCount((count) => count + 1);
        }

        if (helloCount >= 4) {
          setMicrophoneChecked(true);
          cleanUpMicrophone();
        } else {
          animationRef.current = requestAnimationFrame(detectMicIntensity);
        }
      }
    };

    detectMicIntensity();
  };


  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneModal(false);
      setUpMicrophoneAnalyzer(stream);
    } catch (error) {
      setMicrophoneModal(true);
    }
  };

  // const setUpMicrophoneAnalyzer = (stream: MediaStream) => {
  //   microphoneStreamRef.current = stream;
  //   const audioContext = new AudioContext();
  //   audioContextRef.current = audioContext;

  //   const analyser = audioContext.createAnalyser();
  //   analyserRef.current = analyser;

  //   const source = audioContext.createMediaStreamSource(stream);
  //   source.connect(analyser);

  //   const dataArray = new Uint8Array(analyser.frequencyBinCount);
  //   const detectMicIntensity = () => {
  //     if (analyserRef.current) {
  //       analyserRef.current.getByteFrequencyData(dataArray);
  //       const intensity = Math.max(...dataArray);
  //       setMicIntensity(intensity);
  //       if (intensity > 50) {
  //         setMicrophoneChecked(true);
  //         cleanUpMicrophone();
  //       } else {
  //         animationRef.current = requestAnimationFrame(detectMicIntensity);
  //       }
  //     }
  //   };

  //   detectMicIntensity();
  // };

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

  // Check Speaker
  const checkSpeaker = () => {
    const audio = new Audio(
      "/button-1.mp3"
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

  // Ensure video element only mounts on the client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true }) 
        .then((stream) => {
          if (videoRef.current) {
            if ("srcObject" in videoRef.current) {
              videoRef.current.srcObject = stream;
            } else {
              console.log("not happening");
              // videoRef.current.src = URL.createObjectURL(stream); // Fallback
            }
            videoRef.current
              .play()
              .catch((error) =>
                console.error("Error playing the video: ", error)
              );
          }
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
          alert("Unable to access the camera. Please check your permissions.");
        });
    } else {
      alert("Camera access is not supported in your browser.");
    }
  }, []);

  //   startCamera();
  // }, []);

  return (
    <>

      <div className="absolute top-0 flex justify-between items-center h-16 w-full px-10 py-[1.5rem] z-40 bg-slate-100">
        <div className="text-lg font-bold flex items-center h-full">
          <Image src={logo} alt="Logo" width={106} height={20} />
        </div>
        <div className="flex items-center">
          <Image
            src="/profile-icon.png"
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </div>


      {/* <div className="grid grid-cols-2 gap-4 p-8 mt-16"> */}
      <div className="relative flex h-[95vh] min-h-fit flex-col bg-[#161d29] text-white md:w-full z-10 mt-12 md:h-[95vh]">
        {/* Left Section */}
        <div className="m-auto mt-12 flex w-[95%] max-w-[88rem] flex-col items-center justify-center gap-8 md:m-auto md:w-[80%] md:gap-12">
          <div className="flex w-full items-start justify-between gap-4 md:flex-row md:items-center">
            <span className="whitespace-pre-line text-[1.25rem] leading-tight md:text-[1.5rem] font-[700] text-left text-white">
              Trainee Interview
            </span>
            <div className="flex w-full items-start justify-center gap-2 md:w-fit md:flex-row">
              <div className="flex w-fit items-center gap-2 rounded-lg border border-neutral-500 px-2 py-1 md:px-4">
                <FaLandmark style={{ color: "orange", fontSize: "1rem" }} />
                <span className="dmSns whitespace-pre-line text-[0.78rem] leading-loose md:text-[0.88rem] not-italic no-underline text-left text-neutral-200">
                  Zeko
                </span>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-lg border border-neutral-500 px-2 py-1 md:px-4">
                <FaRegClock style={{ color: "red", fontSize: "1rem" }} />
                <span className="dmSns whitespace-pre-line text-[0.78rem] leading-loose md:text-[0.88rem] not-italic no-underline text-left text-neutral-200">
                  26 minutes
                </span>
              </div>
            </div>
          </div>
          <div className="m-auto flex w-full items-start justify-between">
            <div className="flex flex-col items-center h-[428] w-[600]">
              {/* {isClient && ( */}
              <video
                // id="videoElement"
                ref={videoRef}
                height={428}
                width={600}
                className="rounded-xl shadow-md"
                style={{ transform: "scaleX(-1)" }}
                autoPlay
                playsInline
                muted
              ></video>
              {/* )} */}
            </div>
            <div className="flex flex-col w-fit items-start justify-between gap-6 md:h-full md:min-h-[27rem] md:max-w-[40%]">
              <div className="flex flex-col items-start justify-center">
                <span className="text-[1rem] md:text-[1.25rem] font-[700] text-left leading-0 text-white">
                  {" "}
                  Ready to join?
                </span>
                <span className="mt-1 text-[0.88rem] md:text-[1rem] font-[300] text-left leading-relaxed text-white">
                  {" "}
                  Please Make Sure your device is properly configured
                </span>
              </div>
              <div className="p-6 shadow-md flex flex-col max-w-lg w-full">
                <div className="mb-4 ">
                  <button
                    className={`w-full p-3 text-left disabled:opacity-85 disabled:cursor-not-allowed items-center justify-center border hover:ring-gray rounded-lg ${
                      cameraChecked ? "bg-green-600" : "bg-gray-700"
                    
                    }`}
                    // onClick={checkCamera}
                    disabled={cameraChecked}
                  >
                    {cameraChecked ? "✅ Camera Checked" : "🎦 Check Camera... "}
                  </button>
                </div>
                <div className="mb-4">
                  <button
                    className={`w-full p-3 text-left disabled:opacity-85 disabled:cursor-not-allowed items-center justify-center border hover:ring-gray rounded-lg ${
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
                    className={`w-full p-3 text-left disabled:opacity-85 disabled:cursor-not-allowed items-center justify-center border hover:ring-gray rounded-lg ${
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
                    className={`w-full p-3 text-left disabled:opacity-85 disabled:cursor-not-allowed items-center justify-center border hover:ring-gray rounded-lg ${
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
              </div>
              
              <button
                className=" items-center justify-center font-semibold transition-colors bg-purple-500 hover:bg-blue-500 px-4 w-full rounded-lg py-3 text-[1rem] disabled:bg-gray-700"
                disabled={!screenShareChecked}
                onClick={() => router.push("/Questions")}
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bada wala div yaha close hua hai */}

      {/* ---------------------------------------------------------------------------------------------------- */}
    </>
  );
};

export default Permission;
