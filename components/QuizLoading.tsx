import { motion } from "framer-motion";

const spinTransition = {
  loop: Infinity,
  ease: "linear",
  duration: 1,
};

interface QuizLoadingProps {
  message?: string;
}

const QuizLoading: React.FC<QuizLoadingProps> = ({
  message = "Loading Quiz"
}) => {
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
        className="border-4 border-primary border-t-transparent h-16 rounded-full w-16 mb-6"
      />
      <h2 className="text-gray-800 text-xl font-semibold mb-2">
        {message}
      </h2>
      <p className="text-gray-600">
        {message === "Loading Quiz"
          ? "Please wait while we prepare your questions..."
          : "Please wait while we process your answers..."}
      </p>
    </div>
  );
};

export default QuizLoading;
