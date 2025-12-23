// src/llm.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Process article with Gemini to improve formatting and content
 * Using JSON mode for reliable data extraction
 */
export async function processArticleWithLLM(originalArticle, referenceArticles) {
  try {
    console.log(`\nStep 4: Processing with Gemini AI: "${originalArticle.title}"`);

    // 1. Initialize the model with JSON response configuration
    // Use a currently supported Flash model
    const model = genAI.getGenerativeModel({
      // Good default; you can also use "gemini-2.0-flash"
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // 2. Prepare the reference context (truncate to keep prompt safe)
    const referenceContext = referenceArticles
      .map((article, index) => `
        REFERENCE ${index + 1}:
        Source: ${article.url}
        Content Snippet: ${article.content.substring(0, 3000)}
      `)
      .join("\n\n");

    // 3. Construct a structured prompt
    const prompt = `
      You are a professional technical editor. Your task is to rewrite the "Original Article" 
      by incorporating facts, data, and context from the provided "Reference Articles".

      ORIGINAL ARTICLE:
      Title: ${originalArticle.title}
      Content: ${originalArticle.content}

      REFERENCE ARTICLES (RESEARCH):
      ${referenceContext}

      REQUIREMENTS:
      1. Length: Expand the content to be between 800-1200 words.
      2. Formatting: Use Markdown (H2, H3, **bolding**, and bullet points).
      3. Tone: Professional and informative.
      4. Output: You must return a JSON object with exactly two keys: "title" and "content".

      JSON structure:
      {
        "title": "The enhanced title",
        "content": "The full markdown content"
      }
    `;

    // 4. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Parse JSON
    const articleData = JSON.parse(text);

    console.log("✅ Gemini successfully rewrote the article using JSON mode.");

    return {
      title: articleData.title || originalArticle.title,
      content: articleData.content || response.text(),
      references: referenceArticles.map((a) => a.url),
    };
  } catch (error) {
    console.error("❌ Gemini API Error Details:");

    if (error.message?.includes("404")) {
      console.error(
        "-> Tip: The model name might be invalid or deprecated. Try 'gemini-flash-latest' or 'gemini-2.0-flash', and ensure @google/generative-ai is up to date."
      );
    }

    console.error(error.message);

    // Graceful fallback: return original content so the database save doesn't crash
    return {
      title: originalArticle.title,
      content:
        originalArticle.content +
        "\n\n[Note: AI enhancement failed. Showing original content.]",
      references: referenceArticles.map((a) => a.url),
    };
  }
}
