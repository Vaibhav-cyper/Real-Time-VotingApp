import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/contexts/SocketContext";
import Cookies from "js-cookie";
import Chart from "@/components/Chart";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { votes, total, percentages } = useSocket();
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "pie">("pie");

  // Check loggin session
  useCallback(async () => {
    try {
      setLoading(true);
      const savedName = Cookies.get("username");
      setLoading(false);
      if (savedName) {
        navigate("/vote");
      } else {
        // If session is invalid, redirect to login
        setLoading(false);
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      console.error("Error checking session:", err);
      navigate("/");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Voting Results</h1>
            <div className="flex items-center space-x-4">
              {/* Chart type toggle */}
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                    chartType === "bar"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setChartType("pie")}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                    chartType === "pie"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Pie Chart
                </button>
              </div>
            </div>
          </div>

          {/* Vote counts and percentages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {(["A", "B", "C"] as const).map((option) => (
              <div key={option} className="bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Option {option}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">{votes?.[option] ?? 0}</div>
                <div className="text-sm text-gray-600">
                  {percentages?.[option] ?? 0}% of {total} votes
                </div>
              </div>
            ))}
          </div>

          {/* Chart visualization */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Visual Results</h2>
            {total > 0 && votes ? (
              <Chart data={votes} type={chartType} />
            ) : (
              <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-50">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">No votes yet</p>
                  <p className="text-gray-400 text-sm">Results will appear here once voting begins</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/vote")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Voting
            </button>
            {/* <button
              onClick={fetchVotes}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Refresh Results
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
