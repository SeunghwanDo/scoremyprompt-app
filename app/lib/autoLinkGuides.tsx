import Link from 'next/link';
import React from 'react';

interface LinkRule {
  pattern: RegExp;
  slug: string;
  label: string;
}

const LINK_RULES: LinkRule[] = [
  { pattern: /\bprompt engineering\b/i, slug: 'prompt-engineering-for-beginners', label: 'prompt engineering' },
  { pattern: /\bPROMPT (?:Score|Framework)\b/, slug: 'prompt-score-framework', label: 'PROMPT Score' },
  { pattern: /\bChatGPT (?:tips|prompt tips)\b/i, slug: 'chatgpt-prompt-tips', label: 'ChatGPT tips' },
  { pattern: /\bmarketers?\b/i, slug: 'prompt-engineering-for-marketers', label: 'marketers' },
  { pattern: /\bdesigners?\b/i, slug: 'prompt-engineering-for-designers', label: 'designers' },
];

const MAX_LINKS_PER_PARAGRAPH = 2;

/**
 * Parses a paragraph of text and replaces keyword matches with <Link> components.
 * - Skips self-links (currentSlug)
 * - Max 2 links per paragraph
 * - Only links the first occurrence of each keyword
 */
export function autoLinkGuides(
  text: string,
  currentSlug: string,
): React.ReactNode {
  const applicableRules = LINK_RULES.filter((rule) => rule.slug !== currentSlug);

  // Find all matches with their positions
  const matches: { index: number; length: number; slug: string }[] = [];

  for (const rule of applicableRules) {
    const match = rule.pattern.exec(text);
    if (match) {
      // Check no overlap with existing matches
      const overlaps = matches.some(
        (m) => match.index < m.index + m.length && match.index + match[0].length > m.index,
      );
      if (!overlaps) {
        matches.push({ index: match.index, length: match[0].length, slug: rule.slug });
      }
    }
    if (matches.length >= MAX_LINKS_PER_PARAGRAPH) break;
  }

  if (matches.length === 0) return text;

  // Sort by position
  matches.sort((a, b) => a.index - b.index);

  // Build React nodes
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((m, i) => {
    // Text before match
    if (m.index > lastIndex) {
      nodes.push(text.slice(lastIndex, m.index));
    }
    // Link
    const matchedText = text.slice(m.index, m.index + m.length);
    nodes.push(
      <Link
        key={`link-${i}`}
        href={`/guides/${m.slug}`}
        className="text-primary hover:text-accent underline underline-offset-2 transition-colors"
      >
        {matchedText}
      </Link>,
    );
    lastIndex = m.index + m.length;
  });

  // Remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes}</>;
}
