// src/scraper.js
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const BEYONDCHATS_BLOGS_URL =
  process.env.BEYONDCHATS_BLOGS_URL || "https://beyondchats.com/blogs/";
const LARAVEL_API_URL =
  process.env.LARAVEL_API_URL || "http://127.0.0.1:8000/api";

// STEP 1: Scrape 5 oldest BeyondChats articles from LAST page
export async function scrapeBeyondChatsArticles() {
  try {
    console.log("🕸️ Scraping BeyondChats LAST PAGE (5 OLDEST articles)...");

    // 1. Get first page and detect last page number
    const blogsPage = await axios.get(BEYONDCHATS_BLOGS_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const $ = cheerio.load(blogsPage.data);

    let lastPageNum = 1;
    $(".pagination a, .page-link, .page-numbers").each((i, el) => {
      const text = $(el).text().trim();
      const num = parseInt(text);
      if (!isNaN(num) && num > lastPageNum) lastPageNum = num;
    });

    const lastPageUrl =
      lastPageNum > 1
        ? `${BEYONDCHATS_BLOGS_URL}?page=${lastPageNum}`
        : BEYONDCHATS_BLOGS_URL;

    console.log(`📄 Scraping last page ${lastPageNum}: ${lastPageUrl}`);

    // 2. Load last page HTML
    const lastPage = await axios.get(lastPageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const $$ = cheerio.load(lastPage.data);

    // 3. Collect blog links – simplified selector
    const articleLinks = [];
    $$("a[href*='/blogs/']").each((_, el) => {
      const href = $$(el).attr("href");
      const title = $$(el).text().trim();

      if (!href || !title) return;
      if (!href.includes("/blogs/")) return;

      const fullUrl = href.startsWith("http")
        ? href
        : `https://beyondchats.com${href}`;

      if (!articleLinks.some((a) => a.url === fullUrl)) {
        articleLinks.push({ title, url: fullUrl });
      }
    });

    console.log(`Found ${articleLinks.length} blog links on last page`);

    if (!articleLinks.length) {
      console.log("❌ No blog links detected on last page.");
      return [];
    }

    // 4. Scrape FULL CONTENT from first 5 unique links
    const articles = [];
    for (let i = 0; i < Math.min(5, articleLinks.length); i++) {
      const link = articleLinks[i];
      console.log(`Scraping full content [${i + 1}]: ${link.title}`);

      const fullContent = await scrapeArticleContent(link.url);

      articles.push({
        title: link.title,
        content: fullContent,
        excerpt: fullContent.slice(0, 200) + "...",
        url: link.url,
        author: "BeyondChats",
        published_date: new Date().toISOString().split("T")[0],
        is_updated: false,
      });

      // polite delay
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(`✅ Extracted ${articles.length} oldest articles with FULL content`);
    return articles;
  } catch (error) {
    console.error("Error scraping BeyondChats:", error.message);
    return [];
  }
}

// STEP 2: Scrape full content of a single article
export async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const $ = cheerio.load(response.data);

    // Remove noise
    $("script, style, nav, header, footer, .sidebar, .comments").remove();

    const selectors = [
      "article",
      ".article-content",
      ".post-content",
      ".entry-content",
      "main",
      ".content",
      ".blog-content",
    ];

    let content = "";
    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        if (content.length > 500) break;
      }
    }

    if (content.length < 500) {
      content = $("p")
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((t) => t.length > 50)
        .slice(0, 20)
        .join("\n\n");
    }

    return content.trim() || "Full content not available";
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return "Content not available";
  }
}

// STEP 3: Save scraped articles into Laravel API
export async function saveArticlesToAPI(articles) {
  const savedArticles = [];
  for (const article of articles) {
    try {
      const response = await axios.post(`${LARAVEL_API_URL}/articles`, article);
      console.log(`💾 Saved: "${article.title.substring(0, 50)}..."`);
      savedArticles.push(response.data.data);
    } catch (error) {
      console.error(
        `Error saving "${article.title}":`,
        error.response?.data || error.message
      );
    }
  }
  return savedArticles;
}

// AUTO-RUN when called with `node src/scraper.js`
(async () => {
  try {
    console.log("🚀 PHASE 1: Starting BeyondChats scraper...\n");

    const articles = await scrapeBeyondChatsArticles();

    if (!articles.length) {
      console.log("❌ No articles scraped.");
      process.exit(0);
    }

    console.log(`\n💾 Saving ${articles.length} articles to Laravel...\n`);
    const saved = await saveArticlesToAPI(articles);

    console.log(`\n🎉 Phase 1 COMPLETE! ${saved.length} articles saved.`);
    console.log("Now run: npm start (Phase 2)");
  } catch (error) {
    console.error("Scraper failed:", error);
    process.exit(1);
  }
})();
