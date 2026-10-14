import { motion } from 'framer-motion';
import { Shield, TrendingUp, Zap, Check } from 'lucide-react';
import { mockData } from '../services/api';

export default function MLAnalytics() {
  const models = mockData.mlModels();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ML Analytics</h1>
        <p className="text-dark-400">Machine learning model performance and comparison</p>
      </div>

      {/* Model Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover relative overflow-hidden"
            style={{
              borderColor: model.color + '40',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5"
              style={{
                background: `radial-gradient(circle, ${model.color} 0%, transparent 70%)`,
              }}
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{model.icon}</div>
                {index === 0 && (
                  <span className="badge bg-success-500/20 text-success-500 border-success-500/30">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-2" style={{ color: model.color }}>
                {model.name}
              </h3>
              <p className="text-sm text-dark-400 mb-4">{model.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-dark-700/50">
                  <p className="text-xs text-dark-400 mb-1">F1 Score</p>
                  <p className="text-2xl font-bold" style={{ color: model.color }}>
                    {model.testF1.toFixed(3)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-dark-700/50">
                  <p className="text-xs text-dark-400 mb-1">ROC-AUC</p>
                  <p className="text-2xl font-bold" style={{ color: model.color }}>
                    {model.rocAuc.toFixed(3)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-dark-300">
                  <Zap className="w-4 h-4" />
                  {model.speed}
                </div>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: model.color + '20',
                    color: model.color,
                    border: `1px solid ${model.color}40`,
                  }}
                >
                  Select Model
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Model Performance Comparison
          </h3>
          <div className="space-y-3">
            {models.map((model) => (
              <div key={model.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{model.name}</span>
                  <span className="text-sm font-bold" style={{ color: model.color }}>
                    {(model.testF1 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${model.testF1 * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-success-500" />
            Detection Statistics
          </h3>
          <div className="space-y-4">
            <StatItem label="Total Predictions" value="15,842" />
            <StatItem label="True Positives" value="12,593" color="success" />
            <StatItem label="False Positives" value="453" color="warning" />
            <StatItem label="False Negatives" value="201" color="danger" />
            <StatItem label="Accuracy" value="94.8%" color="primary" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color = 'dark' }: any) {
  const colors = {
    success: 'text-success-500',
    warning: 'text-warning-500',
    danger: 'text-danger-500',
    primary: 'text-primary-500',
    dark: 'text-dark-50',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50">
      <span className="text-dark-400">{label}</span>
      <span className={`text-xl font-bold ${colors[color]}`}>{value}</span>
    </div>
  );
}
