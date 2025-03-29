import Link from "next/link";

interface QuizErrorProps {
  error: string;
}

const QuizError: React.FC<QuizErrorProps> = ({ error }) => {
  return (
    <div className="flex flex-col bg-gray-50 p-8 justify-center w-full items-center min-h-screen">
      <div className="bg-red-100 p-6 rounded-lg text-center max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500 mx-auto mb-4"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" x2="9" y1="9" y2="15" />
          <line x1="9" x2="15" y1="9" y2="15" />
        </svg>
        <h2 className="text-xl text-red-700 font-bold mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/quiz">
          <button className="bg-primary rounded-lg text-white font-medium p-3">
            Back to Topics
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QuizError;
