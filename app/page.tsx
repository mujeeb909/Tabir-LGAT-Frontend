"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col bg-white p-6 items-center min-h-screen sm:p-12">
            {/* Top Logo */}

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col bg-gray-50 p-8 rounded-xl shadow-lg w-full items-center max-w-7xl mt-8 sm:flex-row sm:p-12"
            >
                {/* Left Side - Centered Text Content */}
                <div className="flex flex-col justify-center w-full items-start sm:w-1/2">
                    <h1 className="text-4xl text-gray-900 text-left font-bold">LGAT Mock AI Test</h1>
                    <p className="text-gray-600 text-left text-lg mt-2">
                        Prepare for your LGAT exam with AI-powered mock tests. Get instant results and performance analysis!
                    </p>

                    {/* Start Test Button */}
                    <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }} className="mt-6">
                        <Link
                            href="/quiz"
                            className="bg-primary rounded-lg shadow-md text-lg text-white font-semibold hover:opacity-90 px-6 py-3 transition"
                        >
                            Start Test
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side - Full Image */}
                <div className="flex justify-center w-full sm:w-1/2">
                    <div className="h-80 rounded-lg w-full overflow-hidden relative sm:h-[450px]">
                    <Image src="/heroSlide1-optimized.png" alt="Hero Image" fill className="object-cover" />

                    </div>
                </div>

            </motion.div>

            <div className="grid gap-6 mt-12 sm:grid-cols-3">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex flex-col bg-white/20 border border-white/10 p-6 rounded-xl shadow-lg backdrop-blur-lg items-center"
                    >
                        <Image src={feature.icon} alt="Feature Icon" width={60} height={60} className="drop-shadow-lg" />
                        <h3 className="text-gray-600 text-lg font-semibold mt-4">{feature.title}</h3>
                        <p className="text-center text-gray-600/80 text-sm">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const features = [
    {
        title: "Fast, Fun & Effective Learning",
        description: "Engaging quizzes and AI-powered feedback to accelerate your learning.",
        icon: "/fastnfun.svg"
    },
    {
        title: "100 Million Concepts Learned",
        description: "Access a vast knowledge base and master concepts with ease.",
        icon: "/concepts.svg"
    },
    {
        title: "Anytime, Anywhere",
        description: "Learn on the go with mobile-friendly tests and instant feedback.",
        icon: "/anywhere.svg"
    }
];
