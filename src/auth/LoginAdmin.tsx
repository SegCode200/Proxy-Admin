import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import useLoginStore from "@/store/useLoginStore"; // Zustand store (below)
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { login } from "@/global/authActions";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setIsloading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { email, password, setEmail, setPassword, validateForm } =
    useLoginStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const validationError = showValidation
    ? validateForm()
    : { isValid: true, error: null };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(true);
    setShowValidation(true);

    const validation = validateForm();
    if (!validation.isValid) {
      setIsloading(false);
      return;
    }

    try {
      const result = await dispatch(login(email, password));
      console.log("res", result);

      // If we get here, login was successful
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have been logged in successfully.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle specific error cases
      let errorMessage = "An error occurred during login.";
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsloading(false);
      // Don't reset the form on error to let the user see their input
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md sm:max-w-md">
        <h1 className="mb-2 text-2xl font-bold text-center text-blue-600">
          Proxy
        </h1>
        <p className="mb-6 text-center text-gray-600">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-bold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-lg text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-bold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 text-lg text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>
          {!validationError?.isValid && validationError?.error && (
            <p className="mb-3 text-sm text-red-500">{validationError.error}</p>
          )}
          {/* Submit */}
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition${
              loading ? "bg-opacity-40" : "bg-opacity-0"
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
