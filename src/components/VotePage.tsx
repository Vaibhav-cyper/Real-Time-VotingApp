"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { VoteOption } from "@/types/api";
import { useSocket } from "@/contexts/SocketContext";

const VOTE_OPTIONS: { value: VoteOption; label: string; description: string }[] = [
  { value: "A", label: "Option A", description: "Choose this option" },
  { value: "B", label: "Option B", description: "Choose this option" },
  { value: "C", label: "Option C", description: "Choose this option" },
];

export default function VotePage() {
  const [selectedOption, setSelectedOption] = useState<VoteOption | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { castVote } = useSocket();

  // Check session status on component mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        const savedName = Cookies.get("username");
        if (savedName) {
          setUserName(savedName);
          navigate("/vote");
          return;
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        navigate("/");
      } finally {
        setIsCheckingSession(false);
      }
    };

    validateSession();
  }, [navigate]);

  const handleOptionChange = (option: VoteOption) => {
    setSelectedOption(option);
    // Clear any previous errors when user makes a selection
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate selection
    if (!selectedOption) {
      setError("Please select an option before submitting your vote.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      castVote(selectedOption);

      navigate("/results");
    } catch (error) {
      console.error("Vote submission error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
            role="status"
            aria-label="Loading"
          ></div>
          <p className="mt-2 text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Cast Your Vote</h2>
          {userName && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome, <span className="font-medium">{userName}</span>
            </p>
          )}
          <p className="mt-2 text-center text-sm text-gray-600">Select one of the options below</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <fieldset>
              <legend className="sr-only">Vote Options</legend>
              {VOTE_OPTIONS.map((option) => (
                <div key={option.value} className="relative">
                  <label
                    htmlFor={`option-${option.value}`}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedOption === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      id={`option-${option.value}`}
                      name="vote-option"
                      type="radio"
                      value={option.value}
                      checked={selectedOption === option.value}
                      onChange={() => handleOptionChange(option.value)}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </label>
                </div>
              ))}
            </fieldset>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !selectedOption}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting || !selectedOption
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              } transition-colors duration-200`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Vote...
                </div>
              ) : (
                "Submit Vote"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">You can only vote once per session</p>
        </div>
      </div>
    </div>
  );
}
