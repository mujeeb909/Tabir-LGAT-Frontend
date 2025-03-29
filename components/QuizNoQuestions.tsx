import Link from "next/link";

const QuizNoQuestions = () => {
  return (
    <div className="flex flex-col bg-gray-50 p-8 justify-center w-full items-center min-h-screen">
      <div className="bg-yellow-100 p-6 rounded-lg text-center max-w-md">
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
          className="text-yellow-500 mx-auto mb-4"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <h2 className="text-xl text-yellow-700 font-bold mb-2">No Questions Available</h2>
        <p className="text-yellow-600 mb-4">There are no questions available for this topic at the moment.</p>
        <Link href="/quiz">
          <button className="bg-primary rounded-lg text-white font-medium p-3">
            Back to Topics
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QuizNoQuestions;
