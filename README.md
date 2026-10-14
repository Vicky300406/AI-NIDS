# 🛡️ AI-Powered Network Intrusion Detection System (NIDS)

A comprehensive, real-time Network Intrusion Detection System powered by Machine Learning, featuring a modern React/TypeScript frontend and FastAPI backend.

## 🌟 Overview

This system provides real-time network traffic monitoring, ML-based threat detection, and an intuitive web interface for security analysts. It combines the power of machine learning with real-time data visualization to detect and alert on potential network intrusions.

## ✨ Key Features

- 🔐 **Real-time Threat Detection** - ML-powered analysis of network traffic
- 📊 **Interactive Dashboard** - Comprehensive security metrics and visualizations
- 🚨 **Alert Management** - Real-time notifications and threat tracking
- 📈 **ML Analytics** - Model performance insights and feature analysis
- 📁 **PCAP Analysis** - Upload and analyze packet capture files
- 🎨 **Modern UI** - Dark-themed, responsive interface with smooth animations
- 🔌 **WebSocket Support** - Live data streaming for real-time updates
- 🔒 **Secure Authentication** - JWT-based user authentication

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 3000)              │
│  Dashboard │ Live Monitor │ Alerts │ Network Detection     │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API + WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                  FastAPI Backend (Port 8001)                │
│  Authentication │ ML Predictor │ Alert Manager             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│     SQLite DB │ ML Models (XGBoost) │ Real-time State     │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/))
- **npm** (included with Node.js)

### System Requirements
- Windows 10/11 (Linux/Mac compatible with minor script modifications)
- 4GB RAM minimum (8GB recommended)
- 2GB free disk space

## 🚀 Quick Start

### 🎯 One-Click Installation (Windows)

1. **Download/Clone this repository**
2. **Double-click `START_NIDS_FULL.bat`**
   - This will automatically:
     - Check prerequisites
     - Install dependencies (if needed)
     - Start backend API
     - Start frontend dev server
     - Open in your browser

### 📱 Access the Application

Once started, access at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

**Default Login:**
```
Username: admin
Password: Admin@1234
```

## 📦 Manual Installation

### Backend Setup

```bash
# Navigate to backend directory
cd sentinelx/backend

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
python -m uvicorn app.main:app --reload --port 8001
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd nids-react

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
Working/
├── nids-react/                    # React Frontend
│   ├── src/
│   │   ├── components/           # UI Components
│   │   │   └── Layout.tsx
│   │   ├── pages/                # Application Pages
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LiveMonitor.tsx
│   │   │   ├── Alerts.tsx
│   │   │   ├── NetworkDetection.tsx
│   │   │   └── MLAnalytics.tsx
│   │   ├── services/             # API Integration
│   │   │   └── api.ts
│   │   └── types/                # TypeScript Types
│   ├── INSTALL.bat               # Frontend installer
│   ├── START_DEV.bat             # Frontend launcher
│   └── README.md                 # Frontend docs
│
├── sentinelx/backend/            # FastAPI Backend
│   ├── app/
│   │   ├── routers/              # API Routes
│   │   │   ├── auth_routes.py
│   │   │   ├── predict_routes.py
│   │   │   ├── alerts_routes.py
│   │   │   ├── stats_routes.py
│   │   │   └── stream_routes.py
│   │   ├── ml/                   # ML Components
│   │   │   ├── model_loader.py
│   │   │   └── predictor.py
│   │   ├── services/             # Business Logic
│   │   ├── main.py               # App Entry Point
│   │   ├── auth.py               # Authentication
│   │   ├── database.py           # Database Setup
│   │   └── config.py             # Configuration
│   ├── Model outputs/            # ML Model Files
│   │   ├── best_model.pkl
│   │   ├── scaler.pkl
│   │   └── ...
│   └── requirements.txt          # Python Dependencies
│
├── START_NIDS_FULL.bat           # Master launcher
└── README.md                     # This file
```

