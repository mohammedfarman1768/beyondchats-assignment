import axios from "axios";
import dotenv from "dotenv";

import { searchGoogle } from "./googleSearch.js";
import { scrapeMultipleUrls } from "./contentScraper.js";
import { processArticleWithLLM } from "./llmProcessor.js";

dotenv.config();

const LARAVEL_API_URL =
  process.env.LARAVEL_API_URL || "http://127.0.0.1:8000/api";

async function processLatestArticle() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 Starting Article Processing Pipeline");
    console.log("=".repeat(60), "\n");

    // STEP 1: Fetch latest article
    console.log("Step 1: Fetching latest article...");
    const response = await axios.get(`${LARAVEL_API_URL}/articles/latest`);
    const originalArticle = response.data?.data;

    if (!originalArticle) {
      console.log("❌ No articles found in database.");
      return;
    }

    console.log(`✅ Found article: "${originalArticle.title}"\n`);

    // STEP 2: Google search
    console.log("Step 2: Searching Google...");
    const searchResults = await searchGoogle(originalArticle.title);

    if (!searchResults.length) {
      console.log("⚠️ No Google results found");
      return;
    }

    // STEP 3: Scrape content
    console.log("Step 3: Scraping reference articles...");
    const urls = searchResults.map((r) => r.url);
    const scrapedArticles = await scrapeMultipleUrls(urls);

    // Attach title from searchResults so references stay aligned
    const successfulScrapes = scrapedArticles
      .filter((a) => a.success)
      .map((a) => ({
        ...a,
        title: searchResults.find((r) => r.url === a.url)?.title || "Reference",
      }));

    console.log(`✅ Successfully scraped ${successfulScrapes.length} articles\n`);

    if (!successfulScrapes.length) {
      console.log("❌ No successful scrapes found.");
      return;
    }

    // STEP 4: Process with Gemini
    console.log("Step 4: Processing with Gemini AI...");
    const improvedArticle = await processArticleWithLLM(
      originalArticle,
      successfulScrapes
    );

    // Add references section using the URLs returned by the LLM
    const referencesSection =
      "\n\n---\n\n## References\n\n" +
      improvedArticle.references
        .map((url, i) => {
          const match = successfulScrapes.find((a) => a.url === url);
          const title = match?.title || `Reference ${i + 1}`;
          return `${i + 1}. [${title}](${url})`;
        })
        .join("\n");

    improvedArticle.content += referencesSection;

    // STEP 5: Save article
    console.log("Step 5: Saving improved article to Neon...");
    const updatedArticle = {
      title: improvedArticle.title,
      content: improvedArticle.content,
      excerpt: improvedArticle.content.slice(0, 200) + "...",
      is_updated: true,
      original_article_id: originalArticle.id,
      references: improvedArticle.references,
      author: originalArticle.author || "AI Editor",
      published_date: new Date().toISOString().split("T")[0],
    };

    const saveResponse = await axios.post(
      `${LARAVEL_API_URL}/articles`,
      updatedArticle
    );
    console.log(`🎉 Saved article ID: ${saveResponse.data.data.id}`);
    console.log("\nPipeline completed successfully! ✅");
  } catch (error) {
    console.error("\n❌ Pipeline error:", error.message);
  }
}

// SIMPLIFIED RUN: Just call the function
processLatestArticle();
