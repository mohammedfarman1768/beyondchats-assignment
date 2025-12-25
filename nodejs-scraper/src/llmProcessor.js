// src/llm.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export async function processArticleWithLLM(originalArticle, referenceArticles) {
  try {
    console.log(`\nStep 4: Processing with Gemini AI: "${originalArticle.title}"`);


    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const referenceContext = referenceArticles
      .map((article, index) => `
        REFERENCE ${index + 1}:
        Source: ${article.url}
        Content Snippet: ${article.content.substring(0, 3000)}
      `)
      .join("\n\n");

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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

    return {
      title: originalArticle.title,
      content:
        originalArticle.content +
        "\n\n[Note: AI enhancement failed. Showing original content.]",
      references: referenceArticles.map((a) => a.url),
    };
  }
}
