import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/contexts/SocketContext"; 
export default function LoginPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { connect } = useSocket(); 

  // Check if user already has a valid session
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const savedName = Cookies.get("username");
        if (savedName) {
          navigate("/vote");
          return;
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();
  }, []);

  // Client-side form validation
  const validateName = (inputName: string): string | null => {
    const trimmedName = inputName.trim();

    if (trimmedName.length === 0) {
      return "Name is required";
    }

    if (trimmedName.length > 50) {
      return "Name must be 50 characters or less";
    }

    // Check for potentially harmful characters
    if (/[<>"'&()\/]/.test(trimmedName)) {
      return "Name contains invalid characters";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Validate input
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
      Cookies.set("username", name.trim(), { expires: inFiveMinutes }); // expires in 7 days
      connect(); // connect to websocket server
      navigate("/vote");
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  // Show loading spinner while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join the Vote</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your name to participate in the voting</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="sr-only">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                error ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              disabled={isLoading}
              maxLength={50}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading || !name.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              } transition-colors duration-200`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Continue to Vote"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">Your name will be used for session management only</p>
        </div>
      </div>
    </div>
  );
}
