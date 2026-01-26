/**
 * Calculate reading time in minutes based on text content
 * Assumes average reading speed of 200 words per minute (Norwegian)
 */
export function calculateReadingTime(content: string): number {
  // Remove markdown syntax, HTML tags, and MDX components
  const text = content
    .replace(/```[\s\S]*?```/g, "") // Code blocks
    .replace(/`[^`]+`/g, "") // Inline code
    .replace(/<[^>]+>/g, "") // HTML tags
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Markdown links
    .replace(/[#*_~`]/g, "") // Markdown formatting
    .replace(/\n+/g, " ") // Newlines
    .trim();

  // Count words (split by whitespace)
  const words = text.split(/\s+/).filter((word) => word.length > 0);

  // Norwegian reading speed is typically 200-250 words per minute
  // Using 200 for a conservative estimate
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(words.length / wordsPerMinute);

  // Minimum 1 minute
  return Math.max(1, readingTime);
}

import GithubSlugger from "github-slugger";

/**
 * Extract headings from MDX content
 * Returns array of headings with their level and slug
 */
export function extractHeadings(content: string): Array<{
  level: number;
  title: string;
  slug: string;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; title: string; slug: string }> = [];
  const slugger = new GithubSlugger();

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const slug = slugger.slug(title);

    headings.push({ level, title, slug });
  }

  return headings;
}

/**
 * Format reading time as a human-readable string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 min lesetid";
  }
  return `${minutes} min lesetid`;
}
