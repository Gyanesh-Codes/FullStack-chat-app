import React from 'react'
import { useState } from 'react';
import {useAuthStore} from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern.jsx';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const[formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };
  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-[#7480ff]/10 flex items-center justify-center group-hover:bg-[#7480ff]/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-[#7480ff]" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <label className="input flex items-center gap-2 w-full bg-base-100 border border-gray-600 focus-within:border-[#7480ff] focus-within:ring-1 focus-within:ring-[#7480ff] transition-all">
                <Mail className="size-5 text-base-content/40" />
                <input
                  type="email"
                  className="grow"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </label>
            </div>

            {/* PASSWORD */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <label className="input flex items-center gap-2 w-full bg-base-100 border border-gray-600 focus-within:border-[#7480ff] focus-within:ring-1 focus-within:ring-[#7480ff] transition-all">
                <Lock className="size-5 text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="grow"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="flex items-center text-base-content/40 hover:text-base-content/80"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </label>
            </div>

            <button type="submit" className="btn w-full bg-[#7480ff] hover:bg-[#6470ff] text-white font-semibold border-none" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link text-[#7480ff] hover:text-[#6470ff]">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage
