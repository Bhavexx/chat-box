import { useState } from "react";
import { supabase } from "../services/supabase";
import { Eye, EyeOff, Lock, Mail, UserPlus, ArrowLeft } from "lucide-react";

export default function Signup({ setUser, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else if (data?.user?.identities?.length === 0) {
      setError("User already exists. Try logging in instead.");
    } else {
      alert("Success! Check your email for a confirmation link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
        <button 
          onClick={onBack}
          className="flex items-center text-purple-200 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <UserPlus className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-purple-200">Start your journey with us today</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-purple-300 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-purple-300 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-white/5 border border-white/10 p-3 pl-10 pr-10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-purple-300 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-purple-300 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-white/5 border border-white/10 p-3 pl-10 pr-10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-purple-100 transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-lg shadow-black/20"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-purple-300/60 uppercase tracking-widest">
          Secure Registration via Supabase
        </p>
      </div>
    </div>
  );
}