## 🎨 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Data Visualization |
| React Router | Navigation |
| Axios | HTTP Client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | Web Framework |
| Python 3.10+ | Language |
| Uvicorn | ASGI Server |
| SQLite | Database |
| JWT | Authentication |
| WebSockets | Real-time Updates |
| Pandas | Data Processing |
| scikit-learn | ML Framework |
| XGBoost | ML Classifier |
| Pydantic | Data Validation |

## 🎯 Features Breakdown

### 1. 📊 Dashboard
- Real-time traffic statistics
- Threat detection overview
- System health metrics
- Recent alerts summary
- Interactive charts and graphs

### 2. 🔴 Live Monitor
- Real-time network traffic stream
- Live packet analysis
- Visual threat indicators
- WebSocket-powered updates
- Auto-scrolling activity feed

### 3. 🚨 Alerts
- Centralized alert management
- Severity-based filtering
- Search and sort functionality
- Detailed alert information
- Alert status tracking

### 4. 🌐 Network Detection
- PCAP file upload support
- Batch traffic analysis
- ML-powered classification
- Detailed prediction results
- CSV export functionality

### 5. 🤖 ML Analytics
- Model performance metrics
- Feature importance visualization
- Confusion matrix
- Historical accuracy trends
- Prediction confidence scores

## 🔧 Configuration

### Frontend Configuration

Edit `nids-react/.env`:
```env
VITE_API_URL=http://localhost:8001
```

### Backend Configuration

Edit `sentinelx/backend/.env`:
```env
PROJECT_NAME=SentinelX AI-NIDS
VERSION=2.0.0
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./nids.db
CORS_ORIGINS=["http://localhost:3000"]
```

## 🧪 Development

### Run Tests
```bash
# Frontend
cd nids-react
npm test

# Backend
cd sentinelx/backend
pytest
```

### Build for Production

**Frontend:**
```bash
cd nids-react
npm run build
```

**Backend:**
```bash
# Backend runs with Uvicorn in production mode
cd sentinelx/backend
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port (Windows)
netstat -ano | findstr :8001
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Backend Won't Start
```bash
# Reinstall Python dependencies
cd sentinelx/backend
pip install --upgrade -r requirements.txt
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
cd nids-react
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Delete and recreate database
cd sentinelx/backend
del nids.db  # or rm nids.db on Linux/Mac
# Restart backend to recreate
```

## 🔒 Security Considerations

- Change default admin password immediately
- Update `SECRET_KEY` in backend `.env`
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regular security audits recommended
- Keep dependencies updated

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts Reference

### Windows Batch Scripts

| Script | Purpose |
|--------|---------|
| `START_NIDS_FULL.bat` | Start both frontend and backend |
| `nids-react/INSTALL.bat` | Install frontend dependencies |
| `nids-react/START_DEV.bat` | Start frontend only |

### NPM Scripts (Frontend)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Python Commands (Backend)

```bash
# Development
python -m uvicorn app.main:app --reload --port 8001

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [scikit-learn](https://scikit-learn.org/)

## 📊 Performance

- **Frontend Load Time**: < 2s
- **API Response Time**: < 100ms
- **WebSocket Latency**: < 50ms
- **ML Prediction Time**: < 200ms

## 🗺️ Roadmap

- [ ] User management and roles
- [ ] Advanced filtering options
- [ ] Export reports (PDF, Excel)
- [ ] Email/SMS alerts
- [ ] Docker deployment
- [ ] Kubernetes support
- [ ] Mobile app
- [ ] Advanced ML models

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Built with modern web technologies
- ML models trained on network traffic datasets
- Icons from Lucide React
- UI inspiration from cyber security dashboards

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Review backend logs

---

**🎉 Ready to start? Run `START_NIDS_FULL.bat` and explore the system!**

**Built with ❤️ using React, TypeScript, FastAPI, and Machine Learning**
