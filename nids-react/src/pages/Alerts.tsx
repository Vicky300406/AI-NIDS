import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Filter, Download } from 'lucide-react';
import { mockData } from '../services/api';

export default function Alerts() {
  const [alerts] = useState(mockData.alerts());
  const [filter, setFilter] = useState('all');

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Alerts</h1>
          <p className="text-dark-400">Monitor and manage detected threats</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            className="input pl-11"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${
                filter === f ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-hover group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                alert.severity === 'Critical' ? 'bg-danger-500/20' :
                alert.severity === 'High' ? 'bg-warning-500/20' :
                alert.severity === 'Medium' ? 'bg-yellow-500/20' :
                'bg-success-500/20'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  alert.severity === 'Critical' ? 'text-danger-500' :
                  alert.severity === 'High' ? 'text-warning-500' :
                  alert.severity === 'Medium' ? 'text-yellow-500' :
                  'text-success-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{alert.attackType}</h3>
                  <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-dark-400">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                  <div>
                    <p className="text-dark-400">Source IP</p>
                    <p className="font-mono text-primary-500">{alert.srcIp}:{alert.srcPort}</p>
                  </div>
                  <div>
                    <p className="text-dark-400">Destination IP</p>
                    <p className="font-mono text-primary-500">{alert.dstIp}:{alert.dstPort}</p>
                  </div>
                  <div>
                    <p className="text-dark-400">Protocol</p>
                    <p className="font-semibold">{alert.protocol}</p>
                  </div>
                  <div>
                    <p className="text-dark-400">Confidence</p>
                    <p className="font-semibold">{(alert.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                {alert.description && (
                  <p className="text-sm text-dark-300">{alert.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
