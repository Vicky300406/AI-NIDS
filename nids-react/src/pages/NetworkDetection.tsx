import { motion } from 'framer-motion';
import { Wifi, Signal, HardDrive, TrendingUp } from 'lucide-react';
import { mockData } from '../services/api';

export default function NetworkDetection() {
  const interfaces = mockData.networkInterfaces();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Network Detection</h1>
        <p className="text-dark-400">Active network interfaces and traffic analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {interfaces.map((iface, index) => (
          <motion.div
            key={iface.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary-500/20">
                  <Wifi className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{iface.name}</h3>
                  <p className="text-sm text-dark-400">{iface.type}</p>
                </div>
              </div>
              <span className={`badge ${
                iface.status === 'active' ? 'badge-low' : 'badge-critical'
              }`}>
                {iface.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-dark-400 mb-1">IP Address</p>
                <p className="font-mono text-primary-500">{iface.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm text-dark-400 mb-1">MAC Address</p>
                <p className="font-mono text-sm text-dark-300">{iface.macAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-dark-700/50 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-500">
                  {(iface.bytesSent / 1024 / 1024).toFixed(1)} MB
                </p>
                <p className="text-xs text-dark-400">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success-500">
                  {(iface.bytesReceived / 1024 / 1024).toFixed(1)} MB
                </p>
                <p className="text-xs text-dark-400">Received</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-dark-300">
                <Signal className="w-4 h-4" />
                {iface.speed} Mbps
              </div>
              <div className="flex items-center gap-2 text-dark-300">
                <TrendingUp className="w-4 h-4" />
                {iface.packetsSent.toLocaleString()} pkts
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
