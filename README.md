# BeyondChats Engineering Assignment

**Full-Stack AI-Powered Content Enrichment Platform**  
Laravel + Node.js + React.js Implementation

---

## 🌐 Live Deployment

- **Frontend Dashboard**: https://beyondchats-frontend-9wdu.onrender.com
- **Laravel REST API**: https://beyondchats-api-k93h.onrender.com
- **Node.js Processing Service**: https://beyondchats-app.onrender.com

---

## 📖 Overview

An automated pipeline that scrapes blog articles, enriches content using Google's Gemini 1.5 Flash LLM with external research, and displays results in a modern React dashboard.

**Key Features:**
- Automated web scraping with Puppeteer
- AI-powered content enrichment with external source integration
- RESTful API with Laravel
- Modern React dashboard with side-by-side comparison

---

## 🏗️ System Architecture

```
BeyondChats Blog → Node.js Scraper → Laravel API + Database
                                            ↓
                     Google Gemini ← External Research Sources
                           ↓
                   Enhanced Content → React Frontend
```

**Data Flow:**
1. **Phase 1**: Scrape 5 oldest articles from BeyondChats blog
2. **Phase 2**: Fetch article → Google search → Inject context → LLM rewrite → Store enhanced version
3. **Phase 3**: Display original vs enriched content in React dashboard

---

## 🛠️ Technology Stack

- **Backend**: PHP 8.2, Laravel 11, MySQL
- **Processing**: Node.js, Puppeteer, Cheerio, Google Generative AI (Gemini 1.5 Flash)
- **Frontend**: React 18, Vite, Tailwind CSS, Axios

---

## 📁 Project Structure

```
beyondchats-assignment/
├── laravel-api/          # Backend REST API
├── nodejs-scraper/       # Scraping + LLM Pipeline
└── react-frontend/       # Frontend Dashboard
```

---

## 🚀 Installation

### 1. Backend (Laravel API)

```bash
cd laravel-api
composer install
cp .env.example .env
php artisan key:generate
# Configure database in .env
php artisan migrate
php artisan serve
```

### 2. Processing Pipeline (Node.js)

```bash
cd nodejs-scraper
npm install
cp .env.example .env
# Add LARAVEL_API_URL and GEMINI_API_KEY in .env
npm run phase1  # Scrape articles
npm run phase2  # LLM enrichment
```

### 3. Frontend (React)

```bash
cd react-frontend
npm install
cp .env.example .env
# Add VITE_API_BASE_URL in .env
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/articles | Get all articles |
| GET | /api/articles/latest | Get latest original article |
| POST | /api/articles | Create/update article |
| GET | /api/articles/{id} | Get specific article |

---

## 🔧 Implementation Details

**Scraping Strategy:**
- Puppeteer navigates to oldest articles via pagination
- Scrapes 5 oldest articles as per assignment scope
- Stores original content in database

**LLM Enhancement:**
- Performs Google search using article title
- Scrapes top 2 external sources for context
- Uses Gemini 1.5 Flash with structured JSON prompts
- Generates rewritten content with citations

**Frontend:**
- Side-by-side comparison of original vs enriched content
- Displays reference links for transparency
- Responsive design with Tailwind CSS

---

## 🎯 Key Assumptions

- Limited to 5 oldest articles per assignment requirements
- Top 2 external sources used for context efficiency
- Gemini 1.5 Flash chosen for speed and quality balance

---
