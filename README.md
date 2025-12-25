# BeyondChats Engineering Assignment  
Laravel + Node.js + React.js Full-Stack Implementation

This repository contains the complete full-stack solution for the BeyondChats engineering assignment.  
The project demonstrates an end-to-end automated pipeline involving web scraping, LLM-based content enrichment, and a modern web dashboard for visualization.

---

## Live Deployment Links

Frontend Dashboard  
https://beyondchats-frontend-9wdu.onrender.com

Backend REST API (Laravel)  
https://beyondchats-api-k93h.onrender.com

Node.js Processing Service  
https://beyondchats-app.onrender.com

---

## System Architecture and Data Flow

The application follows a multi-phase pipeline where responsibilities are clearly separated across services.

```mermaid
graph TD
    A[BeyondChats Blogs] -->|Phase 1: Scrape Oldest Articles| B[NodeJS Scraper]
    B -->|POST Scraped Data| C[Laravel API + Database]
    C -->|Fetch Latest Original Article| D[NodeJS LLM Pipeline]
    D -->|Google Search| E[External Research Sources]
    E -->|Context Injection| F[Google Gemini 1.5 Flash LLM]
    F -->|Rewrite Content + Add References| G[Laravel API Update]
    G -->|Serve API Data| H[React Frontend Dashboard]
Project Structure
graphql
Copy code
beyondchats-assignment/
├── laravel-api/          # Backend REST API (Laravel 11)
├── nodejs-scraper/       # Scraping + LLM Processing Pipeline
└── react-frontend/       # Frontend Dashboard (React + Vite)
Technical Stack
Backend

PHP 8.2

Laravel 11

MySQL / PostgreSQL

Scraping and Automation

Node.js

Puppeteer (browser automation and navigation)

Cheerio (HTML parsing)

Artificial Intelligence

Google Generative AI

Gemini 1.5 Flash (@google/generative-ai)

Frontend

React.js

Vite

Axios

Tailwind CSS

Local Setup Instructions
1. Backend Configuration (Laravel API)
Navigate to the backend directory:

bash
Copy code
cd laravel-api
Install dependencies:

nginx
Copy code
composer install
Create environment file:

bash
Copy code
cp .env.example .env
Configure database in .env:

ini
Copy code
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
Generate application key:

vbnet
Copy code
php artisan key:generate
Run database migrations:

nginx
Copy code
php artisan migrate
Start the development server:

nginx
Copy code
php artisan serve
2. Processing Pipeline (Node.js Scraper and LLM)
Navigate to the Node.js directory:

bash
Copy code
cd nodejs-scraper
Install dependencies:

nginx
Copy code
npm install
Create and configure .env:

ini
Copy code
LARAVEL_API_URL=http://127.0.0.1:8000/api
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
Run Phase 1 (Scrape oldest articles):

arduino
Copy code
npm run phase1
Run Phase 2 (LLM rewriting and enrichment):

arduino
Copy code
npm run phase2
3. Frontend Application (React)
Navigate to the frontend directory:

bash
Copy code
cd react-frontend
Install dependencies:

nginx
Copy code
npm install
Configure .env:

ini
Copy code
VITE_API_BASE_URL=http://127.0.0.1:8000/api
Start the development server:

arduino
Copy code
npm run dev
API Documentation
Method	Endpoint	Description
GET	/api/articles	Retrieve all original and updated articles
GET	/api/articles/latest	Retrieve the latest original article
POST	/api/articles	Store scraped or LLM-generated content
GET	/api/articles/{id}	Retrieve a specific article by ID

Implementation Details and Assumptions
Scraping Logic

The Node.js scraper analyzes pagination to identify the oldest articles.

Only the five oldest articles are ingested during Phase 1 as per assignment scope.

LLM Strategy

Gemini 1.5 Flash is used in structured JSON-mode prompting.

The output includes a rewritten title, enriched content, and reference links.

Content Enrichment

A Google search is performed using the article title.

The top two non-target sources are scraped and injected as contextual references.

Frontend Design

The dashboard clearly differentiates between original and LLM-updated articles.

Reference links used by the LLM are displayed for transparency.

