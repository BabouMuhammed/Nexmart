import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Check, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { register } from '../services/api';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  const passwordStrength = {
    hasLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const isPasswordValid =
    passwordStrength.hasLength &&
    passwordStrength.hasUppercase &&
    passwordStrength.hasNumber;

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.fullName,
        formData.email,
        formData.password
      );
      if (result.message === 'success') {
        setStep(2);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B2D] flex items-center justify-center relative overflow-hidden">
      {/* Ambient Blobs */}
      <div className="glow-blob glow-blob-cyan absolute top-20 left-10 w-96 h-96" />
      <div className="glow-blob glow-blob-purple absolute bottom-10 right-20 w-96 h-96" />

      {/* Purple Circle Decorators */}
      <div className="circle-decorator absolute top-10 right-20 w-40 h-40" />
      <div className="circle-decorator absolute bottom-20 left-10 w-32 h-32" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {step === 1 ? (
          <GlassCard className="p-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="p-3 rounded-lg bg-[#00E5D4] text-[#050B2D]">
                <User className="w-6 h-6" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Create Account
            </h1>
            <p className="text-[#A0AEC0] text-center mb-8">
              Join NexMart and start shopping
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4 mb-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Muhammed Babou"
                    className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                    required
                  />
                </div>

                {/* Password Strength */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        passwordStrength.hasLength
                          ? 'bg-green-500'
                          : 'bg-[#64748B]'
                      }`}
                    />
                    <span className="text-xs text-[#A0AEC0]">
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        passwordStrength.hasUppercase
                          ? 'bg-green-500'
                          : 'bg-[#64748B]'
                      }`}
                    />
                    <span className="text-xs text-[#A0AEC0]">
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        passwordStrength.hasNumber
                          ? 'bg-green-500'
                          : 'bg-[#64748B]'
                      }`}
                    />
                    <span className="text-xs text-[#A0AEC0]">Number</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                    required
                  />
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-400 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs text-[#A0AEC0]">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-[#00E5D4] hover:underline">
                  Terms of Service
                </a>
              </p>

              {/* Sign Up Button */}
              <NeonButton
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                type="submit"
                disabled={!isPasswordValid || !passwordsMatch}
                className="gap-2 mt-6"
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </NeonButton>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-[#A0AEC0]">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#00E5D4] hover:text-[#06B6D4] font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </GlassCard>
        ) : (
          /* Success Screen */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <GlassCard className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-400" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">
                Account Created!
              </h2>
              <p className="text-[#A0AEC0] mb-8">
                Your account has been successfully created. You can now sign in
                to your account.
              </p>

              <NeonButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
                className="gap-2"
              >
                Go to Login
                <ArrowRight className="w-5 h-5" />
              </NeonButton>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
