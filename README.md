# Smart Form AI - Backend API

AI-powered form automation and assistance platform.

## Features

✨ **Smart Form Filling** - AI-powered form suggestions
🔐 **User Authentication** - Secure signup and login with JWT
📝 **Form Management** - Create, edit, and manage forms
📊 **Analytics** - Track form submissions and time saved
⚡ **Fast & Lightweight** - Built with Flask

## Tech Stack

- **Backend**: Flask, Flask-SQLAlchemy
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT (PyJWT)
- **Security**: bcrypt password hashing
- **API Format**: RESTful JSON

## Quick Start

### Prerequisites

- Python 3.8+
- pip (Python package manager)
- Virtual environment

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/smart-form-ai-backend.git
cd smart-form-ai-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
