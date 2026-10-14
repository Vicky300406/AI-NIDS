import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (username === 'admin' && password === 'Admin@1234') {
        localStorage.setItem('token', 'dummy-token');
        onLogin();
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark-900 grid-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-500 rounded-full"
            style={{
              left: `${(i * 5 + 10) % 100}%`,
              top: `${(i * 7 + 5) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl border border-dark-700">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 mb-4 glow"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 212, 255, 0.3)',
                  '0 0 40px rgba(0, 212, 255, 0.5)',
                  '0 0 20px rgba(0, 212, 255, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Shield className="w-8 h-8 text-dark-900" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">AI-Powered NIDS</span>
            </h1>
            <p className="text-dark-400">Network Intrusion Detection System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/20 border border-danger-500/30 text-danger-500"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-11"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? 'Authenticating...' : 'Login'}
              </span>
              {loading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg bg-dark-700/50 border border-dark-600">
            <p className="text-xs text-dark-400 text-center mb-2">Default Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-dark-400">Username:</span>
                <span className="ml-2 text-primary-500 font-mono">admin</span>
              </div>
              <div>
                <span className="text-dark-400">Password:</span>
                <span className="ml-2 text-primary-500 font-mono">Admin@1234</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-dark-500 mt-6">
          AI-Powered Network Intrusion Detection System v1.0
        </p>
      </motion.div>
    </div>
  );
}
