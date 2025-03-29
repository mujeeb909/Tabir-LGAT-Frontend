"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGetTopicsQuery, useVerifyPurchaseCodeMutation } from "@/lib/api";
import { AlertCircle, Loader2 } from "lucide-react";

const QuizPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const router = useRouter();
  const [purchaseCode, setPurchaseCode] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: topics, isLoading, isError } = useGetTopicsQuery(undefined);
  const topicList = topics?.topics || [];

  const [verifyPurchaseCode, { isLoading: isVerifying }] = useVerifyPurchaseCodeMutation();

  const handleTopicClick = (topic: any) => {
    setSelectedTopic(topic);
    setShowDescription(true);
    setIsModalOpen(false);
    setPurchaseCode("");
    setError("");
  };

  const openPurchaseModal = () => {
    setIsModalOpen(true);
    setShowDescription(false);
  };

  const handleVerifyPurchaseCode = async () => {
    if (!purchaseCode.trim()) {
      setError("Please enter a purchase code.");
      return;
    }

    try {
      const response = await verifyPurchaseCode({
        code:purchaseCode
      }).unwrap();

      if (response.success) {
        setIsModalOpen(false);
         localStorage.setItem('purchaseCode',purchaseCode);
         localStorage.setItem('topicId',selectedTopic._id);

        router.push(`/quiz/${selectedTopic.name}`);
      } else {
        setError(response.message || "Invalid Purchase Code! Try again.");
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to verify the code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col bg-white p-6 items-center min-h-screen sm:p-12">
      <h1 className="text-2xl text-black font-bold">Topics</h1>

      {isLoading && (
        <div className="flex justify-center items-center mt-6">
          <motion.div
            className="bg-primary h-3 rounded-full w-3 mx-1"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          />
          <motion.div
            className="bg-primary h-3 rounded-full w-3 mx-1"
            animate={{ y: [0, -8, 0] }}
            transition={{ delay: 0.2, repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          />
          <motion.div
            className="bg-primary h-3 rounded-full w-3 mx-1"
            animate={{ y: [0, -8, 0] }}
            transition={{ delay: 0.4, repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          />
        </div>
      )}

      {isError && (
        <div className="flex bg-red-100 border border-red-400 rounded-lg text-red-700 items-center mt-6 px-4 py-3">
          <AlertCircle className="h-5 text-red-700 w-5 mr-2" />
          <span>Failed to load topics. Please try again later.</span>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 gap-6 mt-6 sm:grid-cols-4">
          {topicList.map((topic: any) => (
            <motion.div
              key={topic._id}
              onClick={() => handleTopicClick(topic)}
              whileHover={{ scale: 1.05 }}
              className={`p-6 bg-gray-50 rounded-lg shadow-md cursor-pointer border-2 transition ${
                selectedTopic?._id === topic._id ? "border-primary" : "hover:border-gray-300"
              }`}
            >
              <h2 className="text-gray-800 text-lg font-semibold">{topic.name}</h2>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showDescription && selectedTopic && (
          <motion.div
            className="bg-white border p-6 rounded-lg shadow-lg text-center w-full mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-gray-600 text-xl font-semibold">{selectedTopic.name}</h2>
            <p className="text-gray-600 mt-2">{selectedTopic.description}</p>
            <button
              onClick={openPurchaseModal}
              className="bg-primary rounded-lg text-white cursor-pointer mt-4 px-6 py-2"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="flex bg-opacity-70 bg-white justify-center fixed inset-0 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg text-center w-80"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-gray-600 text-xl font-semibold mb-4">Enter Purchase Code</h2>
              <input
                type="text"
                value={purchaseCode}
                onChange={(e) => setPurchaseCode(e.target.value)}
                className="border border-black p-2 rounded-lg text-black w-full"
                placeholder="Enter code..."
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 rounded-lg text-black cursor-pointer px-4 py-2"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPurchaseCode}
                  className="flex bg-primary justify-center rounded-lg text-white w-28 cursor-pointer items-center px-4 py-2"
                  disabled={loading}
                >
                  {isVerifying ? (
                    <motion.div
                      className="animate-spin"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader2 className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    "Start Test"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
