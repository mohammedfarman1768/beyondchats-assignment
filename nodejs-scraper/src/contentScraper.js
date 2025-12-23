import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrape main content from a URL
 */
export async function scrapeContent(url) {
  try {
    console.log(`Scraping content from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $(
      "script, style, nav, header, footer, .nav, .menu, .sidebar, .advertisement, .ads, .social-share"
    ).remove();

    const contentSelectors = [
      "article",
      '[role="article"]',
      ".article-content",
      ".post-content",
      ".entry-content",
      ".blog-content",
      "main article",
      "main",
      ".content"
    ];

    let content = "";
    let title = $("h1").first().text().trim();

    // Try main content selectors
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const paragraphs = element
          .find("p")
          .map((_, el) => $(el).text().trim())
          .get();

        content = paragraphs.join("\n\n");
        if (content.length > 300) break;
      }
    }

    // Fallback: all paragraphs
    if (!content || content.length < 300) {
      content = $("p")
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(p => p.length > 50)
        .join("\n\n");
    }

    // Clean content
    content = content
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();

    if (!title) {
      title = $("title").text().trim();
    }

    console.log(`Scraped ${content.length} characters from ${url}`);

    return {
      url,
      title,
      content: content || "Content not available",
      success: content.length > 300
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      title: "",
      content: "Failed to scrape content",
      success: false
    };
  }
}

/**
 * Scrape multiple URLs
 */
export async function scrapeMultipleUrls(urls) {
  const results = [];

  for (const url of urls) {
    const result = await scrapeContent(url);
    results.push(result);

    // delay to avoid blocking
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}
