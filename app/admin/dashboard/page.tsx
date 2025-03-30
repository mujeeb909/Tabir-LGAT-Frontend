"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RootState } from "../../../store/store";
import { useGenerateTokenMutation, useGetTokensQuery } from "../../../lib/api";


interface PurchaseCode {
  code: string;
  isUsed: boolean;
}
const Dashboard = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [generateToken] = useGenerateTokenMutation();
  const { data: tokens, refetch } = useGetTokensQuery();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/admin/login");
  };

  const handleGenerateToken = async () => {
    try {
      await generateToken().unwrap();
      refetch();

      // Show success message
      setSuccessMessage("Purchase Code Generated Successfully!");

      // Hide message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error generating token:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white p-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Generate Token Button */}
      <button
        onClick={handleGenerateToken}
        className="mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
      >
        Generate Purchase Code
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 bg-green-500 text-white p-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="mt-6 w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-black">
          Generated Tokens
        </h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-black">Token</th>
              <th className="border border-gray-300 p-2 text-black">Usage</th>
            </tr>
          </thead>
          <tbody>
            {tokens?.purchaseCodes?.map((token: PurchaseCode, index: number) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2 text-black">
                  {token.code}
                </td>
                <td className="border border-gray-300 p-2 text-black">
                  {token.isUsed ? "Used" : "Not Used"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
