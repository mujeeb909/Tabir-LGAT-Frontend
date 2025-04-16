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

            {/* Features Section */}
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

            {/* Contact Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-7xl mt-16 mb-8 bg-gray-50 rounded-xl shadow-lg overflow-hidden"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Contact Info */}
                    <div className="p-8 bg-primary text-white md:w-1/2">
                        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                        <p className="mb-6">
                            Have questions about our LGAT mock tests or need additional information?
                            Reach out to us directly for order confirmation and inquiries.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Phone Numbers</p>
                                    <p>+92 332 1407000</p>
                                    <p>+92 305 4491988</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="font-medium">WhatsApp</p>
                                    <p>Message us for quick responses</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Tabir Academy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Image & CTA */}
                    <div className="p-8 bg-white md:w-1/2">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to ace your LGAT exam?</h3>
                        <p className="text-gray-600 mb-6">
                            Take our AI-powered mock tests to improve your chances of success.
                            Contact us for special packages and educational guidance.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <a
                                href="https://wa.me/923321407000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-5 rounded-lg font-medium hover:bg-green-600 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                </svg>
                                WhatsApp Us
                            </a>
                            <a
                                href="tel:+923321407000"
                                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 px-5 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                                </svg>
                                Call Us
                            </a>
                        </div>

                        <div className="mt-8 flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >

                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="w-full text-center p-4 text-gray-500 text-sm">
                © {new Date().getFullYear()} Tabir Academy. All rights reserved.
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
