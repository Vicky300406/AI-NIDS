import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, ArrowUpDown, Clock, Database } from 'lucide-react';
import { mockData } from '../services/api';

export default function LiveMonitor() {
  const [packets, setPackets] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, normal: 0, malicious: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate incoming packet
      const newPacket = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        srcIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        dstIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
        size: Math.floor(Math.random() * 1500) + 64,
        status: Math.random() > 0.15 ? 'Normal' : 'Malicious',
      };

      setPackets((prev) => [newPacket, ...prev].slice(0, 50));
      setStats((prev) => ({
        total: prev.total + 1,
        normal: prev.normal + (newPacket.status === 'Normal' ? 1 : 0),
        malicious: prev.malicious + (newPacket.status === 'Malicious' ? 1 : 0),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Live Network Monitor</h1>
        <p className="text-dark-400">Real-time packet inspection and classification</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-br from-primary-500/20 to-primary-500/5 border-primary-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Packets</p>
              <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
            </div>
            <Database className="w-12 h-12 text-primary-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-success-500/20 to-success-500/5 border-success-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Normal Traffic</p>
              <p className="text-3xl font-bold text-success-500">{stats.normal.toLocaleString()}</p>
            </div>
            <Activity className="w-12 h-12 text-success-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-danger-500/20 to-danger-500/5 border-danger-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Malicious Traffic</p>
              <p className="text-3xl font-bold text-danger-500">{stats.malicious.toLocaleString()}</p>
            </div>
            <Wifi className="w-12 h-12 text-danger-500 opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Packet Stream */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" />
            Live Packet Stream
          </h3>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-success-500"
          >
            <div className="w-2 h-2 rounded-full bg-success-500" />
            <span className="text-sm font-semibold">LIVE</span>
          </motion.div>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {packets.map((packet, index) => (
              <motion.div
                key={packet.id}
                initial={{ opacity: 0, x: -50, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 50, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border ${
                  packet.status === 'Malicious'
                    ? 'bg-danger-500/10 border-danger-500/30'
                    : 'bg-dark-700/50 border-dark-600'
                } hover:border-primary-500/30 transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`badge ${
                      packet.status === 'Malicious' ? 'badge-critical' : 'badge-low'
                    }`}>
                      {packet.status}
                    </span>
                    <span className="text-xs text-dark-400">{packet.protocol}</span>
                    <span className="text-xs text-dark-400">{packet.size} bytes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-dark-400">
                    <Clock className="w-3 h-3" />
                    {packet.timestamp}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-primary-500">{packet.srcIp}</span>
                  <ArrowUpDown className="w-3 h-3 text-dark-500" />
                  <span className="text-primary-500">{packet.dstIp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
