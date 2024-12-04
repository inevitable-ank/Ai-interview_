export default function QuestionScreen() {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark text-white">
        <h2 className="text-xl font-bold">Question:</h2>
        <audio controls className="mt-4">
          <source src="/path-to-question-audio.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
  