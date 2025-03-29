"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import QuizLoading from "@/components/QuizLoading";
import QuizError from "@/components/QuizError";
import QuizNoQuestions from "@/components/QuizNoQuestions";
import QuizHeader from "@/components/QuizHeader";
import QuizQuestionSection from "@/components/QuizQuestionSection";
import QuizResultSection from "@/components/QuizResultSection";

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

interface QuizData {
  quizId: string;
  quizName: string;
  description: string;
  questions: QuizQuestion[];
}

interface QuizState {
  quizId: string | null;
  currentQuestion: number;
  answers: { [key: number]: string };
  explanations: { [key: number]: string };
  timeRemaining: number;
  lastUpdated: number;
}

interface AnalysisData {
  test_id: string;
  summary_report: string;
  section_analyses: {
    [key: string]: string;
  };
}

const QuizTestPage = () => {
  const { topic } = useParams() as { topic: string };

  const [explanations, setExplanations] = useState<{ [key: number]: string }>({});
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(900);
  const [slideDirection, setSlideDirection] = useState("next");
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState({
    test_id: "",
    total_questions: 0,
    correct_answers: 0,
    total_score: 0,
    section_results: {},
    analysis: null as AnalysisData | null
  });
  const [submittingResults, setSubmittingResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [quizId, setQuizId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuizState = localStorage.getItem(`quizState_${topic}`);
      if (savedQuizState) {
        const parsedState: QuizState = JSON.parse(savedQuizState);
        const currentTime = Date.now();
        if (currentTime - parsedState.lastUpdated < 3600000) {
          // 1 hour in milliseconds
          setCurrentQuestion(parsedState.currentQuestion);
          setAnswers(parsedState.answers);
          setExplanations(parsedState.explanations || {});
          setTimeRemaining(parsedState.timeRemaining);
          setQuizId(parsedState.quizId);
        }
      }
    }
  }, [topic]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      quizId &&
      !showResults &&
      !isCalculating
    ) {
      const quizState: QuizState = {
        quizId,
        currentQuestion,
        answers,
        explanations,
        timeRemaining,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(`quizState_${topic}`, JSON.stringify(quizState));
    }
  }, [
    quizId,
    topic,
    currentQuestion,
    answers,
    timeRemaining,
    explanations,
    showResults,
    isCalculating,
  ]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        // Use the random quiz endpoint we created
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/entrytest/67da8a647deead57cfc84cdc`
        );
        const data = await response.json();

        if (data.success) {
          setQuizData(data.data);
          setQuestions(data.data.questions);
          setQuizId(data.data.quizId);
        } else {
          setError(data.message || "Failed to fetch questions");
        }
      } catch (err) {
        setError("Failed to load quiz questions. Please try again.");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 || showResults || isCalculating) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults, isCalculating]);

  const handleExplanationChange = ({ questionIndex, explanation }) => {
    setExplanations((prev) => ({
      ...prev,
      [questionIndex]: explanation,
    }));
  };

  const handleAnswerSelect = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setSlideDirection("next");
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setSlideDirection("prev");
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const submitResultsToServer = async (timeTaken) => {
    try {
      setSubmittingResults(true);
      setIsSubmitting(true); // Add this line to set loading state
      setSubmitError("");

      // Get purchase code from local storage if available
      const purchaseCode = localStorage.getItem("purchaseCode") || "";

      // Group answers by section
      const sectionMap = {};

      questions.forEach((question, index) => {
        // Extract section ID from the question
        const sectionId = question.section.split(" ")[0]; // Get section code (QR, VR, AR, AW)

        if (!sectionMap[sectionId]) {
          sectionMap[sectionId] = {
            section_id: sectionId,
            questions: []
          };
        }

        // Determine if this is an essay question or multiple choice
        const isEssay = question.type === 'essay';

        // Get the explanation for this question, if any
        const explanation = explanations[index] || null;

        // Add user response if the question was answered
        if (answers[index]) {
          sectionMap[sectionId].questions.push({
            question_id: question.id,
            user_response: {
              selected_option_id: isEssay ? null : answers[index],
              logic_response: explanation, // Use explanation as logic_response
              time_taken: Math.floor(Math.random() * 60) + 15 // Random time between 15-75 seconds
            }
          });
        }
      });

      // Convert section map to array
      const sections = Object.values(sectionMap);

      // Create the full payload for submission
      const payload = {
        test_id: quizId,
        sections: sections,
        purchaseCode: purchaseCode
      };

      console.log("Submitting quiz with payload:", payload);

      // Use the submit endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/entrytest/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to submit quiz results");
      }

      // Set the evaluation result state
      setEvaluationResult(data.data);

      // Clear the saved state and purchase code
      localStorage.removeItem(`quizState_${topic}`);
      localStorage.removeItem("purchaseCode");

      console.log("Quiz submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      setSubmitError(
        error.message || "Failed to submit quiz results. Please try again."
      );
    } finally {
      setSubmittingResults(false);
      setIsSubmitting(false); // Add this line to clear loading state
    }
  };

  const handleSubmit = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const timeTaken = 900 - timeRemaining; // Calculate time taken in seconds

      // Submit answers to server for evaluation
      submitResultsToServer(timeTaken);

      setIsCalculating(false);
      setShowResults(true);
    }, 2000); // 2 second calculation animation
  };
  const progressPercentage = (currentQuestion / questions.length) * 100;

  if (loading) return <QuizLoading />;

  if (error) return <QuizError error={error} />;

  if (!questions || questions.length === 0) return <QuizNoQuestions />;

  return (
    <div className="flex flex-col bg-gray-50 p-4 w-full items-center min-h-screen">
      <QuizHeader
        topic={quizData?.quizName || topic}
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        showResults={showResults}
        isCalculating={isCalculating}
      />

      {/* Progress bar */}
      {!showResults && !isCalculating && (
        <div className="bg-gray-200 h-2 rounded-full w-full max-w-3xl mb-6 overflow-hidden">
          <motion.div
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Main content area */}
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isCalculating ? (
  <QuizLoading message="Calculating Results" />
) : !showResults ? (
  <QuizQuestionSection
    questions={questions}
    currentQuestion={currentQuestion}
    answers={answers}
    explanations={explanations}
    slideDirection={slideDirection}
    handleAnswerSelect={handleAnswerSelect}
    handleExplanationChange={handleExplanationChange}
    goToNextQuestion={goToNextQuestion}
    goToPrevQuestion={goToPrevQuestion}
    handleSubmit={handleSubmit}
  />
) : (
  <QuizResultSection
    topic={quizData?.quizName || topic}
    evaluationResult={evaluationResult}
    timeTaken={900 - timeRemaining}
    submitError={submitError}
    isSubmitting={isSubmitting} // Pass the loading state
  />
)}
      </motion.div>
    </div>
  );
};

export default QuizTestPage;
