# MiniMedi - AI-Powered Health Assistant

A full-stack web application that helps users check symptoms and get AI-powered health recommendations.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT and Google OAuth
- **Symptom Checker**: Browse and search through medical symptoms
- **AI Health Assistant**: Get AI-powered health recommendations using GROQ API
- **Responsive Design**: Modern UI with Tailwind CSS and dark mode support
- **Mini Chatbot**: Quick access to health information

## 🛠️ Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS v4
- React Router DOM
- Axios for API calls
- React Toastify for notifications
- Google OAuth integration

### Backend
- Django 5.2.4
- Django REST Framework
- JWT Authentication
- GROQ AI API integration
- SQLite database
- CORS enabled

## 📋 Prerequisites

- Python 3.12+
- Node.js 18+
- pip and npm

## 🔧 Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (use `.env.example` as template):
```env
SECRET_KEY='your-secret-key-here'
GROQ_API_KEY='your-groq-api-key-here'
GOOGLE_CLIENT_ID='your-google-client-id-here'
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start development server:
```bash
python manage.py runserver
```

Backend will run on `http://127.0.0.1:8000/`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173/`

## 🌐 API Endpoints

### Authentication
- `POST /api/users/signup/` - User registration
- `POST /api/users/login/` - User login
- `GET /api/users/profile/` - Get user profile
- `POST /api/users/google-login/` - Google OAuth login

### Symptoms
- `GET /api/symptoms/` - List all symptoms

### AI Check
- `POST /api/aicheck/` - Get AI health recommendations

## 📁 Project Structure

```
minimedi/
├── backend/
│   ├── minimedi/          # Django project settings
│   ├── users/             # User authentication app
│   ├── symptoms/          # Symptoms management app
│   ├── aicheck/           # AI health check app
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment variables template
└── frontend/
    ├── src/
    │   ├── api/           # API configuration
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   └── main.jsx       # Entry point
    ├── package.json       # Node dependencies
    └── vite.config.js     # Vite configuration
```

## 🔒 Security

- JWT tokens for authentication
- Environment variables for sensitive data
- CORS configured for frontend origin
- Password validation with strength requirements
- `.gitignore` configured to exclude sensitive files

## 🚀 Deployment

See [deployment_checklist.md](deployment_checklist.md) for detailed deployment instructions.

### Important for Production:
1. Set `DEBUG = False` in Django settings
2. Update `ALLOWED_HOSTS` with your domain
3. Update `CORS_ALLOWED_ORIGINS` with your frontend URL
4. Use a production database (PostgreSQL recommended)
5. Set up proper static file serving

## 📝 License

This project is for educational purposes.

## 👥 Contributing

Pull requests are welcome. For major changes, please open an issue first.
