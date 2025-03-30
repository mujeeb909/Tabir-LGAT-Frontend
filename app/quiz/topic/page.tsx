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
  section_id: string;
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

const formatSubmissionPayload = (originalQuizData, questions, userAnswers, explanations) => {
  // Create a deep copy of the original quiz data structure
  const submissionPayload = JSON.parse(JSON.stringify(originalQuizData));

  // Create a map to easily look up user answers by question ID
  const answersMap = {};
  const explanationsMap = {};

  // Map the answers and explanations to question IDs
  questions.forEach((question, index) => {
    if (userAnswers[index] !== undefined) {
      answersMap[question.id] = userAnswers[index];
    }
    if (explanations[index]) {
      explanationsMap[question.id] = explanations[index];
    }
  });

  // Add user responses to each question in each section
  submissionPayload.sections.forEach(section => {
    section.questions.forEach(question => {
      const questionId = question.question_id;
      const userAnswer = answersMap[questionId];
      const userExplanation = explanationsMap[questionId];
      const isEssay = question.question_type === 'essay';

      if (userAnswer !== undefined) {
        // User answered this question
        question.user_response = {
          selected_option_id: isEssay ? null : userAnswer,
          logic_response: userExplanation || null,
          time_taken: Math.floor(Math.random() * 60) + 15 // Random time between 15-75 seconds
        };
      } else {
        // No response from user
        question.user_response = {
          selected_option_id: null,
          logic_response: null,
          time_taken: null
        };
      }
    });
  });

  return submissionPayload;
};

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

        // Use the quiz endpoint to fetch questions
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/entrytest`
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
  }, [topic]);

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
    setIsSubmitting(true);
    setSubmitError("");

    // Get purchase code from local storage if available
    const purchaseCode = localStorage.getItem("purchaseCode") || "";

    // Store the original quiz data structure from the API
    const originalQuizData = {
      test_id: quizData.quizId,
      test_name: quizData.quizName,
      description: quizData.description,
      sections: []
    };

    // Group questions by section to recreate the original structure
    const sectionMap = {};

    // First, group questions by section
    questions.forEach(question => {
      const sectionId = question.section_id;
      const sectionName = question.section;

      if (!sectionMap[sectionId]) {
        sectionMap[sectionId] = {
          section_id: sectionId,
          section_name: sectionName,
          questions: []
        };
      }

      // Add question to the appropriate section
      sectionMap[sectionId].questions.push({
        question_id: question.id,
        question_text: question.text,
        question_type: question.type,
        category: question.category,
        difficulty: question.difficulty,
        options: question.options.map(option => ({
          option_id: option.id,
          option_text: option.text
        })),
        correct_answer: question.correctAnswer,
        user_response: {
          selected_option_id: null,
          logic_response: null,
          time_taken: null
        }
      });
    });

    // Convert section map to array and add to the original structure
    originalQuizData.sections = Object.values(sectionMap);

    // Format the submission payload with user answers - pass questions array directly
    const submissionPayload = formatSubmissionPayload(originalQuizData, questions, answers, explanations);

    // Add purchase code if available
    if (purchaseCode) {
      submissionPayload.purchaseCode = purchaseCode;
    }

    console.log("Submitting quiz with payload:", submissionPayload);

    // Use the submit endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/entrytest/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionPayload),
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
    localStorage.removeItem("topicId");

    console.log("Quiz submitted successfully:", data);
  } catch (error) {
    console.error("Error submitting quiz results:", error);
    setSubmitError(
      error.message || "Failed to submit quiz results. Please try again."
    );
  } finally {
    setSubmittingResults(false);
    setIsSubmitting(false);
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
