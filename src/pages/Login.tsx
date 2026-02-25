import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import JaneButton from "../components/JaneButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session) {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200/90 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
      {/* Modal Container */}
      <div className="relative bg-primary rounded-[2rem] px-12 py-10 w-full max-w-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-white hover:bg-pink transition-colors shadow-lg"
        >
          <X className="h-7 w-7" strokeWidth={3} />
        </button>

        {/* Title */}
        <h2 className="font-montserrat text-center text-4xl md:text-5xl font-black text-white mb-12 tracking-tight uppercase">
          Connecte toi !
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8">
          {/* Input Fields Container */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-jane-purple" strokeWidth={2.5} />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-64 pl-12 pr-4 py-3 rounded-full bg-white text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="email@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-jane-purple" strokeWidth={2.5} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-64 pl-12 pr-24 py-3 rounded-full bg-white text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Forgot Password Link */}
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-light transition-colors uppercase tracking-wide"
              >
                J'ai oublié
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-white text-sm text-center bg-red-500/30 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            {/* Register Button */}
            <JaneButton to="/register" size="sm">
              Inscrivez-vous
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M17 7H7M17 7v10"
                />
              </svg>
            </JaneButton>

            {/* Login Button */}
            <JaneButton type="submit" size="sm" className="px-10">
              Connexion
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 7L7 17M7 17h10M7 17V7"
                />
              </svg>
            </JaneButton>
          </div>
        </form>
      </div>
    </div>
  );
}
