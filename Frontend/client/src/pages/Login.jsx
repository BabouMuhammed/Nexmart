import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
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
        <GlassCard className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 rounded-lg bg-[#00E5D4] text-[#050B2D]">
              <Mail className="w-6 h-6" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Welcome back
          </h1>
          <p className="text-[#A0AEC0] text-center mb-8">
            Sign in to your NexMart account
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
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-[#A0AEC0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0B143D] border border-[rgba(0,229,212,0.2)] rounded-lg pl-10 pr-12 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00E5D4]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#A0AEC0] hover:text-[#00E5D4] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

          

            {/* Sign In Button */}
            <NeonButton
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              type="submit"
              className="gap-2 mt-6"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </NeonButton>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-[#A0AEC0]">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#00E5D4] hover:text-[#06B6D4] font-semibold transition-colors"
            >
              Create one
            </button>
          </p>
        </GlassCard>

      </motion.div>
    </div>
  );
}
