// src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      navigate("/dashboard/overview");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-300 flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size[32px_32px] pointer-events-none" />
      
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-indigo-500/8 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-stone-900/80 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-2xl">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wide mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          Secure Auth System
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          {mode === "login"
            ? "Sign in to access your financial intelligence dashboard."
            : "Start analyzing your bank statements with AI."}
        </p>

        {/* Toggle */}
        <div className="flex gap-1 bg-white/4 border border-white/7 rounded-xl p-1 mb-6">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === m
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest font-mono mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/4 border border-white/9 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest font-mono mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/4 border border-white/9 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-colors"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest font-mono mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/4 border border-white/9 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-xs text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-500 border border-indigo-500 text-white text-sm font-bold transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p className="text-center text-xs text-stone-600 mt-5">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}