interface QuizHeaderProps {
  topic: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  showResults: boolean;
  isCalculating: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const QuizHeader: React.FC<QuizHeaderProps> = ({
  topic,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  showResults,
  isCalculating
}) => {
  return (
    <div className="flex justify-between w-full items-center max-w-3xl mb-6">
      <h1 className="text-2xl text-gray-800 capitalize font-bold">
        {topic} Quiz
      </h1>

      {!showResults && !isCalculating && (
        <div className="flex gap-4 items-center">
          <div className="text-gray-700 text-lg font-medium">
            <span className="text-gray-700">{currentQuestion + 1}</span>/
            {totalQuestions}
          </div>
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-gray-700 font-medium">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHeader;
