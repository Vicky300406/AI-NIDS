import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, Activity, AlertTriangle, BarChart3, Network, 
  LogOut, Menu, X, ChevronRight, Play, Pause 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/network-detection', label: 'Network Detection', icon: Network },
  { path: '/live-monitor', label: 'Live Monitor', icon: Activity },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/ml-analytics', label: 'ML Analytics', icon: Shield },
];

export default function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 grid-background">
      {/* Animated scan line */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-20 scan-line" />
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 h-full w-64 glass border-r border-dark-700 z-40 overflow-y-auto"
          >
            {/* Logo */}
            <div className="p-6 border-b border-dark-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center glow">
                  <Shield className="w-6 h-6 text-dark-900" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-dark-50">AI-NIDS</h1>
                  <p className="text-xs text-dark-400">Network Security</p>
                </div>
              </div>
            </div>

            {/* Monitoring Status */}
            <div className="p-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  isMonitoring
                    ? 'bg-success-500/20 border border-success-500/30 text-success-500'
                    : 'bg-dark-700 border border-dark-600 text-dark-300 hover:border-primary-500/30'
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isMonitoring ? 'Monitoring' : 'Start Monitor'}
                </span>
                {isMonitoring && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-success-500"
                  />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-500 border border-primary-500/30'
                        : 'text-dark-300 hover:bg-dark-700 hover:text-dark-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-primary-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700 bg-dark-800/50">
              <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-dark-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-dark-900">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark-50 truncate">Admin</p>
                  <p className="text-xs text-dark-400">Administrator</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-danger-500/20 text-danger-500 border border-danger-500/30 hover:bg-danger-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-dark-700">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-dark-700 transition-all"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isMonitoring ? 'bg-success-500/20 text-success-500' : 'bg-dark-700 text-dark-400'
              }`}>
                <motion.div
                  animate={isMonitoring ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-success-500' : 'bg-dark-500'}`}
                />
                <span className="text-sm font-semibold">
                  {isMonitoring ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
