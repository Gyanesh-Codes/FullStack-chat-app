import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Lock, Eye, EyeOff, Mail, MessagesSquare, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern.jsx';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be atleast 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("1. Button clicked! Form data:", formData);

    const success = validateForm();
    console.log("2. Validation result:", success);

    if(success===true) 
      {
      console.log("3. Validation passed! Calling signup function...");
      signup(formData);
      }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        
        {/* LOGO */}
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              {/* Replace your logo div with this: */}
              <div className='size-12 rounded-xl bg-[#7480ff]/10 flex items-center justify-center group-hover:bg-[#7480ff]/20 transition-colors'>
                <MessagesSquare className='size-6 text-[#7480ff]' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
              <p className='text-base-content/60'>Get Started with your free account</p>
            </div>
          </div>
          
          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <label className="input flex items-center gap-2 w-full bg-base-100 border border-gray-600 focus-within:border-[#7480ff] focus-within:ring-1 focus-within:ring-[#7480ff] transition-all">
                <User className="size-5 text-base-content/40" />
                <input
                  type="text"
                  className="grow"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </label>
            </div>

            {/* EMAIL */}
            <div className='form-control'>
              <label className="label">
                <span className='label-text font-medium'>Email</span>
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
            <div className='form-control'>
              <label className="label">
                <span className='label-text font-medium'>Password</span>
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
                  type='button'
                  className='flex items-center text-base-content/40 hover:text-base-content/80'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='size-5' />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type='submit'
              className='btn w-full bg-[#7480ff] hover:bg-[#6470ff] text-white font-semibold border-none'
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          
          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account?{" "}
              <Link to="/login" className="link text-[#7480ff] hover:text-[#6470ff]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern 
        title="Join our community" 
        subtitle="Connect with Friends, share moments, and stay in touch with your loved ones."
      /> 

    </div>
  );
};

export default SignUpPage;