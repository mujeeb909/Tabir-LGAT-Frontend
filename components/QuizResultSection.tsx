import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface SectionResult {
  total_questions: number;
  attempted: number;
  correct: number;
  score: number;
}

interface AnalysisData {
  test_id: string;
  summary_report: string;
  section_analyses: {
    [key: string]: string;
  };
}

interface EvaluationResult {
  test_id: string;
  total_questions: number;
  correct_answers: number;
  total_score: number;
  section_results: {
    [key: string]: SectionResult;
  };
  analysis?: AnalysisData;
  purchaseCodeStatus?: {
    isValid: boolean;
    message: string;
  };
}

interface QuizResultSectionProps {
  topic: string;
  evaluationResult: EvaluationResult;
  timeTaken: number;
  submitError: string;
  isSubmitting: boolean; // Add this prop
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="flex space-x-2 justify-center items-center">
      <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
    <p className="mt-4 text-gray-600">Generating your personalized analysis...</p>
  </div>
);

const QuizResultSection: React.FC<QuizResultSectionProps> = ({
  topic,
  evaluationResult,
  timeTaken,
  submitError,
  isSubmitting,
}) => {
  const [activeTab, setActiveTab] = useState("summary"); // "summary", "sections", "analysis"

  const sectionNames = {
    QR: "Quantitative Reasoning",
    VR: "Verbal Reasoning",
    AW: "Analytical Writing",
    AR: "Analytical Reasoning"
  };

  // Handle case where section results might not be available yet
  const sectionResults = evaluationResult.section_results || {};

  // Calculate unanswered questions
  const unanswered = evaluationResult.total_questions -
    Object.values(sectionResults).reduce((sum, section) => sum + section.attempted, 0);

  // Check if analysis data is available
  const hasAnalysis = !!evaluationResult.analysis;

  return (
    <>
{
isSubmitting ? (
  <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    ><LoadingSpinner /></motion.div>

      ) : (
<motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {submitError && (
        <div className="mb-6 p-4 bg-red-100 rounded-lg text-red-600">
          <p>{submitError}</p>
        </div>
      )}

      {evaluationResult.purchaseCodeStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          evaluationResult.purchaseCodeStatus.isValid
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}>
          <p>{evaluationResult.purchaseCodeStatus.message}</p>
        </div>
      )}

      <div className="flex justify-center mb-8">
        {evaluationResult.total_score >= 70 ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
            className="flex bg-green-100 h-28 justify-center rounded-full w-28 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </motion.div>
        ) : evaluationResult.total_score >= 50 ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
            className="flex bg-yellow-100 h-28 justify-center rounded-full w-28 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
            className="flex bg-red-100 h-28 justify-center rounded-full w-28 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" x2="9" y1="9" y2="15" />
              <line x1="9" x2="15" y1="9" y2="15" />
            </svg>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl text-gray-800 font-bold mb-2">
          {evaluationResult.total_score >= 70
            ? "Excellent!"
            : evaluationResult.total_score >= 50
              ? "Good Effort!"
              : "Keep Practicing!"}
        </h2>
        <p className="text-gray-600 mb-6">
          You completed the {topic} quiz
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3"
      >
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-3xl text-gray-700 font-bold mb-1">
            {evaluationResult.total_score}%
          </div>
          <div className="text-gray-600">Overall Score</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-3xl text-green-500 font-bold mb-1">
            {evaluationResult.correct_answers}
          </div>
          <div className="text-gray-600">Correct</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-3xl text-red-500 font-bold mb-1">
            {evaluationResult.total_questions - evaluationResult.correct_answers - unanswered}
          </div>
          <div className="text-gray-600">Incorrect</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-3xl text-gray-500 font-bold mb-1">
            {unanswered}
          </div>
          <div className="text-gray-600">Unanswered</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg sm:col-span-2">
          <div className="text-3xl text-blue-500 font-bold mb-1">
            {formatTime(timeTaken)}
          </div>
          <div className="text-gray-600">Time Taken</div>
        </div>
      </motion.div>

      {/* Show loading spinner when submitting */}
      {isSubmitting ? (
        <LoadingSpinner />
      ) : (
        /* Tabs for Results, Section Performance, and Analysis Report */
        (Object.keys(sectionResults).length > 0 || hasAnalysis) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "summary"
                    ? "text-gray-800 border-b-2"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Results Summary
              </button>
              {Object.keys(sectionResults).length > 0 && (
                <button
                  onClick={() => setActiveTab("sections")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "sections"
                      ? "text-gray-800 border-b-2"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Section Performance
                </button>
              )}
              {hasAnalysis && (
                <button
                  onClick={() => setActiveTab("analysis")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "analysis"
                      ? "text-gray-800 border-b-2"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Detailed Analysis
                </button>
              )}
            </div>

            {activeTab === "summary" && (
              <div className="text-left">
                <p className="mb-4 text-gray-700">
                  You answered {evaluationResult.correct_answers} out of {evaluationResult.total_questions} questions correctly,
                  achieving an overall score of {evaluationResult.total_score}%.
                </p>
                <p className="text-gray-700">
                  {evaluationResult.total_score >= 70
                    ? "Great job! Your performance demonstrates a strong understanding of the concepts tested."
                    : evaluationResult.total_score >= 50
                    ? "Good effort! You've shown a reasonable grasp of the material, but there's room for improvement."
                    : "Keep practicing! This test identified areas where you can focus your study efforts to improve."}
                </p>
              </div>
            )}

            {activeTab === "sections" && (
              <div className="grid gap-4">
                {Object.entries(sectionResults).map(([sectionId, result]) => (
                  <div key={sectionId} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">{sectionNames[sectionId] || sectionId}</h4>
                      <span className="font-bold text-lg">{result.score}%</span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full w-full mb-2">
                      <div
                        className={`h-full rounded-full ${
                          result.score >= 70 ? "bg-green-500" :
                          result.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${result.score}%` }}
                      ></div>
                    </div>
                    <div className="flex text-sm justify-between text-gray-600">
                      <span>{result.correct}/{result.total_questions} correct</span>
                      <span>{result.attempted}/{result.total_questions} attempted</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "analysis" && evaluationResult.analysis && (
              <div className="text-left">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Overall Analysis</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{evaluationResult.analysis.summary_report}</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-800">Section-by-Section Analysis</h3>
                <div className="space-y-4">
                  {Object.entries(evaluationResult.analysis.section_analyses).map(([sectionId, analysis]) => (
                    <div key={sectionId} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium mb-2 text-gray-700">{sectionNames[sectionId] || sectionId}</h4>
                      <p className="text-gray-700 whitespace-pre-line">{analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center gap-4"
      >
        <Link href="/quiz">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex bg-primary rounded-lg text-white font-medium gap-2 hover:bg-primary/90 items-center px-6 py-3"
          >
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Topics
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
      )}
    </>

  );
};

export default QuizResultSection;
