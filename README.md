BeyondChats Assignment – Laravel + NodeJS + React
This monorepo is an implementation of the BeyondChats engineering assignment:

Phase 1: Scrape 5 oldest blog articles from the last page of BeyondChats and store them in a Laravel API.

Phase 2: Use a NodeJS LLM pipeline to rewrite the latest article based on top Google search results and publish the updated version.

Phase 3: Display both original and updated articles in a ReactJS frontend.

1. Project Structure
bash
beyondchats-assignment/
├─ laravel-api/        # Laravel backend (articles CRUD + DB)
├─ nodejs-scraper/     # NodeJS scraper + LLM pipeline
└─ react-frontend/     # React app to view articles
2. Tech Stack
Backend: Laravel, PHP, MySQL/Postgres

Scraper & LLM: NodeJS, Axios, Cheerio, Puppeteer, @google/generative-ai (Gemini)

Frontend: ReactJS (Vite or CRA), Axios, CSS (responsive layout)

3. Data Flow / Architecture
High‑level flow:

Scraper (Node, Phase 1)

nodejs-scraper/src/scraper.js

Detects the last page of https://beyondchats.com/blogs/ and scrapes the 5 oldest blog articles.

For each article:

Resolves its full URL

Scrapes the main HTML content

Sends data to Laravel API via POST /api/articles.

Laravel API (Phase 1)

laravel-api exposes CRUD endpoints for articles:

GET /api/articles

GET /api/articles/{id}

GET /api/articles/latest

POST /api/articles

PUT /api/articles/{id}

DELETE /api/articles/{id}

Each article has:

title, content, excerpt, url, author, published_date

is_updated (boolean)

original_article_id (nullable, references original)

references (JSON array of reference URLs)

LLM Pipeline (Node, Phase 2)

nodejs-scraper/src/index.js

Fetches latest article from Laravel: GET /api/articles/latest.

Searches Google for the article title and extracts external blog/article links (non‑BeyondChats).

Scrapes the main content of the first 2 reference URLs.

Calls Gemini (processArticleWithLLM) with:

Original article content

Reference snippets

Asks for a JSON response: { "title": "...", "content": "..." }

Appends a “## References” section with the 2 URLs at the bottom of the content.

Saves the updated article via POST /api/articles with:

is_updated: true

original_article_id set to the original article’s ID

references set to the list of URLs

React Frontend (Phase 3)

react-frontend consumes Laravel API:

Lists all articles

Shows original and updated versions

For each updated article, shows which original it came from and displays the reference links.

For the architecture diagram, draw a simple flow like:
BeyondChats Blogs → Node Scraper → Laravel DB → Node LLM → Laravel DB (updated) → React Frontend
Export it as PNG from draw.io and add it to the repo (e.g. /docs/architecture.png).

4. Setup & Running Locally
4.1. Common Prerequisites
PHP 8.2+ and Composer

NodeJS 18+ and npm

MySQL or Postgres (or Neon DB)

Gemini API key from Google AI Studio

4.2. Backend – Laravel API
bash
cd laravel-api
cp .env.example .env
Edit .env:

text
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql        # or pgsql
DB_HOST=127.0.0.1
DB_PORT=3306               # or your port
DB_DATABASE=YOUR_DB_NAME
DB_USERNAME=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
Install and migrate:

bash
composer install
php artisan key:generate
php artisan migrate
Run the API:

bash
php artisan serve
# -> http://127.0.0.1:8000
Available API routes:

GET /api/articles

GET /api/articles/latest

GET /api/articles/{id}

POST /api/articles

PUT /api/articles/{id}

DELETE /api/articles/{id}

4.3. NodeJS – Scraper & LLM
bash
cd nodejs-scraper
npm install
cp .env.example .env   # if not present, create .env
.env:

text
LARAVEL_API_URL=http://127.0.0.1:8000/api
BEYONDCHATS_BLOGS_URL=https://beyondchats.com/blogs/
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
Scripts (defined in package.json):

json
"scripts": {
  "phase1": "node src/scraper.js",
  "phase2": "node src/index.js",
  "start": "npm run phase2",
  "full": "npm run phase1 && npm run phase2"
}
Phase 1 – Scrape & store 5 oldest BeyondChats articles
bash
npm run phase1
What it does:

Finds the last blogs page (e.g. ?page=15).

Collects blog article links.

Scrapes full content of the 5 oldest articles.

Sends them to Laravel via POST /api/articles.

Verify:

bash
curl http://127.0.0.1:8000/api/articles
# or open in browser / Postman
You should see 5 articles with author: "BeyondChats" and is_updated: false.

Phase 2 – LLM pipeline
bash
npm start
# or
npm run phase2
What it does:

Fetches latest article from GET /api/articles/latest.

Searches Google for the article title.

Scrapes main content from first 2 external blogs.

Calls Gemini to rewrite the article (Markdown, 800–1200 words).

Appends “## References” with the 2 source URLs.

Saves the new article via POST /api/articles with is_updated: true and original_article_id set.

End result: you will see an extra article in /api/articles that is the updated version of the latest BeyondChats article.

Run full pipeline at once
bash
npm run full   # phase1 + phase2
4.4. Frontend – React App
bash
cd react-frontend
npm install
cp .env.example .env
.env (for Vite):

text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
Run the app:

bash
npm run dev
# e.g. http://localhost:5173
Frontend behavior:

Fetches articles from GET /api/articles.

Displays:

Original articles (where is_updated === false)

Updated articles (where is_updated === true)

For an updated article:

Shows which original article it came from (original_article_id).

Displays the “References” section (links to the external articles used by the LLM).

5. Live Deployment
Fill these in for submission:

Frontend Live URL: https://YOUR_FRONTEND_URL

API Base URL (if deployed): https://YOUR_API_URL/api

Make sure the frontend uses the deployed API base URL in its .env.

6. Notes, Assumptions & Trade‑offs
Google search is implemented via scraping, so it may occasionally hit CAPTCHA; in that case the script still uses the first valid blog/article URLs it can parse.

Gemini model: gemini-flash-latest with responseMimeType: "application/json" for reliable extraction of title and content.

references are stored in the DB as JSON arrays and rendered back into Markdown in the content.

Error handling is focused on keeping the pipeline running (logging and falling back, not failing the entire pipeline on a single bad scrape).

7. How to Review
Run Laravel API (laravel-api).

Run full Node pipeline (nodejs-scraper → npm run full).

Open React UI (react-frontend → npm run dev).

Compare:

Original scraped BeyondChats article.

Updated article produced by LLM (content + formatting + references).

