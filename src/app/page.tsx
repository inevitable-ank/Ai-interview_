"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import logo from "./assets/Zekologo.webp";
import { Button } from "@/components/ui/button";

import { FaLandmark } from "react-icons/fa";

import { FaRegClock } from "react-icons/fa";

import { MdOpenInNew } from "react-icons/md";
import { useRef } from "react";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false)

  // OTP and Login wala part, Need to work on it
  const handleLogin = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    setShowOtpPrompt(true); 
  };

  const verifyOtp = () => {
    if (otp === "1234") {
      setIsLoggedIn(true);
      router.push("/profile");
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

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
              console.log("not happening")
              // videoRef.current.src = URL.createObjectURL(stream); // not needed cosidering updated browsers
            }
            videoRef.current
              .play()
              .catch((error) => console.error("Error playing the video: ", error));
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
      {/* Navbar  Section Profile Logo is remaining*/}
      <div className="absolute top-0 flex justify-between items-center h-16 w-full px-10 py-[1.5rem] z-40 bg-slate-100">
        <div className="text-lg font-bold flex items-center h-full">
          <Image src={logo} alt="Logo" width={106} height={20} />
        </div>
        {!isLoggedIn ? (
          <button
            className="inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-85 disabled:cursor-not-allowed text-[#6C47FF] border border-[#6C47FF] bg-transparent hover:bg-[#6C47FF] hover:text-white py-3 px-3 text-[0.8rem] leading-4 rounded-lg"
            onClick={handleLogin}
          >
            Login / Signup
          </button>
        ) : (
          <div className="flex items-center">
            <Image
              src="/profile-icon.png"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        )}
      </div>

      {/* 2nd Div*/}
      {/* <div className="grid grid-cols-2 gap-4 p-8 mt-16"> */}
      <div className="relative flex h-[95vh] min-h-fit flex-col bg-[#161d29] text-white md:w-full z-10 mt-12 md:h-[95vh]">

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
            <div className="flex flex-col h-full items-start justify-between md:min-h-[27rem] md:max-w-[40%]">
              <div className="flex w-[100%] flex-col items-start gap-2 md:w-full">
                <span className="whitespace-pre-line text-[1rem] md:text-[1.25rem] font-[700] text-left leading-0 text-white">
                  {" "}
                  Instructions
                </span>
                <div className="flex w-full gap-2 md:w-fit">
                  <span className="dmSans whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] not-italic no-underline text-left text-white/90">
                    1.
                  </span>
                  <span className="dmSans whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] not-italic no-underline text-left text-white/90">
                    Ensure stable internet and choose a clean, quiet location
                  </span>
                </div>
                <div className="flex w-full gap-2 md:w-fit">
                  <span className="dmSans whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] not-italic no-underline text-left text-white/90">
                    2.
                  </span>
                  <span className="dmSans whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] not-italic no-underline text-left text-white/90">
                    Permission for access to camera, microphone, entire screen
                    sharing is required.
                  </span>
                </div>
                <div className="flex w-full gap-2 md:w-fit">
                  <span className="dmSans whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] not-italic no-underline text-left text-white/90">
                    3.
                  </span>
                  <span className="dmSans whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] not-italic no-underline text-left text-white/90">
                    Be in professional attire and avoid distractions.
                  </span>
                </div>
                <div className="flex w-full gap-2 md:w-fit">
                  <span className="whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] text-left text-white/90">
                    4.
                  </span>
                  <span className="whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] text-left text-white/90">
                    Give a detailed response, providing as much information as you
                    can.
                  </span>
                </div>
                <div className="flex w-full gap-2 md:w-fit">
                  <span className=" whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] text-left text-white/90">
                    4.
                  </span>
                  <span className=" whitespace-pre-line text-[0.88rem] leading-relaxed md:text-[1rem] font-[300] text-left text-white/90">
                    Answer the question with examples and projects you’ve worked
                    on.
                  </span>
                </div>
              </div>
              <div className="mb-[48px] mt-4 rounded-xl bg-slate-800 p-2 md:p-4">
                <span className="whitespace-pre-line text-[0.88rem] md:text-[1rem] font-[300] items-center">
                  <span className="md:text-[1rem] text-[#6C47FF] hover:text-[#3f2899] cursor-pointer inline-flex items-center">
                    Click here{" "} <MdOpenInNew style={{ color: "blue",fontSize: "1rem",cursor: "pointer"}} className="mx-1"/>
                  </span>
                    to try a mock interview with Avya, our AI interviewer, and build your confidence before the main interview !
                </span>
              </div>
              <button className=" items-center justify-center font-semibold transition-colors bg-purple-500 hover:bg-blue-500 px-4 w-full rounded-none py-3 text-[1rem] "
                onClick={() => router.push("/checkPermissions")}
                >
                Start Now
              </button>
            </div>
          </div>
        </div>
      </div> 
        {/* Bada wala div yaha close hua hai */}


        {/* Isme Se OTP wala part track karna hai */}


        
        {/* <div className="space-y-4">
          <h2 className="text-2xl font-bold">Trainee Interview</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Ensure stable internet and choose a clean, quiet location.</li>
            <li>
              Permission for access to camera, microphone, entire screen
              sharing is required.
            </li>
            <li>Be in professional attire and avoid distractions.</li>
            <li>
              Give a detailed response, providing as much information as you
              can.
            </li>
            <li>
              Answer the question with examples and projects you’ve worked on.
            </li>
          </ol>
          <button
            className="bg-purple-500 px-4 py-2 rounded hover:bg-blue-500 transition"
            onClick={() =>
              isLoggedIn ? router.push("/mock-interview") : handleLogin()
            }
          >
            Start Now
          </button>
        </div> */}
        {/* </div> */}
        {/* ---------------------------------------------------------------------------------------------------- */}
        {/* Login Prompt */}
        {/* {!isLoggedIn && (
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transition ${
              showOtpPrompt ? "visible" : "invisible"
            }`}
          >
            <div className="bg-white text-black p-6 rounded space-y-4">
              {!showOtpPrompt ? (
                <>
                  <h2 className="text-xl font-bold">Enter your email</h2>
                  <input
                    type="email"
                    className="border px-4 py-2 rounded w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className="bg-purple-500 px-4 py-2 text-white rounded w-full"
                    onClick={handleLogin}
                  >
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">Enter the OTP</h2>
                  <input
                    type="text"
                    className="border px-4 py-2 rounded w-full"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="bg-purple-500 px-4 py-2 text-white rounded w-full"
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                </>
              )}
            </div>
          </div>
        )} */}
        {/* </div> */}
    </>
  );
};

export default Home;
