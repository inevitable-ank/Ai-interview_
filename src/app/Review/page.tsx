"use client"
import { useState } from 'react';

export default function ReviewPage() {

  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-lg font-medium text-white">Please rate your experience</h2>
            <div className="mt-4 flex justify-around">
              {['😖', '😟', '🙂', '😀'].map((emoji, idx) => (
                <button
                  key={idx}
                  className="text-2xl hover:scale-110 focus:outline-none"
                  onClick={closeModal}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              className="mt-6 w-full rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-700 focus:outline-none"
              onClick={closeModal}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold">Test completed 🎉</h1>
        </div>
      )}
    </div>
  );
}
