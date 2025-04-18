import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import MathRenderer from "@/components/MathRenderer";

const swipeVariants = {
  nextEnter: { x: 100, opacity: 0 },
  prevEnter: { x: -100, opacity: 0 },
  center: { x: 0, opacity: 1 },
  nextExit: { x: -100, opacity: 0 },
  prevExit: { x: 100, opacity: 0 },
};

interface QuizQuestion {
  id: string;
  text: string;
  type: string;
  category: string;
  difficulty: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string | null;
  section: string;
}

interface QuizQuestionSectionProps {
  questions: QuizQuestion[];
  currentQuestion: number;
  answers: { [key: number]: string };
  explanations?: { [key: number]: string };
  slideDirection: string;
  handleAnswerSelect: (answer: string) => void;
  goToNextQuestion: () => void;
  goToPrevQuestion: () => void;
  handleSubmit: () => void;
  handleExplanationChange?: (data: { questionIndex: number; explanation: string }) => void;
}

// Enhanced helper function to check if content has math expressions
const hasMathExpression = (text: string): boolean => {
  if (!text) return false;

  const mathPatterns = [
    /\\\(/, /\\\)/, /\\\[/, /\\\]/,
    /\\x/, /\\y/, /\\cdot/, /\\ldot/,
    /\^{.*?}/, /\^/, /\\frac{.*?}{.*?}/, /\\sqrt/,
    /\(x\^/, /\(y\^/, /\\left/, /\\right/,
    /\\Delta/, /\\alpha/, /\\beta/, /\\pi/,
    /\\leq/, /\\geq/, /\\neq/, /\\approx/
  ];

  return mathPatterns.some(pattern => pattern.test(text));
};

const QuizQuestionSection: React.FC<QuizQuestionSectionProps> = ({
  questions,
  currentQuestion,
  answers,
  explanations = {},
  slideDirection,
  handleAnswerSelect,
  goToNextQuestion,
  goToPrevQuestion,
  handleExplanationChange,
  handleSubmit,
}) => {
  const [localExplanation, setLocalExplanation] = useState(
    explanations[currentQuestion] || ""
  );

  const [wordCount, setWordCount] = useState(0);

  // Add preloading of MathJax to ensure it's available - moved inside the component
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.id = 'MathJax-script';
      document.head.appendChild(script);
    }
  }, []);

  // Update the local explanation when the current question changes
  useEffect(() => {
    setLocalExplanation(explanations[currentQuestion] || "");
    // Count initial words
    const initialWords = (explanations[currentQuestion] || "")
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    setWordCount(initialWords.length);
  }, [currentQuestion, explanations]);

  const handleLocalExplanationChange = (e) => {
    const newText = e.target.value;

    // Count words in the new text
    const words = newText.trim().split(/\s+/).filter(word => word.length > 0);
    const newWordCount = words.length;

    // If we're at the word limit and adding more words, prevent it
    if (newWordCount > 20) {
      // Get just the first 20 words
      const first20Words = words.slice(0, 20).join(' ');
      setLocalExplanation(first20Words);
      setWordCount(20);
    } else {
      setLocalExplanation(newText);
      setWordCount(newWordCount);
    }

    // If a handler is provided, call it with the updated text (within word limit)
    if (handleExplanationChange) {
      handleExplanationChange({
        questionIndex: currentQuestion,
        explanation: newWordCount > 20 ? words.slice(0, 20).join(' ') : newText
      });
    }
  };

  // Get the current question
  const question = questions[currentQuestion];

  // Check if it's an essay question (no options)
  const isEssayQuestion = question?.type === 'essay';

  // Always use MathRenderer for questions and options to ensure consistent rendering
  // This simplifies the logic and ensures all math is properly rendered

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentQuestion}
          variants={swipeVariants}
          initial={slideDirection === "next" ? "nextEnter" : "prevEnter"}
          animate="center"
          exit={slideDirection === "next" ? "nextExit" : "prevExit"}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="mb-2 flex items-center">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-700 mr-2">
              {question?.section}
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-700">
              {question?.difficulty}
            </span>
          </div>

          {/* Always use MathRenderer for question text for consistent rendering */}
          <div className="mb-8">
            <MathRenderer
              content={question?.text || ""}
              className="text-gray-800 text-xl font-semibold"
            />
          </div>

          {/* Display options for multiple choice questions */}
          {!isEssayQuestion && question?.options && (
            <div className="grid grid-cols-1 gap-4 mb-8">
              {question.options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-4 text-left text-base font-medium rounded-lg transition-all ${
                    answers[currentQuestion] === option.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className={`flex h-8 justify-center rounded-full text-sm w-8 items-center mr-3 ${
                    answers[currentQuestion] === option.id
                      ? "bg-white bg-opacity-20 text-white"
                      : "bg-white text-gray-700"
                  }`}>
                    {option.id}
                  </span>

                  {/* Always use MathRenderer for options for consistent rendering */}
                  <div className="flex-1">
                    <MathRenderer content={option.text} />
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Display textarea for essay questions */}
          {isEssayQuestion && (
            <div className="mb-8">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[200px] text-black"
                placeholder="Write your essay answer here..."
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswerSelect(e.target.value)}
              ></textarea>
            </div>
          )}

          {answers[currentQuestion] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-4 mb-4"
            >
              <label
                htmlFor={`explanation-${currentQuestion}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Optional Explanation (max 20 words)
              </label>
              <textarea
                id={`explanation-${currentQuestion}`}
                value={localExplanation}
                onChange={handleLocalExplanationChange}
                placeholder="Why did you choose this?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-black"
                rows={3}
              />
              <p className={`text-xs mt-1 text-right ${wordCount >= 20 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {wordCount}/20 words
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={goToPrevQuestion}
          disabled={currentQuestion === 0}
          className={`px-5 py-3 rounded-lg font-medium flex items-center gap-2 ${
            currentQuestion === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={goToNextQuestion}
            disabled={!answers[currentQuestion]}
            className={`px-5 py-3 rounded-lg font-medium flex items-center gap-2 ${
              !answers[currentQuestion]
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            Next
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex bg-green-500 rounded-lg text-white font-medium gap-2 hover:bg-green-600 items-center px-5 py-3"
          >
            Submit Quiz
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default QuizQuestionSection;
