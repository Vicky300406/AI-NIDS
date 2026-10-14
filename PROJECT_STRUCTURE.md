# 📁 Project Structure

This document outlines the complete structure of the AI-Powered NIDS project after cleanup.

## 🗂️ Directory Layout

```
AI-NIDS/
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 LICENSE                       # MIT License
├── 📄 README.md                     # Main documentation
├── 📄 START_NIDS_FULL.bat          # Master launcher (Windows)
│
├── 📁 .github/                      # GitHub configuration
│   └── workflows/                   # CI/CD workflows (if any)
│
├── 📁 nids-react/                   # React/TypeScript Frontend
│   ├── 📁 public/                   # Static assets
│   ├── 📁 src/                      # Source code
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   └── Layout.tsx          # Main layout with sidebar
│   │   ├── 📁 pages/               # Application pages
│   │   │   ├── Login.tsx           # Login page
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── LiveMonitor.tsx     # Real-time monitoring
│   │   │   ├── Alerts.tsx          # Alert management
│   │   │   ├── NetworkDetection.tsx # PCAP analysis
│   │   │   └── MLAnalytics.tsx     # ML insights
│   │   ├── 📁 services/            # API integration
│   │   │   └── api.ts              # API client & mock data
│   │   ├── 📁 types/               # TypeScript definitions
│   │   │   └── index.ts            # Type definitions
│   │   ├── App.tsx                 # Root component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── 📄 .env                      # Environment variables
│   ├── 📄 .gitignore               # Frontend ignore rules
│   ├── 📄 index.html               # HTML template
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 tsconfig.json            # TypeScript config
│   ├── 📄 vite.config.ts           # Vite configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS config
│   ├── 📄 postcss.config.js        # PostCSS config
│   ├── 📄 INSTALL.bat              # Frontend installer
│   ├── 📄 START_DEV.bat            # Frontend launcher
│   └── 📄 README.md                # Frontend documentation
│
└── 📁 sentinelx/                    # Backend container
    ├── 📄 .env.example              # Environment template
    │
    └── 📁 backend/                  # FastAPI Backend
        ├── 📁 app/                  # Application code
        │   ├── 📁 routers/          # API route handlers
        │   │   ├── auth_routes.py   # Authentication endpoints
        │   │   ├── predict_routes.py # ML prediction endpoints
        │   │   ├── alerts_routes.py # Alert management
        │   │   ├── stats_routes.py  # Statistics endpoints
        │   │   ├── devices_routes.py # Device management
        │   │   └── stream_routes.py # WebSocket streaming
        │   │
        │   ├── 📁 ml/               # Machine Learning
        │   │   ├── model_loader.py  # Model initialization
        │   │   └── predictor.py     # Prediction logic
        │   │
        │   ├── 📁 services/         # Business logic
        │   │   └── state_manager.py # Application state
        │   │
        │   ├── main.py              # FastAPI app entry
        │   ├── auth.py              # Auth utilities
        │   ├── database.py          # Database setup
        │   └── config.py            # Configuration
        │
        ├── 📁 Model outputs/        # ML model files
        │   ├── best_model.pkl       # Trained XGBoost model
        │   ├── scaler.pkl           # Feature scaler
        │   ├── categorical_encoders.pkl # Encoders
        │   ├── selected_features.pkl # Feature list
        │   └── target_encoder.pkl   # Target encoder
        │
        ├── 📄 .env                  # Backend environment (ignored by git)
        ├── 📄 Dockerfile            # Docker configuration
        ├── 📄 requirements.txt      # Python dependencies
        └── 📄 nids_users.db         # SQLite database (ignored by git)
```

## 🎯 Key Components

### Frontend (React/TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router for navigation
- **HTTP Client**: Axios for API calls

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.10+
- **Server**: Uvicorn ASGI server
- **Database**: SQLite with direct SQL
- **Authentication**: JWT tokens with bcrypt
- **Real-time**: WebSocket support for live updates
- **ML**: XGBoost for intrusion detection

## 📦 Important Files

### Configuration Files
- **`.env`** - Environment variables (not in git)
- **`.env.example`** - Template for environment setup
- **`.gitignore`** - Files to exclude from git
- **`package.json`** - Node.js dependencies
- **`requirements.txt`** - Python dependencies

### Launch Scripts
- **`START_NIDS_FULL.bat`** - Start both frontend and backend (Windows)
- **`nids-react/INSTALL.bat`** - Install frontend dependencies
- **`nids-react/START_DEV.bat`** - Start frontend dev server

### Documentation
- **`README.md`** - Main project documentation
- **`nids-react/README.md`** - Frontend-specific docs
- **`LICENSE`** - MIT License
- **`PROJECT_STRUCTURE.md`** - This file

## 🚀 Quick Start Files

1. **First Time Setup**: Run `nids-react/INSTALL.bat`
2. **Start Backend**: `cd sentinelx/backend && python -m uvicorn app.main:app --reload --port 8001`
3. **Start Frontend**: Run `nids-react/START_DEV.bat`
4. **All-in-One**: Run `START_NIDS_FULL.bat` (opens two terminal windows)

## 🔧 Configuration Needed

### Before First Run

1. **Backend Environment** (`sentinelx/backend/.env`):
   - Copy from `.env.example`
   - Update `JWT_SECRET_KEY` for production
   - Verify `CORS_ORIGINS` includes frontend URL

2. **Frontend Environment** (`nids-react/.env`):
   - Set `VITE_API_URL=http://localhost:8001`
   - Adjust port if backend runs elsewhere

## 📝 Notes

- **node_modules/** - Excluded from git (large dependency folder)
- **__pycache__/** - Excluded from git (Python cache)
- **dist/** - Excluded from git (build output)
- **nids_users.db** - Excluded from git (contains user data)
- **Model outputs/*.pkl** - Included in git (ML models needed for app)

## 🔍 File Counts

- **Total Frontend Source Files**: ~15 TypeScript files
- **Total Backend Source Files**: ~12 Python files
- **Total Configuration Files**: ~10 config files
- **Total Scripts**: 3 batch scripts

## 📊 Technology Summary

| Component | Technology | Files |
|-----------|-----------|-------|
| Frontend UI | React + TypeScript | 15 |
| Backend API | FastAPI + Python | 12 |
| Styling | Tailwind CSS | 1 |
| Database | SQLite | 1 |
| ML Models | XGBoost (pickle) | 5 |

---

**Total Project Size** (excluding node_modules): ~500KB source code
**With Dependencies**: ~200MB (node_modules) + ~50MB (Python packages)
