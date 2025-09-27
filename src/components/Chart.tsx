
import { useEffect, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

import type { ChartOptions, TooltipItem } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import type { VoteData } from "@/types/api";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface ChartProps {
  data: VoteData;
  type: "bar" | "pie";
}

export default function Chart({ data, type }: ChartProps) {
  const barChartRef = useRef<ChartJS<"bar"> | null>(null);
  const pieChartRef = useRef<ChartJS<"pie"> | null>(null);

  // Calculate total votes
  const total = data.A + data.B + data.C;

  // Prepare chart data
  const chartData = {
    labels: ["Option A", "Option B", "Option C"],
    datasets: [
      {
        label: "Votes",
        data: [data.A, data.B, data.C],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // Blue
          "rgba(16, 185, 129, 0.8)", // Green
          "rgba(245, 101, 101, 0.8)", // Red
        ],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)", "rgba(245, 101, 101, 1)"],
        borderWidth: 2,
      },
    ],
  };

  // Chart options for responsiveness and styling
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Voting Results (${total} total votes)`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar" | "pie">) {
            const value = typeof context.parsed === "number" ? context.parsed : context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return `${context.label}: ${value} votes (${percentage}%)`;
          },
        },
      },
    },
  };

  // Type-specific options
  const barOptions: ChartOptions<"bar"> = {
    ...baseOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Number of Votes",
        },
      },
      x: {
        title: {
          display: true,
          text: "Options",
        },
      },
    },
  };

  const pieOptions: ChartOptions<"pie"> = {
    ...baseOptions,
  };

  // Handle chart updates when data changes
  useEffect(() => {
    const currentRef = type === "bar" ? barChartRef.current : pieChartRef.current;
    if (currentRef) {
      currentRef.update("none"); // Update without animation for real-time updates
    }
  }, [data, type]);

  // Show message when no votes have been cast
  if (total === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border rounded-lg bg-gray-50">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <p className="text-gray-500 text-lg font-medium">No votes cast yet</p>
        <p className="text-gray-400 text-sm">Results will appear here once voting begins</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 p-4 border rounded-lg bg-white shadow-sm">
      {type === "bar" ? (
        <Bar ref={barChartRef} data={chartData} options={barOptions} />
      ) : (
        <Pie ref={pieChartRef} data={chartData} options={pieOptions} />
      )}
    </div>
  );
}
